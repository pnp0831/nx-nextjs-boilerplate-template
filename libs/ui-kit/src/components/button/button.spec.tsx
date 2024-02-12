import ThemeProvider from '@ui-kit/contexts/theme-context';
import AddIcon from '@mui/icons-material/Add';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { theme } from '@ui-kit/theme';

import ESPButton from './button';
import { ESPButton as Button } from './button';

describe('Button', () => {
  it('should render default button successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPButton />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render button successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Button />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render default button', () => {
    render(
      <ThemeProvider>
        <ESPButton>Test Button</ESPButton>
      </ThemeProvider>
    );

    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeInTheDocument();
  });

  it('should render default loading button', () => {
    render(
      <ThemeProvider>
        <ESPButton loading>Test Button</ESPButton>
      </ThemeProvider>
    );

    const loadingIcon = screen.getByRole('progressbar');
    expect(loadingIcon).toBeInTheDocument();
    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeInTheDocument();
  });

  it('should trigger onClick func', () => {
    const onClick = jest.fn();
    render(
      <ThemeProvider>
        <ESPButton onClick={onClick}>Test Button</ESPButton>
      </ThemeProvider>
    );

    const buttonText = screen.getByText('Test Button');
    fireEvent.click(buttonText);
    expect(onClick).toBeCalledTimes(1);
  });

  it('should not trigger onClick func if disabled', () => {
    const onClick = jest.fn();
    render(
      <ThemeProvider>
        <ESPButton disabled onClick={onClick}>
          Test Button
        </ESPButton>
      </ThemeProvider>
    );

    const buttonText = screen.getByText('Test Button');
    expect(buttonText).toBeDisabled();

    fireEvent.click(buttonText);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should not trigger onClick func if loading', () => {
    const onClick = jest.fn();
    render(
      <ThemeProvider>
        <ESPButton loading onClick={onClick}>
          Test Button
        </ESPButton>
      </ThemeProvider>
    );

    const buttonText = screen.getByText('Test Button');

    fireEvent.click(buttonText);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should render icon button based on size and color', () => {
    const sizeAndCorlor: Array<{
      size: 'large' | 'medium' | 'small';
      color: 'primary' | 'secondary';
      height: string;
    }> = [
      { size: 'large', color: 'primary', height: '2.5rem' },
      { size: 'medium', color: 'primary', height: '2rem' },
      { size: 'small', color: 'primary', height: '1.5rem' },
      { size: 'large', color: 'secondary', height: '2.5rem' },
      { size: 'medium', color: 'secondary', height: '2rem' },
      { size: 'small', color: 'secondary', height: '1.5rem' },
    ];

    sizeAndCorlor.map(async (item, index) => {
      render(
        <ThemeProvider>
          <ESPButton
            data-testid={`test-icon-${index}`}
            startIcon={<AddIcon />}
            size={item.size}
            color={item.color}
          />
        </ThemeProvider>
      );

      const iconEl = screen.getByTestId(`test-icon-${index}`);
      fireEvent.mouseEnter(iconEl);

      await waitFor(() => iconEl);

      const colorHover =
        item.color === 'secondary' ? theme.palette.secondary.main : theme.palette.primary.main;
      expect(iconEl).toHaveStyle(`backgroundColor: ${theme.palette.primary.main}`);

      expect(iconEl).toHaveStyleRule(`backgroundColor: ${colorHover}`, {
        modifier: ':hover',
      });
    });
  });

  it('should render the correct styles based on size and color', () => {
    const sizeAndCorlor: Array<{
      size: 'large' | 'medium' | 'small';
      color: 'primary' | 'secondary';
      height: string;
    }> = [
      { size: 'large', color: 'primary', height: '2.5rem' },
      { size: 'medium', color: 'primary', height: '2rem' },
      { size: 'small', color: 'primary', height: '1.5rem' },
      { size: 'large', color: 'secondary', height: '2.5rem' },
      { size: 'medium', color: 'secondary', height: '2rem' },
      { size: 'small', color: 'secondary', height: '1.5rem' },
    ];

    sizeAndCorlor.map((item, index) => {
      render(
        <ThemeProvider>
          <ESPButton size={item.size} color={item.color}>
            Test Button {index}
          </ESPButton>
        </ThemeProvider>
      );

      const buttonText = screen.getByText(`Test Button ${index}`);
      expect(buttonText).toHaveStyle(`height: ${item.height}`);
      expect(buttonText).toHaveStyle(
        `color: ${item.color === 'secondary' ? theme.palette.common.black : 'white'}`
      );
    });
  });
});
