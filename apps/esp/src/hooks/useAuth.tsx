import { signIn, signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

interface ParamsSignin {
  email: string;
  password: string;
  rememberMe: boolean;
}

const useAuth = () => {
  const session = useSession();

  const user = useMemo(() => session.data?.user, [session.data?.user]);

  const handleSignIn = useCallback((params: ParamsSignin) => {
    signIn(
      'okta',
      {
        callbackUrl: window.location.origin,
      },
      {
        username: params.email,
        password: params.password,
        rememberMe: params.rememberMe as unknown as string,
      }
    );
  }, []);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: window.location.origin });
  }, []);

  return {
    signIn: handleSignIn,
    signOut: handleSignOut,
    user,
    session,
  };
};

export default useAuth;
