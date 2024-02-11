import { AppContextProvider } from '@esp/contexts/app-context';

import Content from './content';
import Header from './header';
import Sidebar from './sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <AppContextProvider>
      <Header />
      <Sidebar />
      <Content>{children}</Content>
    </AppContextProvider>
  );
};

export default AdminLayout;
