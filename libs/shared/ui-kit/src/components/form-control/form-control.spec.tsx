import ThemeProvider from '@ui-kit/contexts/theme-context';
import { render } from '@testing-library/react';

import { ESPInput } from '../text-input/text-input';
import { ESPFormControl } from '.';
import ESPFormControlComponent from './form-control';

describe('ESPFormControl', () => {
  it('should render successfully', () => {
    const { baseElement, getByTestId, getByText } = render(
      <ThemeProvider>
        <ESPFormControl error variant="outlined" helperText="Description">
          <ESPInput value="Error" errorMessage="Description" />
        </ESPFormControl>
      </ThemeProvider>
    );

    expect(getByTestId('ErrorOutlineIcon')).toBeInTheDocument();
    expect(getByText('Description')).toBeInTheDocument();

    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider>
        <ESPFormControlComponent variant="outlined" helperText="Description" label="Label">
          <ESPInput value="Testing" data-testid="input" />
        </ESPFormControlComponent>
      </ThemeProvider>
    );

    expect(getByText('Description')).toBeInTheDocument();
    expect(getByText('Label')).toBeInTheDocument();

    expect(getByTestId('input').querySelector('input')?.getAttribute('value')).toBe('Testing');
  });

  it('should render successfully with react hook form', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ESPFormControlComponent
          variant="outlined"
          label="Email"
          rhfParams={{
            field: {
              name: 'email',
              onBlur: () => {},
              onChange: (event) => {},
              ref: (elm) => {},
              value: '',
            },
            fieldState: {
              error: {
                message: 'Field is required',
                ref: { name: 'email' },
                type: 'required',
              },
              invalid: true,
              isDirty: true,
              isTouched: true,
            },
            formState: {
              errors: {
                email: {
                  message: 'Field is required',
                  ref: { name: 'email' },
                  type: 'required',
                },
              },
              isDirty: false,
              isLoading: false,
              isSubmitSuccessful: false,
              isSubmitted: true,
              isSubmitting: false,
              isValid: false,
              isValidating: false,
              submitCount: 1,
              defaultValues: {},
              dirtyFields: {},
              touchedFields: {},
            },
          }}
        >
          <ESPInput name="email" />
        </ESPFormControlComponent>
      </ThemeProvider>
    );

    expect(getByText('Email')).toBeInTheDocument();
  });

  it('should render successfully with react hook form without error', () => {
    const { getByText } = render(
      <ThemeProvider>
        <ESPFormControlComponent
          variant="outlined"
          label="Email"
          rhfParams={{
            field: {
              name: 'email',
              onBlur: () => {},
              onChange: (event) => {},
              ref: (elm) => {},
              value: '',
            },
            fieldState: {
              invalid: true,
              isDirty: true,
              isTouched: true,
            },
            formState: {
              errors: {},
              isDirty: false,
              isLoading: false,
              isSubmitSuccessful: false,
              isSubmitted: true,
              isSubmitting: false,
              isValid: false,
              isValidating: false,
              submitCount: 1,
              defaultValues: {},
              dirtyFields: {},
              touchedFields: {},
            },
          }}
        >
          <ESPInput name="email" />
        </ESPFormControlComponent>
      </ThemeProvider>
    );

    expect(getByText('Email')).toBeInTheDocument();
  });
});
