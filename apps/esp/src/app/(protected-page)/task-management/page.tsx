import ESPPageTitle from '@esp/components/page-title';
import { APP_ROUTE } from '@esp/constants';

const TaskManagement = () => {
  return (
    <>
      <ESPPageTitle
        title="Task Management"
        breadcrumbs={[
          {
            name: 'Dashboard',
            href: APP_ROUTE.HOME,
          },
          {
            name: 'Task Management',
          },
        ]}
      />
    </>
  );
};

export default TaskManagement;
