import { SimplePaletteColorOptions } from '@mui/material';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    bold_xl: React.CSSProperties;
    bold_l: React.CSSProperties;
    bold_m: React.CSSProperties;
    bold_s: React.CSSProperties;
    paragraph: React.CSSProperties;
    regular_l: React.CSSProperties;
    regular_m: React.CSSProperties;
    regular_s: React.CSSProperties;
    regular_xs: React.CSSProperties;
  }

  // allow configuration using `createTheme`
  interface TypographyVariantsOptions {
    bold_xl: React.CSSProperties;
    bold_l: React.CSSProperties;
    bold_m: React.CSSProperties;
    bold_s: React.CSSProperties;
    paragraph: React.CSSProperties;
    regular_l: React.CSSProperties;
    regular_m: React.CSSProperties;
    regular_s: React.CSSProperties;
    regular_xs: React.CSSProperties;
  }

  interface Palette {
    text_main: SimplePaletteColorOptions;
    gray_dark: SimplePaletteColorOptions;
    gray_medium: SimplePaletteColorOptions;
    gray_light: SimplePaletteColorOptions;
    black: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;
    black_muted: SimplePaletteColorOptions;
    white_muted: SimplePaletteColorOptions;
    default: SimplePaletteColorOptions;
    mandate: SimplePaletteColorOptions;
    orange: SimplePaletteColorOptions;
    products: SimplePaletteColorOptions;
    installation: SimplePaletteColorOptions;
  }

  interface PaletteOptions {
    text_main: SimplePaletteColorOptions;
    gray_dark: SimplePaletteColorOptions;
    gray_medium: SimplePaletteColorOptions;
    gray_light: SimplePaletteColorOptions;
    black: SimplePaletteColorOptions;
    white: SimplePaletteColorOptions;
    white_muted: SimplePaletteColorOptions;
    black_muted: SimplePaletteColorOptions;
    default: SimplePaletteColorOptions;
    mandate: SimplePaletteColorOptions;
    orange: SimplePaletteColorOptions;
    products: SimplePaletteColorOptions;
    installation: SimplePaletteColorOptions;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    button: false;
    caption: false;
    overline: false;
    subtitle1: false;
    subtitle2: false;
    body1: false;
    body2: false;
    h5: false;
    h6: false;
    inherit: false;
    bold_xl: true;
    bold_l: true;
    bold_m: true;
    bold_s: true;
    paragraph: true;
    regular_l: true;
    regular_m: true;
    regular_s: true;
    regular_xs: true;
  }
}
