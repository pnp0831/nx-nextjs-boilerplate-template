import { fireEvent, render, renderHook } from '@testing-library/react';
import { useRef } from 'react';

import useClickOutside from './useClickOutside';

describe('useClickOutside', () => {
  test('Should call the callback function when clicking outside the element', () => {
    const callback = jest.fn();
    const {
      result: { current: ref },
    } = renderHook(() => useRef<HTMLDivElement>(null));

    render(<div ref={ref}>Click me</div>);

    renderHook(() => useClickOutside(ref, callback));

    fireEvent.click(document);

    expect(callback).toBeCalledTimes(1);
  });

  test('Should not call the callback function when clicking inside the element', () => {
    const callback = jest.fn();
    const {
      result: { current: ref },
    } = renderHook(() => useRef<HTMLDivElement>(null));

    const { getByTestId } = render(
      <div ref={ref} data-testid="element-testid">
        Click me
      </div>
    );

    renderHook(() => useClickOutside(ref, callback));

    fireEvent.click(getByTestId('element-testid'));

    expect(callback).not.toHaveBeenCalled();
  });
});
