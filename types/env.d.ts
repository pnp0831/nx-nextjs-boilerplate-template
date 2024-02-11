/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Api url
      API_URL: string;

      // Next auth
      NEXTAUTH_SECRET: string;
      NEXTAUTH_URL: string;

      // Okta
      OKTA_CLIENT_ID: string;
      OKTA_CLIENT_SECRET: string;
      OKTA_CLIENT_ISSUER: string;

      // GA
      GG_MEASUREMENT_ID: string;
      GG_GTM_ID: string;

      NEED_TO_USE_PERMISSION: boolean | string;
      NEED_TO_USE_MOCK_DATA: boolean | string;
      NEED_TO_USE_CONTENT_SECURITY: boolean | string;
      NEED_TO_HIDE_TIME_POLICY: boolean | string;
    }
  }
}

declare module '*.svg' {
  const content: any;
  export const ReactComponent: any;
  export default content;
}

declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args) => void;
    importScripts: (url: string) => void;
    XLSX: {
      read: (...params: unknown[]) => {
        Sheets: {
          [key: string]: unknown;
        };
        SheetNames: string[];
      };
      utils: {
        sheet_to_json: (...params: unknown[]) => string[][];
      };
      [key: string]: unknown;
    };
  }
}
