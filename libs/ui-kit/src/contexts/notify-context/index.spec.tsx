import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';

import { NotifyContextProvider, useNotify } from './index';

describe('NotifyContextProvider', () => {
  test('notifySuccess should enqueue a snackbar with the provided message', async () => {
    const TestComponent = () => {
      const notify = useNotify();

      const handleShowNotify = () => {
        notify.notifySuccess('Test message');
      };

      return (
        <div>
          <button onClick={handleShowNotify}>Show Notify</button>
        </div>
      );
    };

    render(
      <SnackbarProvider>
        <NotifyContextProvider>
          <TestComponent />
        </NotifyContextProvider>
      </SnackbarProvider>
    );

    const showNotifyButton = screen.getByRole('button', { name: 'Show Notify' });

    expect(screen.queryByText('Test message')).toBeNull();

    await act(async () => {
      await showNotifyButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Test message')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('CloseIcon'));
    });
  });

  test('notifyError should enqueue a snackbar with the provided message', async () => {
    const TestComponent = () => {
      const notify = useNotify();

      const handleShowNotify = () => {
        notify.notifyError([{ message: 'Testing Error', errorCode: 400, detail: 'Detail Error' }]);
      };

      return (
        <div>
          <button onClick={handleShowNotify}>Show Error</button>
        </div>
      );
    };

    render(
      <SnackbarProvider>
        <NotifyContextProvider>
          <TestComponent />
        </NotifyContextProvider>
      </SnackbarProvider>
    );

    const showNotifyButton = screen.getByRole('button', { name: 'Show Error' });

    expect(screen.queryByText('Testing Error')).toBeNull();

    await act(async () => {
      await showNotifyButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Detail Error')).toBeInTheDocument();
      fireEvent.click(screen.getByTestId('CloseIcon'));
    });
  });

  test('showError should enqueue a snackbar with the provided message', async () => {
    const TestComponent = () => {
      const notify = useNotify();

      const handleShowNotify = () => {
        notify.notifyError('Testing Error');
      };

      return (
        <div>
          <button onClick={handleShowNotify}>Show Error</button>
        </div>
      );
    };

    render(
      <SnackbarProvider>
        <NotifyContextProvider>
          <TestComponent />
        </NotifyContextProvider>
      </SnackbarProvider>
    );

    const showNotifyButton = screen.getByRole('button', { name: 'Show Error' });

    expect(screen.queryByText('Testing Error')).toBeNull();

    await act(async () => {
      await showNotifyButton.click();
    });
  });

  test('showError should enqueue a snackbar with the provided message with Error', async () => {
    const TestComponent = () => {
      const mockError: Error = {
        message: 'Testing Error',
        name: 'h',
      };

      const notify = useNotify();

      const handleShowNotify = () => {
        notify.notifyError(mockError as Error);
      };

      return (
        <div>
          <button onClick={handleShowNotify}>Show Error</button>
        </div>
      );
    };

    render(
      <SnackbarProvider>
        <NotifyContextProvider>
          <TestComponent />
        </NotifyContextProvider>
      </SnackbarProvider>
    );

    const showNotifyButton = screen.getByRole('button', { name: 'Show Error' });

    expect(screen.queryByText('Testing Error')).toBeNull();

    await act(async () => {
      await showNotifyButton.click();
    });
  });
});
