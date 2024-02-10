import loThrottle from 'lodash/throttle';
import { useCallback, useLayoutEffect, useState } from 'react';

const useWindowResize = (cb?: () => void) => {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleCallback = useCallback(
    loThrottle((cb: () => void) => {
      cb();
    }, 300),
    []
  );

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      if (typeof cb === 'function') {
        handleCallback(cb);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};

export default useWindowResize;
