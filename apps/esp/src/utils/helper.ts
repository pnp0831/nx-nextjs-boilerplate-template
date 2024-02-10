import appConfigs from '@esp/constants/config';
import { ILoadOptions, LOAD_OPTIONS_KEYS } from '@ui-kit/components/table/type';
import dayjs, { Dayjs } from 'dayjs';
import kebabCase from 'lodash/kebabCase';

import { IError } from '../apis/types';
import { MessageError } from '../contexts/notify-context/index';

export const getDatesBetweenTwoDays = (
  startDate: Dayjs,
  endDate: Dayjs,
  format = 'DD/MM/YYYY'
): {
  [key: string]: boolean;
} => {
  const datesBetweenTwoDays: {
    [key: string]: boolean;
  } = {};

  let currentDate = startDate;

  while (currentDate.isSameOrBefore(endDate, 'd')) {
    datesBetweenTwoDays[currentDate.format(format)] = true;

    currentDate = currentDate.add(1, 'day');
  }
  return datesBetweenTwoDays;
};

export function inElement(point: { x: number; y: number }, element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const bottom = rect.bottom + window.scrollY;
  const left = rect.left + window.scrollX;
  const right = rect.right + window.scrollX;

  return point.x >= left && point.x <= right && point.y >= top && point.y <= bottom;
}

export function hexToRgb(hex: string, opacity = 0.3) {
  // Remove the '#' character if present
  hex = hex.replace('#', '');

  // Parse the hexadecimal value to integer
  const bigint = parseInt(hex, 16);

  // Extract the RGB values
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Return the RGB values as an object

  return `rgb(${r}, ${g}, ${b},${opacity})`;
}

export const isServer = typeof window === 'undefined';

export const handleMockData = <T>(mockData: T): T | undefined => {
  const useMockDataConfig = appConfigs.common.useMockData;
  return useMockDataConfig ? mockData : undefined;
};

export const getRouterPermissions = (permissions: string[]): string[] => {
  const dupicateRouterPerms = permissions.map((item) => {
    const [route] = item.split('.');
    return `/${kebabCase(route)}`;
  });

  return [...new Set(dupicateRouterPerms)];
};

export const getUserRole = (permissions: string[]) => {
  const [, role] = permissions[0].split('.');
  return role;
};

export const stringifyLoadOptions = <T>(loadOptions: ILoadOptions & T, dateFields?: string[]) => {
  const tmpLoadOptions = { ...loadOptions } as { [key: string]: unknown };

  Object.keys(tmpLoadOptions).forEach((key) => {
    if (typeof tmpLoadOptions[key] === 'undefined' && !tmpLoadOptions[key]) {
      delete tmpLoadOptions[key];
    }
  });

  Object.keys(tmpLoadOptions)
    .filter((key) => !LOAD_OPTIONS_KEYS.includes(key as keyof ILoadOptions))
    .forEach((key) => {
      const value = tmpLoadOptions[key];

      const isDateValid = validateDate(value as string);

      if (isDateValid) {
        tmpLoadOptions[key] = dayjs(value as string).format('YYYY-MM-DDTHH:mm:ssZ');
      }
    });

  return convertToQueryString(tmpLoadOptions);
};

function convertToQueryString(obj: { [key: string]: unknown }): string {
  const queryStringParts: string[] = [];

  for (const key in obj) {
    const value = obj[key];

    if (LOAD_OPTIONS_KEYS.includes(key as keyof ILoadOptions)) {
      queryStringParts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
      );
    } else {
      if (Array.isArray(value)) {
        for (const arrayItem of value) {
          if (typeof arrayItem === 'object') {
            queryStringParts.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(arrayItem))}`
            );
          } else {
            queryStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(arrayItem)}`);
          }
        }
      } else if (typeof value === 'object') {
        queryStringParts.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(JSON.stringify(value))}`
        );
      } else {
        queryStringParts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`);
      }
    }
  }

  return `${queryStringParts.join('&')}`;
}

export const getServerApiUrl = (currentPathname: string, serverApiUrl?: string) => {
  const resource = currentPathname.split('/')?.[2] || currentPathname;

  const port = {
    'time-management': 30198,
    workflow: 30197,
    identity: 30196,
    'file-management': 30195,
    'progress-management': 30194,
    'resource-management': 30193,
    'task-management': 30192,
    'service-management': 30191,
    notification: 30190,
  }[resource];

  if (serverApiUrl) {
    return `${serverApiUrl}:${port}`;
  }

  return `${port}`;
};

export const triggerDownload = (url: string) => {
  return window.open(url, '_blank');
};

export const validateDate = (input: string | number, format = 'DD/MM/YYYY'): boolean => {
  if (typeof input === 'string' || (typeof input === 'number' && String(input).length > 5)) {
    const dateString = String(input);

    const date = dayjs(dateString, { format });

    return date.format(format) === date.format(format) && date.isValid();
  }

  return false;
};

export const bytesToSize = (bytes: number) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  if (typeof bytes === 'undefined' || Number.isNaN(bytes) || bytes === 0) {
    return null;
  }

  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  if (index === 0) {
    return `${bytes} ${sizes[index]}`;
  }

  return `${(bytes / 1024 ** index).toFixed(1)} ${sizes[index]}`;
};

export const getErrorMessages = (messages: MessageError) => {
  let errorMsg = '';

  switch (true) {
    case messages instanceof Error:
      errorMsg = (messages as Error).message;
      break;

    case Array.isArray(messages):
      errorMsg = (messages as IError[]).map((item) => item.detail).join('\n');
      break;

    default:
      errorMsg = messages as string;
      break;
  }

  return errorMsg;
};

export const MAX_FOR_MAX_DUR = dayjs().startOf('day').set('hour', 12).set('minute', 1);
export const MIN_FOR_MAX_DUR = dayjs().startOf('day').set('minute', 4);

export const getAcronym = (name: string) => {
  const words = name.split(' ');

  const acronym = (words[0] ? words[0].charAt(0) : '') + (words[1] ? words[1].charAt(0) : '');

  return acronym.toUpperCase();
};
