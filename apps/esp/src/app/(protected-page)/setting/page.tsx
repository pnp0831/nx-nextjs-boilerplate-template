import ESPPageTitle from '@esp/components/page-title';
import { APP_ROUTE } from '@esp/constants';

const Setting = () => {
  return (
    <>
      <ESPPageTitle
        title="Setting"
        breadcrumbs={[
          {
            name: 'Dashboard',
            href: APP_ROUTE.HOME,
          },
          {
            name: 'Setting',
          },
        ]}
      />
    </>
  );
};

export default Setting;
