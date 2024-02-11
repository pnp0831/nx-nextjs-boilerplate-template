import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { getProgressInformationById } from '@esp/apis/progress-management';
import { postTimeLogExport } from '@esp/apis/time-management';
import {
  getEmployeeIds,
  useGetUnits,
} from '@esp/components/organizations-select/organizations-select.helper';
import { act, fireEvent, render } from '@testing-library/react';
import dayjs from 'dayjs';

import ExportTimeLogModal from '.';

jest.useFakeTimers();

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

const mockDataOptionUnitls = [
  {
    label: 'ESP QA team',
    value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
    isUnit: true,
  },
  {
    isEmployee: true,
    label: 'User 4 ',
    value: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
    parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
    parentName: 'ESP QA team',
  },
  {
    isEmployee: true,
    label: 'User 5 ',
    value: '56afe61c-f0c0-de77-e3fa-c6083a4a69251',
    parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
    parentName: 'ESP QA team',
  },
];

const dataProgressInformation = {
  data: {
    id: '5de892c5-fab5-4e05-962b-da930f20f65a',
    fileName: '09_22_September_Export_fc1b717e-dd49-4ea6-8234-9864adc30b9f',
    fileExtension: 'csv',
    status: 'Success',
    requestedTime: '2023-09-22T06:08:46.5675495+00:00',
    finishedTime: '2023-09-22T06:08:53.7712751+00:00',
    creatorUserId: '00000000-0000-0000-0000-000000000000',
    type: 'Time Log Export',
  },
};

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: {
        id: '1',
        name: 'User 4',
        role: 'Mock Role',
        perms: [],
        employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
      },
    })),
  };
});

const dataAPIExport = {
  data: {
    data: [
      '5de892c5-fab5-4e05-962b-da930f20f123',
      '5de892c5-fab5-4e05-962b-da930f20f456',
      '5de892c5-fab5-4e05-962b-da930f20f789',
    ],
    timeStamp: '2023-09-22T06:08:53.9457537+00:00',
    status: 200,
    errors: null,
    path: '/api/time-management/v1/timelogs/export',
  },
};

const optionUnits = [
  {
    label: 'ESP QA team',
    value: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
    isUnit: true,
  },
  {
    isEmployee: true,
    label: 'User 4 ',
    value: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
    parentId: '4748e97f-2bc2-c389-59ef-0ad92596cbfb',
    parentName: 'ESP QA team',
  },
];

jest.mock('@esp/components/organizations-select/organizations-select.helper', () => ({
  useGetUnits: jest.fn(),
  getEmployeeIds: jest.fn(),
}));

jest.mock('@esp/apis/time-management', () => ({
  postTimeLogExport: jest.fn(),
}));

jest.mock('@esp/apis/progress-management', () => ({
  getProgressInformationById: jest.fn(),
}));

jest.mock('./export-time-log-modal.helper', () => {
  const originalModule = jest.requireActual('./export-time-log-modal.helper');
  return {
    ...originalModule,
    beforeUnload: jest.fn(),
  };
});

describe('Unload Event', () => {
  const removeEventListener = window.removeEventListener;
  const mockedRemoveEventListener = jest.fn();

  beforeEach(() => {
    window.removeEventListener = mockedRemoveEventListener;
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.removeEventListener = removeEventListener;
  });

  it('should render content successfully when happen interrupted', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();

    (useGetUnits as jest.Mock).mockReturnValue({
      optionUnits: mockDataOptionUnitls,
    });

    (getEmployeeIds as jest.Mock).mockReturnValue(['56afe61c-f0c0-de77-e3fa-c6083a4a6925']);

    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal title="Export Time Log" onClose={onClose} onError={onError} open />
      </ContextNeededWrapper>
    );

    const beforeUnloadEvent = new Event('beforeunload');
    const unloadEvent = new Event('unload');
    const exportButton = getByText('Export');

    await act(async () => {
      fireEvent.click(exportButton);

      window.dispatchEvent(beforeUnloadEvent);
      window.dispatchEvent(unloadEvent);
    });
  });
});

