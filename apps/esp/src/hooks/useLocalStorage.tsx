import { isServer } from '@esp/utils/helper';
import { useCallback, useState } from 'react';

function useLocalStorage<Type>(
  key: string,
  initialValue?: Type,
  needToUseRealTimeValue?: boolean
): [Type, (value: Type) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (isServer) {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setLocalStorage = useCallback(
    (value: Type) => {
      if (isServer || typeof key === 'undefined') {
        return;
      }

      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        // Save state
        if (needToUseRealTimeValue) {
          setStoredValue(valueToStore);
        }
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // do nothing
      }
    },
    [key, storedValue, needToUseRealTimeValue]
  );

  return [storedValue, setLocalStorage];
}

export default useLocalStorage;
