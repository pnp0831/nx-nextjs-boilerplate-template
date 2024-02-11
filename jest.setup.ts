// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

import { TextEncoder, TextDecoder } from 'util';

dayjs.extend(isBetweenPlugin);
dayjs.extend(isSameOrBefore);

class Worker {
  url: string;
  onmessage: MessageHandler;
  constructor(stringUrl: string) {
    this.url = stringUrl;
    this.onmessage = (msg) => {};
  }

  postMessage(msg: string): void {
    this.onmessage(msg);
  }

  terminate(): void {}
}

Object.assign(global, {
  TextDecoder,
  TextEncoder,
  fetch: jest.fn(),
  Worker: Worker,
});

Object.assign(global, 'window', {
  dataLayer: [],
  gtag: jest.fn(),
  open: jest.fn(),
});

type MessageHandler = (msg: string) => void;

jest.mock('next/font/google', () => ({
  ...jest.requireActual('next/font/google'),
  Lato: jest.fn().mockReturnValue({
    style: {
      fontFamily: 'Lato',
    },
  }),
}));
