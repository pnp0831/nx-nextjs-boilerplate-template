'use client';

import { email, required, sanitizeRules } from '@esp/utils/rhf-validation';
import { Box, MenuItem } from '@mui/material';
import { ESPAutocomplete } from '@ui-kit/components/autocomplete';
import { ESPAutocompleteEnhancement } from '@ui-kit/components/autocomplete-enhancement';
import { ESPButton } from '@ui-kit/components/button';
import { ESPCheckbox } from '@ui-kit/components/checkbox';
import { ESPDatepicker } from '@ui-kit/components/date-picker';
import { ESPDaterangepicker } from '@ui-kit/components/date-range-picker';
import { ESPDateTimePicker } from '@ui-kit/components/date-time-picker';
import { ESPDropdown } from '@ui-kit/components/dropdown';
import { ESPFormControl, ESPFormControlLabel } from '@ui-kit/components/form-control';
import { ESPInput, ESPInputPassword } from '@ui-kit/components/text-input';
import { ESPTypography } from '@ui-kit/components/typography';
import { ESPUploadInput } from '@ui-kit/components/upload-input';
import StyleGuidePage from '@ui-kit/pages/style-guide';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const JSON_INPUT = [
  {
    name: 'email',
    rules: sanitizeRules(required(), email()),
    placeholder: 'Email',
  },
  {
    name: 'password',
    rules: sanitizeRules(required()),
    type: 'password',
    placeholder: 'Password',
    disabled: true,
  },
];

export default function Index() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = () => {
    setLoading(true);
  };

  return (
    <div>
      <StyleGuidePage>
        <section>
          <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
            Forms Validation
          </ESPTypography>

          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              {JSON_INPUT.map((input) => {
                return (
                  <div key={input.name}>
                    <Controller
                      name={input.name as keyof FormData}
                      control={control}
                      rules={input.rules}
                      render={(params) => (
                        <ESPFormControl
                          style={{ marginTop: '1rem' }}
                          variant="outlined"
                          label={input.name}
                          fullWidth
                          rhfParams={params}
                        >
                          {input.type === 'password' ? (
                            <ESPInputPassword placeholder={input.placeholder} />
                          ) : (
                            <ESPInput placeholder={input.placeholder} />
                          )}
                        </ESPFormControl>
                      )}
                    />
                  </div>
                );
              })}
              <Controller
                name={'date-time'}
                control={control}
                rules={sanitizeRules(required())}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Date Picker'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPDateTimePicker />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'date-picker'}
                control={control}
                rules={sanitizeRules(required())}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Date Picker'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPDatepicker clearable />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'date-range'}
                control={control}
                rules={sanitizeRules(required())}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Date Range'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPDaterangepicker />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'checkbox'}
                control={control}
                rules={sanitizeRules(required())}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Checkbox'}
                    rhfParams={params}
                  >
                    <ESPFormControlLabel
                      control={<ESPCheckbox error={!!errors.checkbox} />}
                      label="Checkbox validate"
                    />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'upload_input'}
                rules={sanitizeRules(required())}
                control={control}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Upload input'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPUploadInput error={!!errors.upload_input} maxSize={5 * 1024 * 1024} />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'dropdown'}
                rules={sanitizeRules(required())}
                control={control}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Dropdown'}
                    fullWidth
                    rhfParams={params}
                    required
                  >
                    <ESPDropdown
                      options={[{ name: 'Select', value: '' }]}
                      sx={{ width: '20rem', marginRight: '20px' }}
                    >
                      <MenuItem value={10}>Ten</MenuItem>
                      <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem>
                    </ESPDropdown>
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'autocomplete'}
                rules={sanitizeRules(required())}
                control={control}
                defaultValue={null}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Autocomplete'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPAutocomplete
                      size="large"
                      options={[
                        { label: 'The Shawshank Redemption', value: 1994 },
                        { label: 'The Shawshank Redemption 1', value: 2000 },
                      ]}
                      placeholder="Select autocomplete"
                      fullWidth
                    />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'autocomplete-multiple'}
                rules={sanitizeRules(required())}
                control={control}
                defaultValue={[]}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Autocomplete Multiple'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPAutocomplete
                      size="large"
                      options={[
                        { label: 'The Shawshank Redemption', value: 1994 },
                        { label: 'The Shawshank Redemption 1', value: 2000 },
                      ]}
                      placeholder="Select autocomplete"
                      fullWidth
                      multiple
                    />
                  </ESPFormControl>
                )}
              />

              <Controller
                name={'autocomplete-enhancement'}
                rules={sanitizeRules(required())}
                control={control}
                defaultValue={null}
                render={(params) => (
                  <ESPFormControl
                    style={{ marginTop: '1rem' }}
                    variant="outlined"
                    label={'Autocomplete enhancement'}
                    fullWidth
                    rhfParams={params}
                  >
                    <ESPAutocompleteEnhancement
                      size="small"
                      options={[{ label: 'The Shawshank Redemption', value: 1994 }]}
                      placeholder="Select autocomplete"
                      fullWidth
                    />
                  </ESPFormControl>
                )}
              />

              <ESPButton sx={{ marginTop: '1rem' }} size="large" type="submit" loading={loading}>
                Validate
              </ESPButton>
            </form>
          </Box>
        </section>
      </StyleGuidePage>
    </div>
  );
}
