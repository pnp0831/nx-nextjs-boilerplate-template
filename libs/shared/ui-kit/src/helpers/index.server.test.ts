/**
 * @jest-environment node
 */
import { getHtmlFontSize } from '.';

describe('Helper In Server', () => {
  test('getHtmlFontSize should return true', () => {
    expect(getHtmlFontSize()).toBe(16);
  });
});
