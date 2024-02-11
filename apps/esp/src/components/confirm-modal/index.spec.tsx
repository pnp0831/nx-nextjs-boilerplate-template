import { fireEvent, render, screen } from '@testing-library/react';
import ThemeProvider from '@ui-kit/contexts/theme-context';

import ESPConfirmModal from '.';

describe('ESP Confirm Modal', () => {
  it('should render default successfully', () => {
    const onCloseMock = jest.fn();
    const onCancelMock = jest.fn();
    const onConfirm = jest.fn();
    const { baseElement } = render(
      <ThemeProvider>
        <ESPConfirmModal
          open={false}
          title="Appove request"
          subTitle="Are you sure you want to approve this request?"
          cancelText="No"
          confirmText="Yes"
          onClose={onCloseMock}
          onCancel={onCancelMock}
          onConfirm={onConfirm}
        />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render custom title,subTitle,cancelText,confirmText', () => {
    const onCloseMock = jest.fn();
    const onCancelMock = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ThemeProvider>
        <ESPConfirmModal
          open
          title="Appove request"
          subTitle="Are you sure you want to approve this request?"
          cancelText="No"
          confirmText="Yes"
          onClose={onCloseMock}
          onCancel={onCancelMock}
          onConfirm={onConfirm}
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Are you sure you want to approve this request?')).toBeInTheDocument();
    expect(screen.getByText('Appove request')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    fireEvent.click(screen.getByText('No'));

    expect(onCancelMock).toHaveBeenCalled();
  });

  it('should render default', () => {
    const onCloseMock = jest.fn();
    const onCancelMock = jest.fn();
    const onConfirm = jest.fn();

    render(
      <ThemeProvider>
        <ESPConfirmModal open onClose={onCloseMock} onCancel={onCancelMock} onConfirm={onConfirm} />
      </ThemeProvider>
    );
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save Changes'));

    expect(onConfirm).toHaveBeenCalled();
  });
});
