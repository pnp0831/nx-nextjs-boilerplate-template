import { act, renderHook } from '@testing-library/react-hooks';

import useLocalStorage from './useLocalStorage';

describe('useLocalStorage', () => {
  it('should initialize with the initial value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    const [storedValue] = result.current;

    expect(storedValue).toBe('initialValue');
  });

  it('should update the stored value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue', true));
    const [, setLocalStorage] = result.current;

    act(() => {
      setLocalStorage('newValue');
    });

    const [storedValue] = result.current;
    expect(storedValue).toBe('newValue');
  });

  it('should persist the value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'initialValue'));
    const [, setLocalStorage] = result.current;

    act(() => {
      setLocalStorage('newValue');
    });

    // Retrieve the value from localStorage
    const localStorageValue = window.localStorage.getItem('testKey');
    expect(localStorageValue).toBe(JSON.stringify('newValue'));
  });
});
