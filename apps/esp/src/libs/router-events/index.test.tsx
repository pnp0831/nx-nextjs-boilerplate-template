import { act, render } from '@testing-library/react';
import usePrevious from '@ui-kit/hooks/usePrevious';
import NProgress from 'nprogress';

import RouterEvents, { onComplete, onStart } from './index';

jest.mock('@ui-kit/hooks/usePrevious', () => jest.fn());

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useServerInsertedHTML: jest.fn(),
}));

jest.mock('nprogress', () => ({
  start: jest.fn(),
  done: jest.fn(),
  configure: jest.fn(),
}));

describe('RouterEvents', () => {
  it('should do nothing on mount', () => {
    const { baseElement } = render(<RouterEvents />);

    expect(baseElement).toBeTruthy();
  });

  it('should call onStart and onComplete', () => {
    (usePrevious as jest.Mock).mockReturnValue('/');

    onStart();

    render(<RouterEvents />);

    expect(NProgress.done).toHaveBeenCalled();
  });

  it('should loading progress bar when onStart excuse', async () => {
    await render(<RouterEvents />);

    const func = jest.fn();

    await act(async () => {
      await onStart();

      expect(NProgress.start).toHaveBeenCalled();
      expect(func).not.toHaveBeenCalled();
    });
  });

  it('should loading progress bar when onStart excuse with custom params', async () => {
    await render(<RouterEvents />);

    const func = jest.fn();

    await act(async () => {
      await onStart({ func });

      expect(NProgress.start).toHaveBeenCalled();
      expect(func).toHaveBeenCalled();
    });
  });

  it('progress should complete bar when onComplete excuse', async () => {
    await render(<RouterEvents />);

    const func = jest.fn();

    await act(async () => {
      await onComplete({});

      expect(NProgress.done).toHaveBeenCalled();
      expect(func).not.toHaveBeenCalled();
    });
  });

  it('progress should complete bar when onComplete excuse with custom params', async () => {
    await render(<RouterEvents />);

    const func = jest.fn();

    await act(async () => {
      await onComplete({ func });

      expect(NProgress.done).toHaveBeenCalled();
      expect(func).toHaveBeenCalled();
    });
  });
});
