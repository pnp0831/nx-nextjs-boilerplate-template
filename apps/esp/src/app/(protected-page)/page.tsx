import ESPPageTitle from '@esp/components/page-title';

const Dashboard = () => {
  return (
    <>
      <ESPPageTitle
        title="Dashboard"
        breadcrumbs={[
          {
            name: 'Dashboard',
          },
        ]}
      />
    </>
  );
};

export default Dashboard;
