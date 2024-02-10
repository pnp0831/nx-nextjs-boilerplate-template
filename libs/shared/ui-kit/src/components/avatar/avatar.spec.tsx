import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render, screen } from '@testing-library/react';

import { ESPTypography } from '../typography';
import { ESPAvatar as AvatarComponent } from '.';
import ESPAvatar from './avatar';

describe('Avatar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <ThemeProvider>
        <AvatarComponent />
      </ThemeProvider>
    );
    expect(baseElement).toBeTruthy();
  });

  it('should render ESPTypo if have props alt', () => {
    const altProps = 'Test Typo';

    render(
      <ThemeProvider>
        <ESPAvatar alt={altProps} data-testid={'avatar-alt'} />
      </ThemeProvider>
    );

    const avatarEl = screen.getByTestId('avatar-alt');
    const typoEl = avatarEl.querySelector('.MuiTypography-bold_s');

    expect(typoEl).toBeInTheDocument();
  });

  it('should render img without props alt', () => {
    const imgSrc = '/icons/avatar.png';

    const { getByRole } = render(
      <ThemeProvider>
        <ESPAvatar data-testid={'badge-ava'} />
      </ThemeProvider>
    );
    const avatarEl = getByRole('img');

    expect(avatarEl).toHaveAttribute('src', imgSrc);
  });

  it('should render if hasDot', () => {
    render(
      <ThemeProvider>
        <ESPAvatar hasDot data-testid={'badge-ava'} />
      </ThemeProvider>
    );

    const avatarEl = screen.getByTestId('badge-ava');

    expect(avatarEl).toBeInTheDocument();
  });
});
