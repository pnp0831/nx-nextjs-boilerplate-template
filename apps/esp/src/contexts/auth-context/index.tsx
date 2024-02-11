'use client';

import { APP_ROUTE, PUBLIC_PATH } from '@esp/constants';
import useAuth from '@esp/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { BroadcastChannel } from 'next-auth/client/_utils';
import { Session } from 'next-auth/core/types';
import { SessionProvider } from 'next-auth/react';
import React, { ReactNode, useEffect } from 'react';

// eslint-disable-next-line @nx/enforce-module-boundaries
import packageInfo from '../../../../../package.json';

const broadcast = BroadcastChannel();

type AuthContextProps = {
  children: ReactNode;
  session: Session | null;
};

export const AuthHandler = () => {
  const pathname = usePathname();
  const { session } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (session.status === 'authenticated') {
      broadcast.post({ event: 'session', data: { trigger: 'getSession' } });
    }
  }, [session.status]);

  //  Case: User open multiple tabs
  useEffect(() => {
    if (session.status === 'unauthenticated' && !PUBLIC_PATH.includes(pathname)) {
      router.replace(APP_ROUTE.LOGIN);
    }

    if (session.status === 'authenticated' && pathname === APP_ROUTE.LOGIN) {
      router.replace(APP_ROUTE.HOME);
    }
  }, [session.status, pathname, router, session.data?.error]);

  return null;
};

export const AuthContextProvider = ({ children, session }: AuthContextProps) => {
  console.log('You are using:', packageInfo.version);

  return (
    <SessionProvider session={session}>
      <AuthHandler />
      {children}
    </SessionProvider>
  );
};
