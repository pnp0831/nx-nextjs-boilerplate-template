import ThemeProvider from '@ui-kit/contexts/theme-context';
import { fireEvent, render } from '@testing-library/react';

import { ESPPagination as PaginationComponent } from './pagination';
import ESPPagination from './pagination';

describe('Pagination', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <PaginationComponent />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render default successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <ESPPagination />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should trigger onChange function successfully', () => {
    const { baseElement, getByRole } = render(
      <ThemeProvider>
        <ESPPagination count={4} />
      </ThemeProvider>
    );
    const pageTwoButton = getByRole('button', { name: 'page 1' });
    fireEvent.click(pageTwoButton);

    expect(baseElement).toBeTruthy();
  });

  it('should render correct next button', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPPagination showNextLabel data-testid={'pagination'} />
      </ThemeProvider>
    );
    const paginationEl = getByRole('button', { name: 'Go to next page' });

    expect(paginationEl.innerHTML).toEqual('Next');
  });

  it('should render correct previous button', () => {
    const { getByRole } = render(
      <ThemeProvider>
        <ESPPagination showPrevLabel data-testid={'pagination'} />
      </ThemeProvider>
    );
    const paginationEl = getByRole('button', { name: 'Go to previous page' });
    expect(paginationEl.innerHTML).toEqual('Previous');
  });

  it('should called onPageChanges one time when trigger click', () => {
    const onChange = jest.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <ESPPagination onPageChange={onChange} count={3} data-testid={'pagination'} />
      </ThemeProvider>
    );
    const paginationEl = getByRole('button', { name: 'Go to page 2' });
    fireEvent.click(paginationEl);

    expect(onChange).toBeCalledTimes(1);
  });
});