describe('Export Time Log Modal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render content successfully default and click cancel to close modal', () => {
    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockDataOptionUnitls });
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal
          id="modalId"
          open
          title="Export Time Log"
          onClose={onClose}
          onSuccess={onSuccess}
          onError={onError}
        />
      </ContextNeededWrapper>
    );
    const cancelButton = getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
  it('should render content successfully default and click submit successfully', async () => {
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const onError = jest.fn();

    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockDataOptionUnitls });
    (getEmployeeIds as jest.Mock).mockReturnValue(['56afe61c-f0c0-de77-e3fa-c6083a4a6925']);

    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal
          id="modalId"
          open
          title="Export Time Log"
          onClose={onClose}
          onSuccess={onSuccess}
          onError={onError}
        />
      </ContextNeededWrapper>
    );

    const exportButton = getByText('Export');

    fireEvent.click(exportButton);

    await act(async () => {
      (postTimeLogExport as jest.Mock).mockReturnValue(dataAPIExport);
      (getProgressInformationById as jest.Mock).mockReturnValue(
        new Promise((resolve) => {
          resolve(dataProgressInformation);
        })
      );
    });
  });

  it('should render last month if receiving formData stating last month', async () => {
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const formData = {
      employeeIds: optionUnits,
      startDate: dayjs().subtract(1, 'month').startOf('month').toString(),
      endDate: dayjs().subtract(1, 'month').endOf('month').toString(),
    };

    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockDataOptionUnitls });
    (getEmployeeIds as jest.Mock).mockReturnValue(['56afe61c-f0c0-de77-e3fa-c6083a4a6925']);

    const { getByTestId, getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal
          id="modalId"
          open
          title="Export Time Log"
          onClose={onClose}
          onSuccess={onSuccess}
          formData={formData}
          onError={onError}
        />
      </ContextNeededWrapper>
    );

    const getOptionByLabel = getByText('Last month');
    fireEvent.click(getOptionByLabel);

    const expectIcon = getByTestId('CheckCircleIcon');

    expect(expectIcon).toBeInTheDocument();
  });

  it('should render content successfully default and click submit failed if API is failed', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onSuccess = jest.fn();

    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockDataOptionUnitls });
    (getEmployeeIds as jest.Mock).mockReturnValue(['56afe61c-f0c0-de77-e3fa-c6083a4a6925']);

    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal
          id="modalId"
          open
          title="Export Time Log"
          onClose={onClose}
          onError={onError}
          onSuccess={onSuccess}
        />
      </ContextNeededWrapper>
    );

    const exportButton = getByText('Export');
    await act(async () => {
      fireEvent.click(exportButton);
      (postTimeLogExport as jest.Mock).mockReturnValue(dataAPIExport);
      (getProgressInformationById as jest.Mock).mockReturnValue(dataProgressInformation);
    });
    expect(onError).toHaveBeenCalled();
  }, 10000);

  it('should trigger handleCheckbox function', async () => {
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const onError = jest.fn();

    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockDataOptionUnitls });
    (getEmployeeIds as jest.Mock).mockReturnValue(['56afe61c-f0c0-de77-e3fa-c6083a4a6925']);

    const { getByText, getByTestId } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal
          id="modalId"
          open
          title="Export Time Log"
          onClose={onClose}
          onError={onError}
          onSuccess={onSuccess}
        />
      </ContextNeededWrapper>
    );

    const getOptionByLabel = getByText('Current year');
    fireEvent.click(getOptionByLabel);

    const expectIcon = getByTestId('CheckCircleIcon');

    expect(expectIcon).toBeInTheDocument();
  });

  it('should render ExportTimeLogPendingModal successfully', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onSuccess = jest.fn();

    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogModal
          id="modalId"
          open
          title="Export Time Log"
          onClose={onClose}
          onError={onError}
          onSuccess={onSuccess}
          isModalInProgress
        />
      </ContextNeededWrapper>
    );

    const expectText = getByText('OK');

    expect(expectText).toBeInTheDocument();

    fireEvent.click(expectText);

    expect(onClose).toBeCalled();
  });
});
