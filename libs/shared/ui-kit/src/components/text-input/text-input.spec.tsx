import ThemeProvider from '@ui-kit/contexts/theme-context';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PersonIcon from '@mui/icons-material/Person';
import InputAdornment from '@mui/material/InputAdornment';
import { fireEvent, render } from '@testing-library/react';

import { ESPInput, ESPInputPassword } from './text-input';

describe('Text Input', () => {
  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <ESPInput placeholder="Normal input" />
      </ThemeProvider>
    );

    const placeholderText = getByPlaceholderText(/Normal input/i);

    expect(placeholderText).toBeInTheDocument();
    expect(placeholderText).toHaveStyle('padding: 16.5px 14px');
  });

  it('should render textarea input with placeholder', () => {
    const { getByPlaceholderText } = render(
      <ThemeProvider>
        <ESPInput placeholder="Normal input" multiline size="small" />
      </ThemeProvider>
    );

    const placeholderText = getByPlaceholderText(/Normal input/i);

    expect(placeholderText).toBeInTheDocument();
  });

  it('should render input with startAdornment', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput
          placeholder="Input icon"
          startAdornment={
            <InputAdornment position="start">
              <PersonIcon />
            </InputAdornment>
          }
        />
      </ThemeProvider>
    );

    const position = baseElement.querySelector('.MuiInputAdornment-positionStart');
    const svgElement = baseElement.querySelector('svg[data-testid="PersonIcon"]');

    expect(svgElement && position).toBeInTheDocument();
  });

  it('should render input with endAdornment', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput
          placeholder="Input icon"
          startAdornment={
            <InputAdornment position="end">
              <PersonIcon />
            </InputAdornment>
          }
        />
      </ThemeProvider>
    );

    const position = baseElement.querySelector('.MuiInputAdornment-positionEnd');
    const svgElement = baseElement.querySelector('svg[data-testid="PersonIcon"]');

    expect(svgElement && position).toBeInTheDocument();
  });

  it('should render input with startAdornment & endAdornment', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput
          placeholder="Input icon"
          startAdornment={
            <InputAdornment position="end">
              <PersonIcon />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="end">
              <MoreHorizIcon />
            </InputAdornment>
          }
        />
      </ThemeProvider>
    );

    const position = baseElement.querySelector('.MuiInputAdornment-positionEnd');
    const starElement = baseElement.querySelector('svg[data-testid="PersonIcon"]');
    const endElement = baseElement.querySelector('svg[data-testid="MoreHorizIcon"]');

    expect(starElement && position && endElement).toBeInTheDocument();
  });

  it('should render search input with placeholder "Search" ', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <ESPInput
          data-testid="input-search"
          placeholder="Input icon"
          startAdornment={
            <InputAdornment position="end">
              <PersonIcon />
            </InputAdornment>
          }
          search
        />
      </ThemeProvider>
    );

    const inputSearch = getByTestId('input-search');
    expect(inputSearch.outerHTML).toContain('placeholder="Search"');
  });

  it('should render search input with SearchIcon ', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput placeholder="Input icon" search />
      </ThemeProvider>
    );

    const position = baseElement.querySelector('.MuiInputAdornment-positionStart');
    const searchIcon = baseElement.querySelector('svg[data-testid="SearchIcon"]');

    expect(searchIcon && position).toBeInTheDocument();
  });

  it('should render search input with success state ', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput placeholder="Input icon" success />
      </ThemeProvider>
    );

    const position = baseElement.querySelector('.MuiInputAdornment-positionEnd');
    const successIcon = baseElement.querySelector('svg[data-testid="CheckIcon"]');
    const colorInput = baseElement.querySelector('.MuiInputBase-colorSuccess');

    expect(position && successIcon && colorInput).toBeInTheDocument();
  });

  it('should render search input with error state ', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPInput placeholder="Input icon" error />
      </ThemeProvider>
    );

    const position = baseElement.querySelector('.MuiInputAdornment-positionEnd');
    const errorIcon = baseElement.querySelector('svg[data-testid="ErrorOutlineIcon"]');
    const colorInput = baseElement.querySelector('.Mui-error');

    expect(position && errorIcon && colorInput).toBeInTheDocument();
  });

  it('should render password input with correct placeholder', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <ThemeProvider>
        <ESPInputPassword placeholder="Password" data-testid="input-password" />
      </ThemeProvider>
    );

    const wrapper = getByTestId('input-password');

    const input = wrapper.querySelector('input');

    expect(input?.getAttribute('type')).toBe('password');

    const visibilityIcon = getByTestId('VisibilityIcon');

    fireEvent.click(visibilityIcon);

    expect(input?.getAttribute('type')).toBe('text');

    const VisibilityOffIcon = getByTestId('VisibilityOffIcon');

    expect(VisibilityOffIcon).toBeInTheDocument();

    const placeholderText = getByPlaceholderText(/Password/i);

    expect(placeholderText).toBeInTheDocument();
  });
});
