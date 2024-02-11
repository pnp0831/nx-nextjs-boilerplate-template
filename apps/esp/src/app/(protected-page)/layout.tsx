import AdminLayout from '@esp/components/admin-layout';
import RouterEvents from '@esp/libs/router-events';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminLayout>
      <RouterEvents />
      {children}
    </AdminLayout>
  );
}
