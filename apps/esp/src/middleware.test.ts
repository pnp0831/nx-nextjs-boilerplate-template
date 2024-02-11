/**
 * @jest-environment node
 */

import { config } from './middleware';

describe('Middleware', () => {
  test('config should have the correct properties', () => {
    expect(config).toBeDefined();
    expect(config.matcher).toEqual([
      '/((?!api/auth|_next/static|_next/image|images|icons|favicon.ico|style-guide).*)',
    ]);
    expect(config.unstable_allowDynamic).toEqual(['**/node_modules/lodash/_root.js']);
  });
});
