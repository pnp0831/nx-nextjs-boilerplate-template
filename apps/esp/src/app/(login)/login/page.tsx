'use client';
import './page.scss';

import { dataLayerPush } from '@esp/components/google-analyze';
import useAuth from '@esp/hooks/useAuth';
import { email, IRHFInput, required, sanitizeRules } from '@esp/utils/rhf-validation';
// import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MUILink from '@mui/material/Link';
import { ESPButton } from '@ui-kit/components/button';
import { ESPCard } from '@ui-kit/components/card';
import { ESPCheckbox } from '@ui-kit/components/checkbox';
import { ESPFormControl, ESPFormControlLabel } from '@ui-kit/components/form-control';
import { ESPInput, ESPInputPassword } from '@ui-kit/components/text-input';
import { ESPTypography } from '@ui-kit/components/typography';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, FieldValues, useForm } from 'react-hook-form';

interface ILoginFormData {
  password: string;
  email: string;
  rememberMe: boolean;
}

interface ILoginInput<T extends FieldValues> extends IRHFInput<T> {
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

const JSON_INPUT: ILoginInput<ILoginFormData>[] = [
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

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit } = useForm<ILoginFormData>({
    defaultValues: {
      email: 'example@strongtie.com',
      rememberMe: false,
      password: 'Abc123456789@@',
    },
  });

  const { signIn } = useAuth();

  const onSubmit = (data: ILoginFormData) => {
    setLoading(true);
    signIn({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    });

    dataLayerPush({ event_name: 'login' });
  };

  return (
    <section className="login">
      <Image
        className="login__logo"
        src="/images/logo.png"
        alt="Simpson Strong Tie"
        width={143}
        height={90}
      />
      <ESPCard>
        <form onSubmit={handleSubmit(onSubmit)} className="login__form">
          {JSON_INPUT.map((input) => {
            return (
              <div className="login__form__input" key={input.name}>
                <Controller
                  name={input.name}
                  control={control}
                  rules={input.rules}
                  render={(params) => (
                    <ESPFormControl
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

          <div className="login__form__checkbox">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <>
                  <ESPFormControlLabel
                    control={<ESPCheckbox size="medium" {...field} />}
                    label="Keep me sign in"
                  />
                  <Link href="/">
                    <MUILink variant="bold_m" component="span" className="login__form__link">
                      Forgot password?
                    </MUILink>
                  </Link>
                </>
              )}
            />
          </div>

          <ESPButton size="large" type="submit" className="login__form__button" loading={loading}>
            Sign In
          </ESPButton>

          <div className="login__form__info">
            <ESPTypography variant="regular_m">
              To create an account or require any further information, please
              <MUILink variant="bold_m" component="a" href="#">
                <span>Send PMA Support Request (smartsheet.com)</span>
              </MUILink>
            </ESPTypography>
          </div>
        </form>
      </ESPCard>
      {/* <Link href="/" className="login__gotoback">
        <ESPTypography variant="regular_m" component="span">
          <KeyboardBackspaceIcon fontSize="small" />
          Click to go back
        </ESPTypography>
      </Link> */}
    </section>
  );
};

export default Login;
