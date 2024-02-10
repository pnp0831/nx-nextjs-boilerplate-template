import {
  email,
  maxLength,
  minLength,
  number,
  regex,
  REGEX_EMAIL,
  REGEX_NUMBER,
  REGEX_URL,
  required,
  sanitizeRules,
  url,
} from './rhf-validation';

describe('Validation Rules', () => {
  describe('required', () => {
    it('should return the required rule with default message', () => {
      const rule = required();
      expect(rule).toEqual({
        required: 'Field is required',
      });
    });

    it('should return the required rule with a custom message', () => {
      const rule = required('Custom required message');
      expect(rule).toEqual({
        required: 'Custom required message',
      });
    });
  });

  describe('email', () => {
    it('should return the email rule with default message', () => {
      const rule = email();
      expect(rule).toEqual({
        pattern: {
          value: REGEX_EMAIL,
          message: 'Invalid email address',
        },
      });
    });

    it('should return the email rule with a custom message', () => {
      const rule = email('Invalid email');
      expect(rule).toEqual({
        pattern: {
          value: REGEX_EMAIL,
          message: 'Invalid email',
        },
      });
    });
  });

  describe('url', () => {
    it('should return the url rule with default message', () => {
      const rule = url();
      expect(rule).toEqual({
        pattern: {
          value: REGEX_URL,
          message: 'Invalid url address',
        },
      });
    });

    it('should return the url rule with a custom message', () => {
      const rule = url('Invalid url');
      expect(rule).toEqual({
        pattern: {
          value: REGEX_URL,
          message: 'Invalid url',
        },
      });
    });
  });

  describe('regex', () => {
    it('should return the regex rule with default message', () => {
      const pattern = REGEX_URL;
      const rule = regex(pattern);
      expect(rule).toEqual({
        pattern: {
          value: pattern,
          message: `Value doest match pattern ${pattern}`,
        },
      });
    });

    it('should return the regex rule with a custom message', () => {
      const pattern = REGEX_URL;
      const rule = regex(pattern, 'Invalid value');
      expect(rule).toEqual({
        pattern: {
          value: pattern,
          message: 'Invalid value',
        },
      });
    });
  });

  describe('number', () => {
    it('should return the number rule with default message', () => {
      const rule = number();
      expect(rule).toEqual({
        pattern: {
          value: REGEX_NUMBER,
          message: 'Field must be a number',
        },
      });
    });

    it('should return the number rule with a custom message', () => {
      const rule = number('Must be a number');
      expect(rule).toEqual({
        pattern: {
          value: REGEX_NUMBER,
          message: 'Must be a number',
        },
      });
    });
  });

  describe('number', () => {
    it('should return the number rule with default message', () => {
      const rule = number();
      expect(rule).toEqual({
        pattern: {
          value: REGEX_NUMBER,
          message: 'Field must be a number',
        },
      });
    });

    it('should return the number rule with a custom message', () => {
      const rule = number('Must be a number');
      expect(rule).toEqual({
        pattern: {
          value: REGEX_NUMBER,
          message: 'Must be a number',
        },
      });
    });
  });

  describe('minLength', () => {
    it('should return the minLength rule with default message', () => {
      const rule = minLength(2);
      expect(rule).toEqual({
        minLength: {
          value: 2,
          message: `Value must be at least 2 characters long`,
        },
      });
    });

    it('should return the minLength rule with a custom message', () => {
      const rule = minLength(5, '5 character');
      expect(rule).toEqual({
        minLength: {
          value: 5,
          message: '5 character',
        },
      });
    });
  });

  describe('maxLength', () => {
    it('should return the maxLength rule with default message', () => {
      const rule = maxLength(2);
      expect(rule).toEqual({
        maxLength: {
          value: 2,
          message: `Value should not exceed 2 characters`,
        },
      });
    });

    it('should return the maxLength rule with a custom message', () => {
      const rule = maxLength(5, '5 character');
      expect(rule).toEqual({
        maxLength: {
          value: 5,
          message: '5 character',
        },
      });
    });
  });

  describe('sanitizeRules', () => {
    it('should return the correctly value', () => {
      const rule = sanitizeRules(required(), maxLength(2));
      expect(rule).toEqual({
        maxLength: {
          value: 2,
          message: `Value should not exceed 2 characters`,
        },
        required: 'Field is required',
      });
    });
  });
});
