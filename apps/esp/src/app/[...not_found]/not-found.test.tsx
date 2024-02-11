import { render } from '@testing-library/react';
import { ThemeContextProvider } from '@ui-kit/contexts/theme-context';
import { notFound } from 'next/navigation';

import NotFoundPage from '../not-found';
import NotFoundCatchAll from './page';

jest.mock('next/navigation');

describe('Not found page', () => {
  it('should call notFound() and render not found page', () => {
    notFound.mockImplementation(() => {});

    NotFoundCatchAll();

    expect(notFound).toBeCalledTimes(1);

    const { baseElement, getByText } = render(
      <ThemeContextProvider>
        <NotFoundPage />
      </ThemeContextProvider>
    );
    expect(baseElement).toBeInTheDocument();
    expect(getByText('Page Not Found')).toBeInTheDocument();
  });
});
