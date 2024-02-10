import { Dayjs } from 'dayjs';

import { IError, MessageError } from '../contexts/notify-context/index';

export const getHtmlFontSize = (): number => {
  if (typeof window === 'undefined') {
    // default of browser
    return 16;
  }

  return Number(
    window.getComputedStyle(document.body).getPropertyValue('font-size').split('px')[0]
  );
};

export const getAcronym = (name: string) => {
  const words = name.split(' ');

  const acronym = (words[0] ? words[0].charAt(0) : '') + (words[1] ? words[1].charAt(0) : '');

  return acronym.toUpperCase();
};

export const hexToRgb = (hex: string, opacity = 0.3) => {
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
};

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
