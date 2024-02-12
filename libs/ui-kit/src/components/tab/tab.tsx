'use client';

import './index.scss';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import clsx from 'clsx';
import React from 'react';

import { ESPNotAvaliable } from '../not-available';
import { TabComponent } from './components';
import { ESPTabProps, TabsArrayProps } from './type';

function TabPanel({ ...props }: TabsArrayProps) {
  const { children, className, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className={clsx('esp-tabpanel', className)}
      {...other}
    >
      {value === index && <Box className="esp-tabpanel__children">{children}</Box>}
    </div>
  );
}

export function ESPTab({
  tabs = [],
  defaultTab = 0,
  onChangeTab,
  className,
  ...props
}: ESPTabProps) {
  const [value, setValue] = React.useState(defaultTab);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);

    if (typeof onChangeTab === 'function') {
      return onChangeTab(newValue);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: '0.25rem',
      }}
    >
      <TabComponent defaultValue={defaultTab} value={value} onChange={handleChange} {...props}>
        {tabs.map(({ label }, i) => (
          <Tab label={label} key={`${i}-${label}`} />
        ))}
      </TabComponent>
      {tabs.map(({ children, label }, i) => (
        <TabPanel key={`${i}-${label}`} value={value} index={i} className={className}>
          {!children || children === '' ? (
            <Box sx={{ padding: '2.69rem 0 4.44rem', textAlign: 'center' }}>
              <ESPNotAvaliable width={180} height={120} />
            </Box>
          ) : (
            children
          )}
        </TabPanel>
      ))}
    </Box>
  );
}

export default ESPTab;
