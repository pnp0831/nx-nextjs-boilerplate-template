import AddIcon from '@mui/icons-material/Add';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person';
import { AlertColor } from '@mui/material/Alert';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { ESPAlert } from '@ui-kit/components/alert';
import { ESPAutocomplete } from '@ui-kit/components/autocomplete';
import { ESPAutocompleteEnhancement } from '@ui-kit/components/autocomplete-enhancement';
import { ESPAvatar } from '@ui-kit/components/avatar';
import { ESPBadge } from '@ui-kit/components/badge';
import { ESPButton } from '@ui-kit/components/button';
import { ESPCalendar } from '@ui-kit/components/calendar';
import { ESPCard } from '@ui-kit/components/card';
import { ESPCheckbox } from '@ui-kit/components/checkbox';
import { ESPDatepicker } from '@ui-kit/components/date-picker';
import { ESPDaterangepicker } from '@ui-kit/components/date-range-picker';
import { ESPDateTimePicker } from '@ui-kit/components/date-time-picker';
import { ESPDropdown } from '@ui-kit/components/dropdown';
import { ESPFormControl } from '@ui-kit/components/form-control';
import { ESPLoading } from '@ui-kit/components/loading';
import { ESPModal } from '@ui-kit/components/modal';
import { ESPPagination } from '@ui-kit/components/pagination';
import { ESPPopover } from '@ui-kit/components/popover';
import { ESPSlider } from '@ui-kit/components/slider';
import { ESPSwitch } from '@ui-kit/components/switch';
import { ESPTab } from '@ui-kit/components/tab';
import { ESPTable } from '@ui-kit/components/table';
import { ESPTag } from '@ui-kit/components/tag';
import { ESPInput, ESPInputPassword } from '@ui-kit/components/text-input';
import ESPTimepicker from '@ui-kit/components/time-picker';
import { ESPTooltip } from '@ui-kit/components/tooltip';
import { ESPTypography } from '@ui-kit/components/typography';
import { ESPUploadInput } from '@ui-kit/components/upload-input';
import { useNotify } from '@ui-kit/contexts/notify-context';
import { ESP_COLORS, ESP_TYPOGRAPHY, Size } from '@ui-kit/theme';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';

const ESPEditor = dynamic(() => import('@ui-kit/components/editor').then((mod) => mod.ESPEditor), {
  ssr: false,
});

interface Data {
  id: string | number;
  status: string;
  date: string;
  type: string;
  name: string;
}

interface TabsData {
  id?: string | number;
  status: string;
  date: string;
  notes: string;
}

const format = 'DD/MM/YYYY';

const data_table: Data[] = [
  ...Array.from(Array(25)).map((item, id) => ({
    name: `Nguyen Ngoc Phuong Thao ${id + 1}`,
    type: 'Annual leave (2 days)',
    date: '3 - 4 April 2023',
    status: id % 3 === 0 ? 'pending' : id % 3 === 1 ? 'approved' : 'rejected',
    id,
    option: {
      showCheckbox: id % 2 === 1,
    },
  })),
];

const tabsContent: TabsData[] = [
  ...Array.from(Array(5)).map((item, id) => ({
    date: '3 - 4 April 2023',
    status: id % 3 === 0 ? 'pending' : id % 3 === 1 ? 'approved' : 'rejected',
    id,
    notes:
      id % 3 === 0
        ? 'Lorem Ipsum is simply dummy text of the printing and typesetting industry'
        : id % 3 === 1
        ? 'Completed'
        : 'Error',
  })),
];

const columns_table = [
  {
    id: 'name',
  },
  {
    id: 'type',
  },
  {
    id: 'date',
  },
  {
    id: 'action',
    render: (row: Data) => (
      <MoreHorizIcon
        onClick={(e) => {
          e.stopPropagation();
          window.alert(row.name);
        }}
      />
    ),
    align: 'right',
  },
];

