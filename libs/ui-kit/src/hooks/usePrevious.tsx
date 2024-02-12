import { useEffect, useRef } from 'react';

function usePrevious<Type>(value: Type): Type {
  const previousRef = useRef<Type>();

  useEffect(() => {
    previousRef.current = value;
  });

  return previousRef.current as Type;
}

export default usePrevious;
