import { fireEvent, render } from '@testing-library/react';

import { onStart } from '../router-events';
import NextLink from './index';

jest.mock('../router-events', () => ({
  onStart: jest.fn(),
}));

describe('NextLink', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render an anchor element with href when useLink is false', () => {
    const { getByTestId } = render(
      <NextLink href="https://example.com" data-testid="custom-link" />
    );
    const linkElement = getByTestId('custom-link');
    expect(linkElement.getAttribute('href')).toBe('https://example.com');
  });

  it('should render a NextLink component when useLink is true', () => {
    const onClick = jest.fn();

    const { getByText } = render(
      <NextLink href="/page" data-testid="custom-link">
        Page
      </NextLink>
    );
    const linkElement = getByText('Page');
    expect(linkElement.tagName).toBe('A');
    expect(linkElement.getAttribute('href')).toBe('/page');

    fireEvent.click(linkElement);

    expect(onClick).not.toHaveBeenCalled();
  });

  it('should only call onClick when NextLink is clicked', () => {
    const onClick = jest.fn();

    const { getByText } = render(
      <NextLink href="/page" onClick={onClick} target="_blank">
        Page
      </NextLink>
    );
    const linkElement = getByText('Page');
    fireEvent.click(linkElement);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onStart).not.toHaveBeenCalled();
  });

  it('should call onClick and onStart when NextLink is clicked with modifiers', () => {
    const onClick = jest.fn();

    const { getByText } = render(
      <NextLink href="/page" onClick={onClick}>
        Page
      </NextLink>
    );
    const linkElement = getByText('Page');
    fireEvent.click(linkElement);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onStart).toHaveBeenCalled();
  });

  it('should only call onClick when NextLink is clicked with modifiers', () => {
    const onClick = jest.fn();

    const { getByText } = render(
      <NextLink href="/" onClick={onClick}>
        Page
      </NextLink>
    );
    const linkElement = getByText('Page');
    fireEvent.click(linkElement);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onStart).not.toHaveBeenCalled();
  });
});
