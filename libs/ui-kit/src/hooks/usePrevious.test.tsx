import { act, renderHook } from '@testing-library/react';

import usePrevious from './usePrevious';

describe('usePrevious', () => {
  test('Should return the previous value', () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 0 },
    });

    // Update the value
    act(() => {
      rerender({ value: 10 });
    });

    // Access the previous value
    const previousValue = result.current;

    // Assert the expected result
    expect(previousValue).toBe(0);
  });
});
