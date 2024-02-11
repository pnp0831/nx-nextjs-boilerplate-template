import appConfigs from '@esp/constants/config';
import Script from 'next/script';
import { memo } from 'react';

export const dataLayerPush = (event: { event_name: string; [key: string]: unknown }) => {
  if (
    typeof window === 'undefined' ||
    (!appConfigs.client.measurementId && !appConfigs.client.gtmId)
  ) {
    return;
  }

  window.dataLayer.push({
    ...event,
    page_meta_data: 'esp',
    event: event.event_name,
    eventModel: {
      event_name: event.event_name,
      send_to: appConfigs.client.measurementId,
    },
  });

  window.gtag('event', event.event_name, {
    ...event,
    eventModel: {
      event_name: event.event_name,
      send_to: appConfigs.client.measurementId,
    },
  });
};

const GoogleAnalytics = () => {
  return (
    <>
      {appConfigs.client.measurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${appConfigs.client.measurementId}`}
            strategy="afterInteractive"
            async
          />

          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${appConfigs.client.measurementId}',{
                page_path: window.location.pathname,
            });
          `}
          </Script>
        </>
      )}

      {appConfigs.client.gtmId && (
        <Script id="google-tag-manager">
          {`
           (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${appConfigs.client.gtmId}');
          `}
        </Script>
      )}
    </>
  );
};

export default memo(GoogleAnalytics);
