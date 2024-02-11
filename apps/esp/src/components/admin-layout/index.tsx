import { AppContextProvider } from '@esp/contexts/app-context';
import { ImportExportNotifierContextProvider } from '@esp/contexts/import-export-notifier-context';
import { SignalRContextProvider } from '@esp/contexts/signalr-context';

import Content from './content';
import Header from './header';
import Sidebar from './sidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <ImportExportNotifierContextProvider>
      <AppContextProvider>
        <SignalRContextProvider>
          <Header />
          <Sidebar />
          <Content>{children}</Content>
        </SignalRContextProvider>
      </AppContextProvider>
    </ImportExportNotifierContextProvider>
  );
};

export default AdminLayout;
