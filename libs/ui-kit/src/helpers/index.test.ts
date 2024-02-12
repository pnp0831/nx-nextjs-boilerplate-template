import dayjs from 'dayjs';

import {
  getAcronym,
  getDatesBetweenTwoDays,
  getErrorMessages,
  getHtmlFontSize,
  hexToRgb,
} from './index'; // Replace with the actual module path

describe('getHtmlFontSize', () => {
  beforeEach(() => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      getPropertyValue: () => '16px',
    }));
  });

  it('should return 16 when running in a browser environment', () => {
    expect(getHtmlFontSize()).toBe(16);
  });

  it('should return the correct font size when running in a browser environment', () => {
    jest.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      getPropertyValue: () => '13px',
    }));

    expect(getHtmlFontSize()).toBe(13);
  });
});

describe('hexToRgb', () => {
  test('hexToRgb should return correct value', () => {
    expect(hexToRgb('#000000')).toBe('rgb(0, 0, 0,0.3)');
    expect(hexToRgb('#fafafa', 1)).toBe('rgb(250, 250, 250,1)');
    expect(hexToRgb('#dddddd', 0.4)).toBe('rgb(221, 221, 221,0.4)');
    expect(hexToRgb('#eaeaea', 1)).toBe('rgb(234, 234, 234,1)');
  });
});

describe('getDatesBetweenTwoDays', () => {
  test('getDatesBetweenTwoDays should return correct value', () => {
    expect(getDatesBetweenTwoDays(dayjs(), dayjs().add(1, 'd'))).toEqual({
      [dayjs().format('DD/MM/YYYY')]: true,
      [dayjs().add(1, 'd').format('DD/MM/YYYY')]: true,
    });

    expect(getDatesBetweenTwoDays(dayjs(), dayjs().add(1, 'd'), 'MM/YYYY/DD')).toEqual({
      [dayjs().format('MM/YYYY/DD')]: true,
      [dayjs().add(1, 'd').format('MM/YYYY/DD')]: true,
    });

    expect(
      getDatesBetweenTwoDays(dayjs().subtract(2, 'd'), dayjs().add(2, 'd'), 'MM/YYYY/DD')
    ).toEqual({
      [dayjs().subtract(2, 'd').format('MM/YYYY/DD')]: true,
      [dayjs().subtract(1, 'd').format('MM/YYYY/DD')]: true,
      [dayjs().format('MM/YYYY/DD')]: true,
      [dayjs().add(1, 'd').format('MM/YYYY/DD')]: true,
      [dayjs().add(2, 'd').format('MM/YYYY/DD')]: true,
    });
  });
});

describe('getAcronym', () => {
  test('getAcronym should return correct value', () => {
    expect(getAcronym('Hung Luong')).toBe('HL');
    expect(getAcronym('')).toBe('');
    expect(getAcronym('Aa Bb Cc')).toBe('AB');
  });
});
describe('getErrorMessages', () => {
  test('getErrorMessages should return correct value', () => {
    expect(getErrorMessages(new Error('Testing'))).toBe('Testing');
    expect(getErrorMessages('Testing')).toBe('Testing');
    expect(getErrorMessages([{ errorCode: 400, message: 'Not Found', detail: 'Not Found' }])).toBe(
      'Not Found'
    );
  });
});
