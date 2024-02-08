// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { TextEncoder, TextDecoder } from 'util';

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
});

type MessageHandler = (msg: string) => void;
