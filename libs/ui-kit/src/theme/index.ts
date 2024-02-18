'use client';

import { createTheme } from '@mui/material/styles';
import type * as CSS from 'csstype';
import { Lato } from 'next/font/google';

export type Size = 'large' | 'medium' | 'small';

export interface IStyledCSSProperties {
  [key: string]: CSS.Properties<string | number>;
}

export enum ESP_COLORS {
  PRIMARY = '#FF5308',
  GREEN = '#3CA455',
  ORANGE = '#E67337',
  RED = '#C84040',
  TEXT = '#110F24',
  GRAY_DARK = '#CCCED0',
  GRAY_MEDIUM = '#ECECEE',
  GRAY_LIGHT = '#F6F6F9',
  // CUSTOM
  BLACK = '#333333',
  WHITE = 'white',
  BLACK_MUTED = 'rgba(17, 15, 36, 0.4)',
  WHITE_MUTED = 'rgba(255, 255, 255, 0.4)',
  MANDATE = '#39444E',
  BACKGROUND = '#f2f2f2',
  PRODUCTS = '#9A381F',
  INSTALLATION = 'cc883a',
}

const DEFAULT_FONT = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export enum ESP_TYPOGRAPHY {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  BOLD_XL = 'bold_xl',
  BOLD_L = 'bold_l',
  BOLD_M = 'bold_m',
  BOLD_S = 'bold_s',
  PARAGRAPH = 'paragraph',
  'REGULAR_L' = 'regular_l',
  'REGULAR_M' = 'regular_m',
  'REGULAR_S' = 'regular_s',
  'REGULAR_XS' = 'regular_xs',
}

export const theme = createTheme({
  palette: {
    common: {
      black: ESP_COLORS.BLACK,
    },
    primary: {
      main: ESP_COLORS.PRIMARY,
    },
    secondary: {
      main: ESP_COLORS.GRAY_MEDIUM,
    },
    warning: {
      main: ESP_COLORS.ORANGE,
    },
    success: {
      main: ESP_COLORS.GREEN,
    },
    default: {
      main: ESP_COLORS.BLACK,
    },
    error: {
      main: ESP_COLORS.RED,
    },
    text_main: {
      main: ESP_COLORS.TEXT,
    },
    mandate: {
      main: ESP_COLORS.MANDATE,
    },
    gray_dark: {
      main: ESP_COLORS.GRAY_DARK,
    },
    gray_medium: {
      main: ESP_COLORS.GRAY_MEDIUM,
    },
    gray_light: {
      main: ESP_COLORS.GRAY_LIGHT,
    },
    black: {
      main: ESP_COLORS.BLACK,
    },
    white: {
      main: ESP_COLORS.WHITE,
    },
    black_muted: {
      main: ESP_COLORS.BLACK_MUTED,
    },
    white_muted: {
      main: ESP_COLORS.WHITE_MUTED,
    },
    orange: {
      main: ESP_COLORS.ORANGE,
    },
    products: {
      main: ESP_COLORS.PRODUCTS,
    },
    installation: {
      main: ESP_COLORS.INSTALLATION,
    },
  },
  typography: {
    fontFamily: DEFAULT_FONT?.style?.fontFamily,
    h1: {
      fontSize: '2.5rem',
      lineHeight: '3rem',
      fontWeight: 900,
    },

    h2: {
      fontSize: '2rem',
      lineHeight: '3rem',
      fontWeight: 900,
    },
    h3: {
      fontSize: '1.6875rem',
      lineHeight: '2rem',
      fontWeight: 900,
    },
    h4: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 900,
    },
    bold_xl: {
      fontSize: '1.5rem',
      lineHeight: '2rem',
      fontWeight: 700,
    },
    bold_l: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 700,
    },
    bold_m: {
      fontSize: '0.875rem',
      lineHeight: '1rem',
      fontWeight: 700,
    },
    bold_s: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: 700,
    },
    paragraph: {
      fontSize: '1.25rem',
      lineHeight: '2rem',
      fontWeight: 400,
    },
    regular_l: {
      fontSize: '1rem',
      lineHeight: '1.5rem',
      fontWeight: 400,
    },
    regular_m: {
      fontSize: '0.875rem',
      lineHeight: '1rem',
      fontWeight: 400,
    },
    regular_s: {
      fontSize: '0.75rem',
      lineHeight: '1rem',
      fontWeight: 400,
    },
    regular_xs: {
      fontSize: '0.625rem',
      lineHeight: '0.75rem',
      fontWeight: 400,
    },
  },
  components: {
    MuiTypography: {
      defaultProps: {
        variant: 'regular_l',
        variantMapping: {
          bold_xl: 'strong',
          bold_l: 'strong',
          bold_m: 'strong',
          bold_s: 'strong',
          paragraph: 'p',
          regular_l: 'p',
          regular_m: 'p',
          regular_s: 'p',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiCheckbox: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'medium',
      },
    },
    MuiInput: {
      defaultProps: {
        size: 'medium',
      },
    },
    MuiIcon: {
      defaultProps: {
        fontSize: 'small',
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: ESP_COLORS.BLACK,
        },
      },
    },
  },
});
