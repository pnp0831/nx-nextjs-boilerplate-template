import ESPPageTitle from '@esp/components/page-title';
import { APP_ROUTE } from '@esp/constants';

const ServiceManagement = () => {
  return (
    <>
      <ESPPageTitle
        title="Service Management"
        breadcrumbs={[
          {
            name: 'Dashboard',
            href: APP_ROUTE.HOME,
          },
          {
            name: 'Service Management',
          },
        ]}
      />
    </>
  );
};

export default ServiceManagement;
