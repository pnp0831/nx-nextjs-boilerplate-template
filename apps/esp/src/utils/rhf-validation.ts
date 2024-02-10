/* eslint-disable no-useless-escape */
import { FieldValues, Path, RegisterOptions } from 'react-hook-form';

export interface IRHFInput<T extends FieldValues> {
  name: keyof T;
  rules?: ValidationRules<T>;
}

export type ValidationRules<T extends FieldValues> =
  | Omit<RegisterOptions<T, Path<T>>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  | undefined;

export const sanitizeRules: SanitizeRules = (...args) =>
  args.reduce((acc, cur) => ({ ...acc, ...cur }), {});

type SanitizeRules = <T extends FieldValues>(...args: ValidationRules<T>[]) => ValidationRules<T>;

export const REGEX_URL =
  /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

export const REGEX_NUMBER = /^[0-9]+$/;

export const REGEX_EMAIL =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const required = (message?: string) => ({
  required: message || 'Field is required',
});

export const email = (message?: string) => ({
  pattern: {
    value: REGEX_EMAIL,
    message: message || 'Invalid email address',
  },
});

export const url = (message?: string) => ({
  pattern: {
    value: REGEX_URL,
    message: message || 'Invalid url address',
  },
});

export const minLength = (value: number, message?: string) => ({
  minLength: {
    value,
    message: message || `Value must be at least ${value} characters long`,
  },
});

export const maxLength = (value: number, message?: string) => ({
  maxLength: {
    value,
    message: message || `Value should not exceed ${value} characters`,
  },
});

export const regex = (pattern: RegExp, message?: string) => ({
  pattern: {
    value: pattern,
    message: message || `Value doest match pattern ${pattern}`,
  },
});

export const number = (message?: string) => ({
  pattern: {
    value: REGEX_NUMBER,
    message: message || 'Field must be a number',
  },
});

export const min = (value: number, message?: string) => ({
  min: {
    value,
    message: message || `Value must be higher than ${value}`,
  },
});

export const max = (value: number, message?: string) => ({
  max: {
    value,
    message: message || `Value must be lower than ${value}`,
  },
});
