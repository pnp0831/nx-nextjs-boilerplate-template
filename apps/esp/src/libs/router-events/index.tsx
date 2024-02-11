'use client';

import { useTheme } from '@mui/material/styles';
import usePrevious from '@ui-kit/hooks/usePrevious';
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import { memo, Suspense, useEffect } from 'react';

interface Params {
  pathname?: string;
  searchParams?: ReadonlyURLSearchParams;
  func?: () => void;
}

export function onStart(params?: Params) {
  NProgress.start();

  if (typeof params?.func === 'function') {
    params.func();
  }
}

export function onComplete(params?: Params) {
  if (typeof params?.func === 'function') {
    params.func();
  }

  NProgress.done(true);
}

interface IRouterEventsProps {
  height?: number;
}

NProgress.configure({ minimum: 0.1, easing: 'ease', speed: 300, trickleSpeed: 100 });

const RouterEvents = ({ height = 2 }: IRouterEventsProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPathname = usePrevious(pathname);
  const previousSearchParams = usePrevious(searchParams);
  const color = useTheme().palette.primary.main;

  useEffect(() => {
    const isFirstLoad = !previousPathname || !previousSearchParams;

    if (!isFirstLoad) {
      onComplete({ pathname, searchParams });
    } else {
      setTimeout(() => {
        if (NProgress.status) {
          NProgress.done(true);
        }
      }, 0);
    }
  }, [pathname, searchParams, previousPathname, previousSearchParams]);

  return (
    <style jsx global>
      {`
        #nprogress {
          pointer-events: none;
        }

        #nprogress .bar {
          background: ${color};
          position: fixed;
          z-index: 1300;
          top: 0;
          left: 0;
          width: 100%;
          height: ${height}px;
        }

        #nprogress .peg {
          display: block;
          position: absolute;
          right: 0px;
          width: 100px;
          height: 100%;
          box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
          opacity: 1;
          -webkit-transform: rotate(3deg) translate(0px, -4px);
          -ms-transform: rotate(3deg) translate(0px, -4px);
          transform: rotate(3deg) translate(0px, -4px);
        }

        .nprogress-custom-parent {
          overflow: hidden;
          position: relative;
        }

        .nprogress-custom-parent #nprogress,
        .nprogress-custom-parent #nprogress .spinner,
        .nprogress-custom-parent #nprogress .bar {
          position: absolute;
        }

        #nprogress .spinner {
          display: block;
          position: fixed;
          z-index: 1231;
          top: 15px;
          right: 15px;
        }

        @-webkit-keyframes nprogress-spinner {
          0% {
            -webkit-transform: rotate(0deg);
          }
          100% {
            -webkit-transform: rotate(360deg);
          }
        }

        @keyframes nprogress-spinner {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}
    </style>
  );
};

const ComponentRouterEvents = memo(() => {
  return (
    <Suspense>
      <RouterEvents />
    </Suspense>
  );
});

ComponentRouterEvents.displayName = 'ComponentRouterEvents';

export default ComponentRouterEvents;
