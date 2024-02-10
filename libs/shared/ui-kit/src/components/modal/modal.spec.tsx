import ThemeProvider from '@ui-kit/contexts/theme-context';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { fireEvent, render } from '@testing-library/react';

import ESPModal from './modal';
import { ESPModal as Modal } from './modal';

describe('Modal', () => {
  it('should render successfully', () => {
    const open = true;

    const { baseElement } = render(
      <ThemeProvider>
        <ESPModal open={open} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render default successfully', () => {
    const open = true;

    const { baseElement } = render(
      <ThemeProvider>
        <Modal open={open} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should trigger onClose func when click X icon', () => {
    const open = true;
    const handleClose = jest.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <ESPModal open={open} onClose={handleClose} />
      </ThemeProvider>
    );

    const closeButton = getByRole('button');
    fireEvent.click(closeButton);

    expect(handleClose).toBeCalledTimes(1);
  });

  it('should render correct content with props', () => {
    const open = true;

    const { baseElement, getByRole } = render(
      <ThemeProvider>
        <ESPModal open={open} title="Modal" actions={<p>Actions</p>}>
          Modal unit test
        </ESPModal>
      </ThemeProvider>
    );

    expect(baseElement.textContent).toContain('Modal unit test');
    expect(baseElement.textContent).toContain('Actions');

    const title = getByRole('heading', { name: 'Modal' });
    expect(title.textContent).toContain('Modal');
  });
  it('should render with custom close icon', () => {
    const open = true;
    const handleClose = jest.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <ESPModal
          open={open}
          closeIcon={
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          }
        />
      </ThemeProvider>
    );

    const closeButton = getByRole('button');
    fireEvent.click(closeButton);

    expect(handleClose).toBeCalledTimes(1);
  });
});
