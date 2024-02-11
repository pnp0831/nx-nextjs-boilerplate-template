import { RefObject, useEffect } from 'react';

const useClickOutside = <T extends HTMLDivElement>(
  ref: RefObject<T | null>,
  callback: (event: Event) => void
) => {
  useEffect(() => {
    const handleClick = (e: Event) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback(e);
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [callback, ref]);
};

export default useClickOutside;