const tabs_content = [
  {
    label: 'Import Management',
  },
  {
    label: 'Export Management',
    children: (
      <>
        <ESPTable
          checkboxSelection
          columns={[
            {
              id: 'id',
              label: 'id',
            },
            {
              id: 'date',
              label: 'date',
            },
            {
              id: 'status',
              label: 'status',
              render: (row: { [key: string]: string }) => {
                let component = null;
                switch (row.status) {
                  case 'approved':
                    component = <ESPTag label="Success" color="success" />;
                    break;
                  case 'rejected':
                    component = <ESPTag label="Error" color="error" />;
                    break;
                  case 'pending':
                    component = <ESPTag label="In Progress" />;
                    break;
                  default:
                    break;
                }
                return component;
              },
            },
            {
              id: 'notes',
              label: 'notes',
            },
          ]}
          // @ts-ignore
          data={tabsContent}
          totalItems={tabsContent.length}
        />
        <ESPButton sx={{ marginTop: '1.44rem' }} size="medium">
          Download
        </ESPButton>
      </>
    ),
  },
];

function StyleGuide({ children }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const { notifySuccess } = useNotify();

  const handleShowNotify = (message: string, variant: AlertColor) => {
    notifySuccess(message, {
      variant,
    });
  };

  return (
    <div style={{ width: '80%', margin: ' 2rem auto' }}>
      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          UI Kit/ Style Guide
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Welcome to the UI Kit/ Style Guide. This page gives an overview of all important styles
          and elements that defines UI Design System. Everything is linked, thus, changes will
          propagate throughout the file.
        </ESPTypography>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Colors
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          The color scheme aims to be simple without too many variations. Displayed in both HEX, RGB
          and a production variable (VAR).
        </ESPTypography>

        <Stack
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            rowGap: '8px',
            columnGap: '8px',
          }}
        >
          {Object.keys(ESP_COLORS).map((item) => {
            const colorKey = item as keyof typeof ESP_COLORS;
            return (
              <div key={item}>
                <div style={{ height: '50px', width: '100%', background: ESP_COLORS[colorKey] }} />
                <p>Color: {ESP_COLORS[colorKey]}</p>
                <p>Var: {item}</p>
              </div>
            );
          })}
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Typography
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          We use Lato as primary typeface. The hierarchy is divided in three parts: headings, bold
          and regular body styles. There is also a paragraph style with larger font size and
          line-height.
        </ESPTypography>

        <Stack sx={{ background: '#F6F6F9', padding: '0.75rem' }}>
          {Object.keys(theme.typography)
            .filter((variant) => {
              return Object.values(ESP_TYPOGRAPHY).includes(variant as ESP_TYPOGRAPHY);
            })
            .map((variant) => {
              const typedVariant = variant as ESP_TYPOGRAPHY;

              const item = theme.typography[typedVariant];

              return (
                <div
                  key={variant}
                  style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem' }}
                >
                  <ESPTypography variant={typedVariant} sx={{ textTransform: 'capitalize' }}>
                    {variant}
                  </ESPTypography>
                  <ESPTypography variant={typedVariant}>
                    {item.fontSize} / {item.lineHeight}
                  </ESPTypography>
                </div>
              );
            })}
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Alerts
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Use alerts to give users quick feedback on performed tasks.
        </ESPTypography>

        <Stack spacing={1}>
          <ESPAlert severity="info">Not important, just to let you know.</ESPAlert>
          <ESPAlert severity="success">Great! This is awesome.</ESPAlert>
          <ESPAlert severity="warning">Hmm.. something is not right.</ESPAlert>
          <ESPAlert severity="error">Oh no! Something went wrong :(</ESPAlert>
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Notifications
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Use a notification to give users feedback.
        </ESPTypography>

        <Stack spacing={2} direction={'row'}>
          <ESPButton
            color="success"
            onClick={() => handleShowNotify('Great! This is awesome.', 'success')}
          >
            Noti success
          </ESPButton>
          <ESPButton
            // color="default"
            onClick={() => handleShowNotify('Not important, just to let you know', 'info')}
          >
            Noti default
          </ESPButton>
          <ESPButton
            color="error"
            onClick={() =>
              handleShowNotify(
                'Oh no! Something went wrong :( Oh no! Something went wrong :(',
                'error'
              )
            }
          >
            Noti error
          </ESPButton>
          <ESPButton
            color="warning"
            onClick={() => {
              handleShowNotify('Hmm.. something is not right.', 'warning');
            }}
          >
            Noti warning
          </ESPButton>
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Avatars
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          The avatar is available in three types: icon, initials and profile picture.
        </ESPTypography>

        <Stack spacing={1} direction="row">
          <ESPAvatar src="" />
          <ESPAvatar alt="GH" />
          <ESPAvatar src="https://mui.com/static/images/avatar/1.jpg" />
          <ESPAvatar hasDot src="https://mui.com/static/images/avatar/1.jpg" />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Buttons
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Buttons are pre-defined by type: default, icon left, icon right and icon only.
        </ESPTypography>

        <Stack direction="row" spacing={1}>
          <ESPButton>button</ESPButton>
          <ESPButton startIcon={<AddIcon />}>button</ESPButton>
          <ESPButton endIcon={<AddIcon />}>button</ESPButton>
          <ESPButton endIcon={<AddIcon />} />
          <ESPButton loading>Loading</ESPButton>
        </Stack>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          There are three button states: primary, secondary and disabled.
        </ESPTypography>

        <Stack direction="row" spacing={1}>
          <ESPButton>Primary</ESPButton>
          <ESPButton color="secondary">Secondary</ESPButton>
          <ESPButton disabled>Disabled</ESPButton>
        </Stack>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Each button type is also available in three sizes: large, medium and small.
        </ESPTypography>

        <div style={{ display: 'flex' }}>
          {Array.from(Array(3)).map((_, index) => {
            let size: Size;

            switch (index) {
              case 0:
                size = 'large';
                break;
              case 1:
                size = 'medium';
                break;

              default:
                size = 'small';
                break;
            }

            return (
              <Stack key={index} direction="row" spacing={1} style={{ marginRight: '0.5rem' }}>
                <ESPButton size={size}>Button</ESPButton>

                <ESPButton size={size} endIcon={<AddIcon />} />
              </Stack>
            );
          })}
        </div>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Tags
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Add a tag to give context to your content.
        </ESPTypography>

        <Stack direction="row" spacing={1} alignItems={'center'}>
          <ESPTag label="Default" />
          <ESPTag label="Primary" color="primary" />
          <ESPTag label="Success" color="success" />
          <ESPTag label="Warning" color="warning" />
          <ESPTag label="Error" color="error" />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Forms
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Just as with buttons there are three sizes per type of input field: large, medium and
          small.
        </ESPTypography>

        {Array.from(Array(3)).map((_, index) => {
          let size: Size;

          switch (index) {
            case 0:
              size = 'large';
              break;
            case 1:
              size = 'medium';
              break;

            default:
              size = 'small';
              break;
          }

          return (
            <Stack key={index} direction="row" spacing={1} style={{ marginBottom: '10px' }}>
              <ESPInput placeholder="Text" size={size} />
              <ESPInput
                placeholder="Text"
                size={size}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                }
              />
              <ESPInput
                placeholder="Text"
                size={size}
                startAdornment={
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton>
                      <MoreHorizIcon />
                    </IconButton>
                  </InputAdornment>
                }
              />
              <ESPInputPassword placeholder="Password..." size={size} />
              <ESPInputPassword disabled placeholder="Password..." size={size} />
            </Stack>
          );
        })}

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          You can resize and add labels or a description below input fields for instructions.
        </ESPTypography>

        <Stack>
          <ESPFormControl required variant="outlined" helperText="Description" label="Label">
            <ESPInput multiline placeholder="Text" rows={4} />
          </ESPFormControl>
        </Stack>

        <Stack sx={{ marginTop: '20px' }}>
          <ESPFormControl error required variant="outlined" helperText="Error" label="Name">
            <ESPInput placeholder="Text" />
          </ESPFormControl>
        </Stack>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Number input
        </ESPTypography>

        <Stack direction="row" spacing={1}>
          <ESPInput placeholder="Number" type="number" />
        </Stack>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          You can easily customize input fields to create various states.
        </ESPTypography>

        <Stack direction="row" spacing={1}>
          <ESPInput placeholder="Placeholder..." />
          <ESPInput defaultValue={'Filed'} />
          <ESPInput disabled placeholder="Disabled" />
        </Stack>

        {Array.from(Array(3)).map((_, index) => {
          let size: Size;

          switch (index) {
            case 0:
              size = 'large';
              break;
            case 1:
              size = 'medium';
              break;

            default:
              size = 'small';
              break;
          }

          return (
            <Stack key={index} direction="row" spacing={1} style={{ margin: '10px 0' }}>
              <ESPInput placeholder="Active..." className="Mui-focused" size={size} />
              <ESPInput error defaultValue="Error" size={size} />
              <ESPInput success defaultValue="Success" size={size} />
            </Stack>
          );
        })}

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          You can easily customize label fields to show states.
        </ESPTypography>

        <ESPFormControl error variant="outlined" helperText="Description">
          <ESPInput value="Error" />
        </ESPFormControl>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          There are also checkboxes, radios and toggles for true / false.
        </ESPTypography>

        <Stack direction="row" spacing={1}>
          <FormControlLabel control={<ESPCheckbox defaultChecked />} label="Checked" />
          <FormControlLabel control={<ESPCheckbox defaultChecked round />} label="Checked" />
          <ESPSwitch defaultChecked />
          <ESPSwitch />
        </Stack>

        <Stack direction="row" spacing={1}>
          <FormControlLabel control={<ESPCheckbox defaultChecked />} label="Checked" />
          <FormControlLabel control={<ESPCheckbox defaultChecked round />} label="Checked" />
          <ESPSwitch defaultChecked />
          <ESPSwitch />
        </Stack>
        <Stack direction="row" spacing={1}>
          <FormControlLabel control={<ESPCheckbox />} label="Unchecked" />
          <FormControlLabel control={<ESPCheckbox round />} label="Unchecked" />
        </Stack>
        <Stack direction="row" spacing={1}>
          <FormControlLabel control={<ESPCheckbox indeterminate />} label="Indeterminate" />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Autocomplete infinite scrolling + virtual scrolling
        </ESPTypography>

        <Stack spacing={1} display={'flex'} direction={'row'}>
          {[''].map(() => {
            const top100Films = [
              { label: 'The Shawshank Redemption', value: 1994 },
              { label: 'The Godfather', value: 1972 },
              { label: 'The Godfather: Part II', value: 1974 },
              { label: 'The Dark Knight', value: 2008 },
              { label: '12 Angry Men', value: 1957 },
              { label: "Schindler's List", value: 1993 },
              { label: 'Pulp Fiction', value: 1994 },
              { label: 'Inglourious Basterds', value: 2009 },
              { label: 'Snatch', value: 2000 },
              { label: '3 Idiots', value: 2009 },
              { label: 'Monty Python and the Holy Grail', value: 1975 },
              { label: 'Monty Python and the Holy Grail 1', value: 1975 },
              { label: 'Monty Python and the Holy Grail 2', value: 1975 },
              { label: 'Monty Python and the Holy Grail 3', value: 1975 },
              { label: 'Monty Python and the Holy Grail 4', value: 1975 },
              { label: 'Monty Python and the Holy Grail 5', value: 1975 },
            ];

            return (
              <Fragment key="large">
                <ESPAutocompleteEnhancement
                  size="large"
                  options={top100Films}
                  placeholder="Select autocomplete enhancement"
                  fullWidth
                />
              </Fragment>
            );
          })}
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Autocomplete
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          There are three sizes of autocomplete
        </ESPTypography>

        <Stack spacing={1} display={'flex'} direction={'row'}>
          {Array.from(Array(3)).map((_, index) => {
            const top100Films = [
              { label: 'The Shawshank Redemption', value: 1994 },
              { label: 'The Godfather', value: 1972 },
              { label: 'The Godfather: Part II', value: 1974 },
              { label: 'The Dark Knight', value: 2008 },
              { label: '12 Angry Men', value: 1957 },
              { label: "Schindler's List", value: 1993 },
              { label: 'Pulp Fiction', value: 1994 },
              { label: 'Inglourious Basterds', value: 2009 },
              { label: 'Snatch', value: 2000 },
              { label: '3 Idiots', value: 2009 },
              { label: 'Monty Python and the Holy Grail', value: 1975 },
            ];

            let size: Size;

            switch (index) {
              case 0:
                size = 'large';
                break;
              case 1:
                size = 'medium';
                break;

              default:
                size = 'small';
                break;
            }

            return (
              <Fragment key={size}>
                <ESPAutocomplete
                  size={size}
                  options={top100Films}
                  placeholder="Select autocomplete"
                  fullWidth
                />
              </Fragment>
            );
          })}
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Autocomplete multiple
        </ESPTypography>

        <Stack spacing={1} display={'flex'} direction={'row'}>
          {Array.from(Array(2)).map((_, index) => {
            const top100Films = [
              { label: 'The Shawshank Redemption', value: 1994 },
              { label: 'The Godfather', value: 1972 },
              { label: 'The Godfather: Part II', value: 1974 },
              { label: 'The Dark Knight', value: 2008 },
              { label: '12 Angry Men', value: 1957 },
              { label: "Schindler's List", value: 1993 },
              { label: 'Pulp Fiction', value: 1994 },
              { label: 'Inglourious Basterds', value: 2009 },
              { label: 'Snatch', value: 2000 },
              { label: '3 Idiots', value: 2009 },
              { label: 'Monty Python and the Holy Grail', value: 1975 },
            ];

            let size: Size;

            switch (index) {
              case 0:
                size = 'medium';
                break;
              case 1:
                size = 'small';
                break;

              default:
                size = 'small';
                break;
            }

            return (
              <Fragment key={size}>
                <ESPAutocomplete
                  size={size}
                  options={top100Films}
                  placeholder="Select autocomplete"
                  fullWidth
                  multiple
                  limitTags={3}
                />
              </Fragment>
            );
          })}
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Dropdown
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          There are two types of dropdowns in three sizes: buttons and links
        </ESPTypography>

        {Array.from(Array(3)).map((_, index) => {
          let size: Size;

          switch (index) {
            case 0:
              size = 'large';
              break;
            case 1:
              size = 'medium';
              break;

            default:
              size = 'small';
              break;
          }

          return (
            <Stack key={index} direction="row" spacing={1} style={{ marginBottom: '20px' }}>
              <ESPDropdown
                options={[{ name: 'Select', value: '' }]}
                sx={{ width: '20rem', marginRight: '20px' }}
                size={size}
              >
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </ESPDropdown>
              <ESPDropdown link options={[{ name: 'Select', value: '' }]} size={size}>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </ESPDropdown>
            </Stack>
          );
        })}

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          There are three states of dropdowns: hover, active, disabled
        </ESPTypography>

        <ESPDropdown fullWidth value={10} size="large">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </ESPDropdown>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Color picker
        </ESPTypography>

        <ESPDropdown
          fullWidth
          displayEmpty
          size="large"
          placeholder="Select color"
          sx={{ width: '30vw' }}
        >
          {['yellow', 'red', 'black', 'blue', 'pink'].map((color) => {
            return (
              <MenuItem key={color} value={color}>
                <Stack direction="row" display={'flex'} alignItems={'center'}>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '2px',
                      background: color,
                      marginRight: '10px',
                    }}
                  />
                  {color}
                </Stack>
              </MenuItem>
            );
          })}
        </ESPDropdown>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Datepickers
        </ESPTypography>

        <Stack spacing={1} direction="row">
          <ESPDatepicker disablePast size="large" />
          <ESPDatepicker size="medium" disabledWeekend />
          <ESPDatepicker disableFuture size="small" />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Daterange pickers
        </ESPTypography>

        <Stack spacing={1} direction="row">
          <ESPDaterangepicker value={[dayjs().add(1, 'd'), dayjs().add(5, 'd')]} size="large" />
          <ESPDaterangepicker disablePast />
          <ESPDaterangepicker size="small" disabledWeekend />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Timepickers
        </ESPTypography>

        <Stack spacing={1} direction="row">
          <ESPTimepicker disablePast size="large" amPmAriaLabel="PM" />
          <ESPTimepicker size="medium" />
          <ESPTimepicker disableFeature size="small" disablePast />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Date time pickerss
        </ESPTypography>

        <Stack spacing={1} direction="row">
          <ESPDateTimePicker />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Pagination
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Use pagination for content that are listed accross multiple pages.
        </ESPTypography>
        {Array.from(Array(3)).map((_, index) => {
          let size: Size;

          switch (index) {
            case 0:
              size = 'large';
              break;
            case 1:
              size = 'medium';
              break;

            default:
              size = 'small';
              break;
          }

          return (
            <Stack
              key={index}
              direction="row"
              spacing={1}
              style={{ marginBottom: '1.5rem' }}
              justifyContent={'space-between'}
            >
              <ESPPagination size={size} showNextLabel showPrevLabel count={3} />
              <ESPPagination size={size} count={3} />
              <ESPPagination size={size} count={0} showNextLabel showPrevLabel />
              <ESPPagination size={size} count={0} />
            </Stack>
          );
        })}
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Table
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Built with headers and rows, a table is useful to display many items or content with
          measurable data.
        </ESPTypography>

        <Stack sx={{ marginBottom: '2rem' }}>
          <ESPTable
            defaultPageSize={100}
            topPosition={{
              direction: 'left',
              action: <div>Right actions</div>,
            }}
            bottomPosition={{
              direction: 'right',
            }}
            tableName="test-table"
            columns={[
              {
                id: 'name',
                label: 'Name Employee',
                resizable: true,
              },
              {
                id: 'type',
                label: 'Type/Times',
                resizable: true,
              },
              {
                id: 'date',
                label: 'Date',
                resizable: true,
              },
              {
                id: 'status',
                label: 'Status',
                render: (row) => {
                  let component = null;
                  switch (row.status) {
                    case 'approved':
                      component = <ESPTag label="Approved" color="success" />;
                      break;
                    case 'rejected':
                      component = <ESPTag label="Rejected" color="error" />;
                      break;
                    case 'pending':
                      component = <ESPTag label="Pending" />;
                      break;
                    default:
                      break;
                  }
                  return component;
                },
              },
              {
                id: 'action',
                label: '',
                render: (row) => (
                  <MoreHorizIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      window.alert(row.name);
                    }}
                  />
                ),
                align: 'right',
              },
            ]}
            totalItems={100000}
            // @ts-ignore
            data={Array.from(Array(100000)).map((item, id) => ({
              name: `Nguyen Ngoc Phuong Thao ${id + 1}`,
              type: 'Annual leave (2 days)',
              date: '3 - 4 April 2023',
              status: id % 3 === 0 ? 'pending' : id % 3 === 1 ? 'approved' : 'rejected',
              id,
              option: {
                showCheckbox: id % 2 === 1,
              },
            }))}
            sx={{
              maxHeight: '30rem',
            }}
          />
        </Stack>

        <Stack sx={{ marginBottom: '2rem' }}>
          <ESPTable
            showPagination={false}
            showPageSize={false}
            topPosition={{
              direction: 'left',
              action: <div>Right actions</div>,
            }}
            bottomPosition={{
              direction: 'right',
            }}
            tableName="test-table"
            columns={[
              {
                id: 'name',
                label: 'Name Employee',
                resizable: true,
              },
              {
                id: 'type',
                label: 'Type/Times',
                resizable: true,
              },
              {
                id: 'date',
                label: 'Date',
                resizable: true,
              },
              {
                id: 'status',
                label: 'Status',
                render: (row) => {
                  let component = null;
                  switch (row.status) {
                    case 'approved':
                      component = <ESPTag label="Approved" color="success" />;
                      break;
                    case 'rejected':
                      component = <ESPTag label="Rejected" color="error" />;
                      break;
                    case 'pending':
                      component = <ESPTag label="Pending" />;
                      break;
                    default:
                      break;
                  }
                  return component;
                },
              },
              {
                id: 'action',
                label: '',
                render: (row) => (
                  <MoreHorizIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      window.alert(row.name);
                    }}
                  />
                ),
                align: 'right',
              },
            ]}
            // @ts-ignore
            data={Array.from(Array(100000)).map((item, id) => ({
              name: `Nguyen Ngoc Phuong Thao ${id + 1}`,
              type: 'Annual leave (2 days)',
              date: '3 - 4 April 2023',
              status: id % 3 === 0 ? 'pending' : id % 3 === 1 ? 'approved' : 'rejected',
              id,
              option: {
                showCheckbox: id % 2 === 1,
              },
            }))}
            sx={{
              maxHeight: '30rem',
            }}
          />
        </Stack>

        <Stack sx={{ marginBottom: '2rem' }}>
          <ESPTable
            checkboxSelection
            showPageSize
            columns={[
              {
                id: 'name',
                label: 'name',
              },
              {
                id: 'type',
                label: 'type',
              },
              {
                id: 'date',
                label: 'date',
              },
              {
                id: 'status',
                label: 'status',
                render: (row: { [key: string]: string }) => {
                  let component = null;
                  switch (row.status) {
                    case 'approved':
                      component = <ESPTag label="Approved" color="success" />;
                      break;
                    case 'rejected':
                      component = <ESPTag label="Rejected" color="error" />;
                      break;
                    case 'pending':
                      component = <ESPTag label="Pending" />;
                      break;
                    default:
                      break;
                  }
                  return component;
                },
              },
              {
                id: 'action',
                label: 'action',
                render: (row: { [key: string]: string }) => (
                  <MoreHorizIcon
                    onClick={(e) => {
                      e.stopPropagation();
                      window.alert(row.name);
                    }}
                  />
                ),
                align: 'right',
              },
            ]}
            // @ts-ignore
            data={data_table}
            sx={{
              maxHeight: '30rem',
            }}
            totalItems={data_table.length}
          />
        </Stack>
        <Stack sx={{ marginBottom: '2rem' }}>
          <ESPTable
            showPageSize={false}
            showPagination={false}
            showTableHeader={false}
            data={data_table}
            // @ts-ignore
            columns={columns_table}
            sx={{
              maxHeight: '30rem',
            }}
          />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Popover
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          A popover is a pop-up box that appears when the user clicks on an element.
        </ESPTypography>

        <Stack spacing={4} direction="row">
          <ESPPopover
            popoverContent={<ESPTypography variant="regular_l">Looks good to me.</ESPTypography>}
          >
            <ESPButton color="primary">Open popover</ESPButton>
          </ESPPopover>

          <ESPPopover
            contentStyle={{
              textAlign: 'left',
            }}
            popoverContent={
              <ESPTypography variant="regular_l">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </ESPTypography>
            }
            placement="bottom-end"
          >
            <ESPButton color="primary">Open popover</ESPButton>
          </ESPPopover>
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Tooltips
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Show additional information on top of an element.
        </ESPTypography>

        <Stack spacing={4} direction="row">
          {['bottom', 'left', 'right', 'top'].map((item) => {
            return (
              // @ts-ignore
              <ESPTooltip key={item} placement={item} title={item}>
                <ESPButton color="primary">{item}</ESPButton>
              </ESPTooltip>
            );
          })}
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Modals
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Use a modal to display content over a current page.
        </ESPTypography>

        <ESPButton onClick={() => setOpen(true)}>Open modal</ESPButton>

        <ESPModal
          title="Title"
          open={open}
          actions={
            <>
              <ESPButton color="secondary" onClick={() => setOpen(false)}>
                Cancel
              </ESPButton>
              <ESPButton onClick={() => setOpen(false)}>Save Changes</ESPButton>
            </>
          }
          onClose={() => setOpen(false)}
        >
          {[...new Array(15)]
            .map(
              () => `Cras mattis consectetur purus sit amet fermentum.
    Cras justo odio, dapibus ac facilisis in, egestas eget quam.
    Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`
            )
            .join('\n')}
        </ESPModal>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Sliders
        </ESPTypography>
        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          In some occasions, a slider works better than a regular input.
        </ESPTypography>

        <Stack direction="row" spacing={3}>
          <ESPSlider />
          <ESPSlider defaultValue={50} />
          <ESPSlider defaultValue={30} disabled />
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Badges
        </ESPTypography>

        <Stack direction="row" spacing={3}>
          <ESPBadge badgeContent={100}>
            <NotificationsIcon />
          </ESPBadge>

          <IconButton style={{ borderRadius: '50%', background: 'white' }}>
            <ESPBadge badgeContent={100}>
              <NotificationsIcon />
            </ESPBadge>
          </IconButton>

          <IconButton style={{ borderRadius: '50%', background: 'white' }}>
            <ESPBadge badgeContent="5" variant="dot">
              <NotificationsIcon />
            </ESPBadge>
          </IconButton>

          <IconButton style={{ borderRadius: '50%', background: 'white' }}>
            <ESPBadge badgeContent={1}>
              <NotificationsIcon />
            </ESPBadge>
          </IconButton>

          <IconButton style={{ borderRadius: '50%', background: 'white' }}>
            <ESPBadge badgeContent={0} showZero>
              <NotificationsIcon />
            </ESPBadge>
          </IconButton>
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Cards
        </ESPTypography>

        <Stack spacing={2} direction={'row'}>
          <ESPCard
            title={<ESPTypography variant="h4">Vacation</ESPTypography>}
            headerActions={<AddIcon />}
            actions={<ESPButton sx={{ width: '100%' }}>Ok</ESPButton>}
          >
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </ESPCard>
          <ESPCard
            title={<ESPTypography variant="h4">Vacation</ESPTypography>}
            headerActions={
              <IconButton>
                <AddIcon />
              </IconButton>
            }
            actions={<ESPButton sx={{ width: '100%' }}>Ok</ESPButton>}
          >
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
            consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </ESPCard>
        </Stack>
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ padding: '2rem 0' }}>
          Calendar
        </ESPTypography>

        <ESPCalendar
          events={{
            [dayjs().format(format)]: {
              data: {},
            },
            [dayjs().add(1, 'd').format(format)]: {
              data: {},
            },
            [dayjs().add(7, 'd').format(format)]: {
              data: {},
            },
          }}
          holidays={{
            [dayjs().add(3, 'd').format(format)]: true,
          }}
        />
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Upload Input
        </ESPTypography>

        <ESPUploadInput />
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Upload Input Multiple
        </ESPTypography>

        <ESPUploadInput multiple />
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Editor
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Using text editor is a great way to format content.
        </ESPTypography>

        <ESPEditor />
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Tabs
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Using tabs is a great way to toggle between content.
        </ESPTypography>

        <ESPTab tabs={tabs_content} defaultTab={1} />
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Loading
        </ESPTypography>

        <ESPTypography variant="paragraph" sx={{ padding: '1rem 0' }}>
          Loading to give context to your data.
        </ESPTypography>

        <ESPButton
          loading={false}
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
            }, 3000);
          }}
        >
          Show Loading
        </ESPButton>
        <ESPLoading loading={loading} />
      </section>

      <section>
        <ESPTypography variant="h2" sx={{ paddingTop: '3rem' }}>
          Extends
        </ESPTypography>

        {children}
      </section>
    </div>
  );
}

export default StyleGuide;
