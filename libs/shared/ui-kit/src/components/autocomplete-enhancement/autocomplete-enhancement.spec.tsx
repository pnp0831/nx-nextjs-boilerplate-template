import ThemeProvider from '@ui-kit/contexts/theme-context';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { ESPAutocompleteEnhancement as Autocomplete } from '.';
import ESPAutocompleteEnhancement from './autocomplete-enhancement';

const mockOptions = [
  { label: 'The Shawshank Redemption', value: 1994 },
  { label: 'The Godfather', value: 1972 },
  { label: 'The Godfather: Part II', value: 1974 },
  { label: 'The Dark Knight', value: 2008 },
];

describe('Autocomplete Enhancement', () => {
  it('should render default successfully', async () => {
    const { baseElement, getByRole } = render(
      <ThemeProvider>
        <ESPAutocompleteEnhancement
          options={[]}
          data-testid={'autocomplete'}
          placeholder="Testing autocomplete"
        />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();

    expect(screen.getByPlaceholderText('Testing autocomplete')).toBeInTheDocument();

    const list = getByRole('combobox');
    fireEvent.mouseDown(list);

    expect(screen.getByText('No Options')).toBeInTheDocument();
  });

  it('should render successfully', async () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPAutocompleteEnhancement data-testid={'autocomplete'} options={[]} />
      </ThemeProvider>
    );

    expect(baseElement).toBeTruthy();
  });

  it('should load options and handle search', async () => {
    // Mock the options
    const loadDataFunc = async () => await new Promise((resolve) => setTimeout(resolve, 20000));

    const { getByRole } = render(
      <ThemeProvider>
        <Autocomplete
          options={mockOptions}
          data-testid={'autocomplete'}
          placeholder="Testing autocomplete"
          loadData={loadDataFunc}
        />
      </ThemeProvider>
    );

    // Simulate search
    const searchInput = getByRole('combobox');

    fireEvent.mouseDown(searchInput);

    await act(async () => {
      await fireEvent.change(searchInput, {
        target: {
          value: 'The Dark',
        },
      });
    });

    fireEvent.mouseDown(searchInput);
  });
});
