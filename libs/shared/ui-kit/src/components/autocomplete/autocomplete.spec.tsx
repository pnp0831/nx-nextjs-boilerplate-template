import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render, screen } from '@testing-library/react';

import ESPAutocomplete from './autocomplete';
import { ESPAutocomplete as Autocomplete, getLimitTags } from './autocomplete';

const top100Films = [
  { label: 'The Shawshank Redemption', value: 1994 },
  { label: 'The Godfather', value: 1972 },
  { label: 'The Godfather: Part II', value: 1974 },
  { label: 'The Dark Knight', value: 2008 },
];

describe('Autocomplete', () => {
  it('getLimitTags should return correct value', () => {
    expect(getLimitTags(200)).toBe(1);
    expect(getLimitTags(501)).toBe(4);
    expect(getLimitTags(355)).toBe(1);
    expect(getLimitTags(455)).toBe(3);
    expect(getLimitTags(411)).toBe(2);
  });

  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <Autocomplete
          options={[]}
          data-testid={'autocomplete'}
          placeholder="Testing autocomplete"
        />
      </ThemeProvider>
    );
    expect(screen.getByPlaceholderText('Testing autocomplete')).toBeInTheDocument();
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPAutocomplete data-testid={'autocomplete'} options={[]} />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render  when options array is empty', async () => {
    const noOptionLabel = 'No Options';
    const { getByRole } = render(
      <ThemeProvider>
        <ESPAutocomplete
          options={[]}
          data-testid={'autocomplete'}
          placeholder="Testing autocomplete"
        />
      </ThemeProvider>
    );

    const list = getByRole('combobox');
    fireEvent.mouseDown(list);

    const noOptionsElement = screen.getByText(noOptionLabel);

    expect(noOptionsElement).toBeInTheDocument();
  });

  it('render options when options is not empty', async () => {
    const label = top100Films[0].label;
    const { getByRole } = render(
      <ThemeProvider>
        <ESPAutocomplete
          options={top100Films}
          data-testid={'autocomplete'}
          placeholder="Testing autocomplete"
        />
      </ThemeProvider>
    );

    const list = getByRole('combobox');
    fireEvent.mouseDown(list);

    const optionsElement = screen.getByText(label);
    expect(optionsElement).toBeInTheDocument();
  });

  it('render autocomplete multiple', async () => {
    const { getByRole, getByText } = render(
      <ThemeProvider>
        <ESPAutocomplete
          options={top100Films}
          placeholder="Select autocomplete"
          fullWidth
          multiple
          limitTags={2}
        />
      </ThemeProvider>
    );

    const list = getByRole('combobox');
    fireEvent.mouseDown(list);

    const optionsElement = getByText(top100Films[0].label);
    expect(optionsElement).toBeInTheDocument();
    fireEvent.click(optionsElement);

    expect(getByText(top100Films[0].label)).toBeInTheDocument();
  });

  it('render autocomplete multiple with limiTags', async () => {
    window.innerWidth = 500;

    const { getByRole, getByText, getByTestId } = render(
      <ThemeProvider>
        <ESPAutocomplete
          options={top100Films}
          placeholder="Select autocomplete"
          fullWidth
          multiple
          limitTags={1}
        />
      </ThemeProvider>
    );

    const list = getByRole('combobox');
    fireEvent.mouseDown(list);

    const optionsElement = getByText(top100Films[3].label);
    expect(optionsElement).toBeInTheDocument();
    fireEvent.click(optionsElement);

    fireEvent.mouseDown(list);

    const optionsElement1 = getByText(top100Films[1].label);
    expect(optionsElement1).toBeInTheDocument();
    fireEvent.click(optionsElement1);

    expect(getByTestId('more')).toBeInTheDocument();
  });

  it('trigger onChange successfully', async () => {
    const mockOnChange = jest.fn();

    const { getByRole, getByText } = render(
      <ThemeProvider>
        <ESPAutocomplete
          options={top100Films}
          placeholder="Select autocomplete"
          fullWidth
          onChange={mockOnChange}
          multiple
          limitTags={0}
        />
      </ThemeProvider>
    );

    const list = getByRole('combobox');
    fireEvent.mouseDown(list);

    const optionsElement = getByText(top100Films[3].label);
    expect(optionsElement).toBeInTheDocument();
    fireEvent.click(optionsElement);

    expect(mockOnChange).toBeCalledTimes(1);
  });
});
