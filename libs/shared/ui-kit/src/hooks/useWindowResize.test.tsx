import { act, render, renderHook } from '@testing-library/react';

import useWindowResize from './useWindowResize';

const mockCallback = jest.fn();

const TestComponentCallback = () => {
  useWindowResize(mockCallback);
  return <div data-testid="test-component" />;
};

const TestComponent = () => {
  useWindowResize();
  return <div data-testid="test-component" />;
};

describe('useWindowResize', () => {
  beforeAll(() => {
    // Mock the window.innerWidth and window.innerHeight properties
    window.innerWidth = 1024;
    window.innerHeight = 768;
  });

  it('should return initial window size', () => {
    const { result } = renderHook(() => useWindowResize());

    expect(result.current.width).toBe(1024);
    expect(result.current.height).toBe(768);
  });

  it('should not call the callback function on resize', () => {
    render(<TestComponent />);

    expect(mockCallback).not.toHaveBeenCalled();
  });

  it('should call the callback function on resize', () => {
    render(<TestComponentCallback />);

    act(() => {
      window.dispatchEvent(new Event('resize'));
    });

    expect(mockCallback).toHaveBeenCalled();
  });
});
