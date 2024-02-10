/**
 * @jest-environment node
 */
import { handleMockData, isServer } from './helper';

jest.mock('@esp/constants/config', () => {
  return {
    common: {
      useMockData: true,
    },
  };
});

describe('Helper', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('isServer should return true', () => {
    expect(isServer).toBe(true);
  });

  test('handleMockData should return correct value', () => {
    expect(handleMockData([])).toEqual([]);
  });
});
