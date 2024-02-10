import dayjs from 'dayjs';

import {
  bytesToSize,
  getAcronym,
  getDatesBetweenTwoDays,
  getRouterPermissions,
  getServerApiUrl,
  getUserRole,
  handleMockData,
  hexToRgb,
  inElement,
  isServer,
  stringifyLoadOptions,
} from './helper';

const perms = [
  'TaskManagement.Admin.ManageTask',
  'TaskManagement.Admin.ManageEmployee',
  'TaskManagement.Admin.ManageResource',
  'TaskManagement.Admin.ManageTime',
  'TimeManagement.Admin.ManageTime',
];

jest.mock('@esp/constants/config', () => ({
  common: {
    useMockData: false,
  },
}));

describe('Helper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(`getServerApiUrl should return the correct value`, () => {
    expect(getServerApiUrl('time-management')).toBe('30198');
    expect(getServerApiUrl('workflow')).toBe('30197');
    expect(getServerApiUrl('identity')).toBe('30196');
    expect(getServerApiUrl('file-management')).toBe('30195');
    expect(getServerApiUrl('progress-management')).toBe('30194');
    expect(getServerApiUrl('resource-management')).toBe('30193');
    expect(getServerApiUrl('task-management')).toBe('30192');
    expect(getServerApiUrl('service-management')).toBe('30191');
    expect(getServerApiUrl('notification')).toBe('30190');

    expect(getServerApiUrl('time-management', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30198'
    );
    expect(getServerApiUrl('workflow', 'http://105pmabeta01')).toBe('http://105pmabeta01:30197');
    expect(getServerApiUrl('identity', 'http://105pmabeta01')).toBe('http://105pmabeta01:30196');
    expect(getServerApiUrl('file-management', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30195'
    );
    expect(getServerApiUrl('progress-management', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30194'
    );
    expect(getServerApiUrl('resource-management', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30193'
    );
    expect(getServerApiUrl('task-management', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30192'
    );
    expect(getServerApiUrl('service-management', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30191'
    );
    expect(getServerApiUrl('notification', 'http://105pmabeta01')).toBe(
      'http://105pmabeta01:30190'
    );
  });

  test(`getUserRole should return the user's role`, () => {
    expect(getUserRole(perms)).toBe('Admin');
  });

  test(`stringifyLoadOptions`, () => {
    expect(
      stringifyLoadOptions({
        skip: 0,
        take: 10,
        testing: 10,
        remarks: undefined,
      })
    ).toBe('skip=0&take=10&testing=10');

    expect(
      stringifyLoadOptions({
        skip: 0,
        take: 10,
        testing: 10,
        units: ['1', '2'],
        units1: [{ name: 'hi' }],
        previous: { testing: '1' },
      })
    ).toBe(
      'skip=0&take=10&testing=10&units=1&units=2&units1=%7B%22name%22%3A%22hi%22%7D&previous=%7B%22testing%22%3A%221%22%7D'
    );
  });

  test(`getRouterPermissions should return the route permission`, () => {
    expect(getRouterPermissions(perms)).toEqual(['/task-management', '/time-management']);
  });

  test('isServer should return false', () => {
    expect(isServer).toBe(false);
  });

  test('hexToRgb should return correct value', () => {
    expect(hexToRgb('#000000')).toBe('rgb(0, 0, 0,0.3)');
    expect(hexToRgb('#fafafa', 1)).toBe('rgb(250, 250, 250,1)');
    expect(hexToRgb('#dddddd', 0.4)).toBe('rgb(221, 221, 221,0.4)');
    expect(hexToRgb('#eaeaea', 1)).toBe('rgb(234, 234, 234,1)');
  });

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

  test('handleMockData should return correct undefined', () => {
    expect(handleMockData([])).toBe(undefined);
  });

  test('inElement should return true when the point is inside the element', () => {
    // Mock the necessary properties and methods
    const elementMock = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        top: 100,
        bottom: 200,
        left: 50,
        right: 150,
      }),
    } as unknown as HTMLElement;

    // Mock the necessary properties and methods from the global `window` object
    const scrollX = 0;
    const scrollY = 0;

    Object.defineProperty(window, 'scrollX', {
      value: scrollX,
      writable: true,
    });

    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      writable: true,
    });

    // Define the point coordinates
    const point = { x: 75, y: 150 };

    // Call the function and assert the expected result
    const result = inElement(point, elementMock);

    expect(result).toBe(true);
  });

  test('inElement should return false when the point is outside the element', () => {
    // Mock the necessary properties and methods
    const elementMock = {
      getBoundingClientRect: jest.fn().mockReturnValue({
        top: 100,
        bottom: 200,
        left: 50,
        right: 150,
      }),
    } as unknown as HTMLElement;

    // Mock the necessary properties and methods from the global `window` object
    const scrollX = 0;
    const scrollY = 0;
    Object.defineProperty(window, 'scrollX', {
      value: scrollX,
      writable: true,
    });
    Object.defineProperty(window, 'scrollY', {
      value: scrollY,
      writable: true,
    });

    // Define the point coordinates
    const point = { x: 25, y: 250 };

    // Call the function and assert the expected result
    const result = inElement(point, elementMock);
    expect(result).toBe(false);
  });
  test('bytesToSize should return correct value', () => {
    expect(bytesToSize(0)).toBeNull();
    expect(bytesToSize(1000)).toBe('1000 Bytes');
    expect(bytesToSize(0.01 * 1024 * 1024)).toBe('10.2 KB');
    expect(bytesToSize(1 * 1024 * 1024)).toBe('1.0 MB');
    expect(bytesToSize(1000 * 1024 * 1024)).toBe('1000.0 MB');
  });

  test('getAcronym should return correct value', () => {
    expect(getAcronym('Hung Luong')).toBe('HL');
    expect(getAcronym('')).toBe('');
    expect(getAcronym('Aa Bb Cc')).toBe('AB');
  });
});
