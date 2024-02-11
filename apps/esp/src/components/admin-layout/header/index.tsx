'use client';

import { dataLayerPush } from '@esp/components/google-analyze';
import { useAppContext } from '@esp/contexts/app-context';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ESPTypography } from '@ui-kit/components/typography';
import lowerCase from 'lodash/lowerCase';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

import Notification from './notification';

const ImportExportNotifier = dynamic(() => import('./import-export-notifier'), { ssr: false });

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  sidebarOpenWidth: string;
  sidebarWidth: string;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) =>
    prop !== 'open' && prop !== 'sidebarOpenWidth' && prop !== 'sidebarWidth',
})<AppBarProps>(({ theme, open, sidebarWidth, sidebarOpenWidth }) => ({
  backgroundColor: '#F2F2F2',
  color: theme.palette.common.black,
  boxShadow: 'none',
  width: `calc(100% - ${sidebarWidth})`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  ...(open && {
    width: `calc(100% - ${sidebarOpenWidth})`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),

  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

const ToolbarComponent = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    paddingLeft: '1rem',
    paddingRight: '1rem',
  },
  minHeight: '4rem',
}));

const mapSpecialTitle = (title: string) => {
  return (
    {
      'import-export': 'report',
      timesheet: 'Time Management',
    }[title] || title
  );
};

const Header = () => {
  const { sidebarOpen, toggleSidebar, sidebarWidth, sidebarOpenWidth, toggleSidebarMobile } =
    useAppContext();

  const pathname = usePathname();

  const splitPathname = pathname.split('/');

  const title = lowerCase(mapSpecialTitle(splitPathname?.[splitPathname.length - 1]));

  const theme = useTheme();

  const screenDesktop = useMediaQuery(theme.breakpoints.up('md'));

  return (
    <AppBar
      position="fixed"
      open={sidebarOpen}
      sidebarWidth={sidebarWidth}
      sidebarOpenWidth={sidebarOpenWidth}
    >
      <ToolbarComponent>
        <IconButton
          onClick={() => {
            dataLayerPush({ event_name: 'click_open_sidebar' });
            if (screenDesktop) {
              return toggleSidebar();
            }

            return toggleSidebarMobile();
          }}
        >
          <MenuOpenIcon
            style={{
              transform: `rotate(${sidebarOpen ? 0 : 180}deg)`,
            }}
          />
        </IconButton>

        <ESPTypography
          variant="bold_l"
          sx={{ flexGrow: 1, textTransform: 'capitalize', color: '#110F24' }}
        >
          {title}
        </ESPTypography>

        <ImportExportNotifier />
        <Notification />
      </ToolbarComponent>
    </AppBar>
  );
};

export default Header;
