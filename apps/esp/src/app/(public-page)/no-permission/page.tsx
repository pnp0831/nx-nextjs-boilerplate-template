'use client';

import { APP_ROUTE } from '@esp/constants';
import { useTheme } from '@mui/material/styles';
import { ESPButton } from '@ui-kit/components/button';
import { ESPTypography } from '@ui-kit/components/typography';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

interface Props {
  code?: number;
  title?: string;
  subTitle?: string;
  href?: string;
}

const NoPermission = ({
  code = 403,
  title = 'Site access denied',
  subTitle = 'Client certificate has expired or is not yet valid. Try another page or use the home button below.',
  href = '/',
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();

  const backToHome = () => {
    router.push(APP_ROUTE.HOME);
  };

  return (
    <section
      className="no-permission"
      style={{
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        position: 'relative',
        padding: '1rem',
      }}
    >
      <Image
        className="no-permission__logo"
        src="/images/logo.png"
        alt="Simpson Strong Tie"
        width={144}
        height={90}
        style={{
          width: '9rem',
          height: '6.625rem',
          objectFit: 'cover',
          marginTop: '5rem',
        }}
      />
      <div
        className="no-permission__overlay"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: 'translate(-50%, -50%)',
          zIndex: -1,
        }}
      >
        <ESPTypography
          style={{
            color: theme.palette.gray_light.main,
            fontSize: '25rem',
            fontWeight: 700,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {code}
        </ESPTypography>
      </div>
      <ESPTypography
        className="no-permission__code"
        style={{
          fontSize: '6rem',
          lineHeight: '6rem',
          fontWeight: 700,
          paddingTop: '8rem',
          paddingBottom: '3rem',
        }}
      >
        {code}
      </ESPTypography>
      <ESPTypography variant="h3" className="no-permission__title">
        {title}
      </ESPTypography>
      <ESPTypography
        variant="regular_l"
        className="no-permission__sub-title"
        style={{
          color: theme.palette.black_muted.main,
          paddingBottom: '3rem',
          paddingTop: '1rem',
        }}
      >
        {subTitle}
      </ESPTypography>
      {APP_ROUTE.HOME !== pathname && (
        <ESPButton size="large" onClick={backToHome}>
          Back to home
        </ESPButton>
      )}
    </section>
  );
};

export default NoPermission;
