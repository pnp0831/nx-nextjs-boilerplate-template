import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockCommonUser } from '@esp/__mocks__/data-mock';
import ImportExportNotifier from '@esp/components/admin-layout/header/import-export-notifier';
import { APP_ROUTE } from '@esp/constants';
import Box from '@mui/material/Box';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';

import {
  FLOW_STATUS,
  ImportExportNotifierContextProvider,
  LOADING_STATUS,
  ModalType,
  useImportExportNotifier,
} from '.';

jest.useFakeTimers();

jest.mock('../../apis/file-management/index.ts', () => ({
  uploadAttachment: jest
    .fn()
    .mockImplementationOnce(() => {
      throw new Error('error');
    })
    .mockImplementationOnce(() => ({ data: [{ id: 'uuid' }] }))
    .mockImplementationOnce(() => ({ data: [{ id: 'uuid' }] })),
}));

jest.mock('../../apis/time-management/index.ts', () => ({
  registerImportTimeLog: jest.fn().mockReturnValue({ data: 'uuid' }),
}));

jest.mock('../../apis/progress-management/index.ts', () => ({
  getProgressInformation: jest.fn().mockReturnValue({
    data: {
      data: [{ id: 'uuid', status: 'Error', fileName: 'testing file' }],
    },
  }),
}));

jest.mock('next/navigation', () => ({
  __esModule: true,
  usePathname: jest.fn(),
  useSearchParams: jest.fn(),
  useRouter: jest.fn().mockReturnValue({
    back: jest.fn(),
    forward: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  useServerInsertedHTML: jest.fn(),
}));

// Mock the useGetTimeLogTemplateValidation hook
jest.mock(
  '../../app/(protected-page)/(time-management)/timesheet/(main-components)/import-time-log-modal/import-time-log-modal.helper.tsx',
  () => ({
    useGetTimeLogTemplateValidation: jest.fn().mockReturnValue({ data: templateValidation }),
  })
);

class Worker {
  constructor(scriptPath) {
    // Mock the Worker constructor
    this.scriptPath = scriptPath;
    this.onmessage = null;
    this.onerror = null;
  }

  postMessage(data) {
    // Mock postMessage
    if (this.onmessage) {
      this.onmessage({ data });
    }
  }

  terminate() {
    // Mock terminate
  }
}

const templateValidation = [
  {
    type: 'Import Time Log',
    header: 'Employee Email*',
    regexValidation: '\\w+@strongtie.com',
    position: 0,
    deletionTime: null,
    isDeleted: false,
    deleterUserId: null,
    lastModificationTime: '2023-10-18T07:35:37.5971495+00:00',
    lastModifierUserId: '00000000-0000-0000-0000-000000000000',
    creationTime: '2023-10-18T07:35:37.5971495+00:00',
    creatorUserId: '00000000-0000-0000-0000-000000000000',
    id: 'c03ba7ad-70fb-445f-8646-fa49385f186e',
  },
  {
    type: 'Import Time Log',
    header: 'Task Code*',
    regexValidation: '\\S+',
    position: 1,
    deletionTime: null,
    isDeleted: false,
    deleterUserId: null,
    lastModificationTime: '2023-10-18T07:36:57.6368643+00:00',
    lastModifierUserId: '00000000-0000-0000-0000-000000000000',
    creationTime: '2023-10-18T07:36:57.6368643+00:00',
    creatorUserId: '00000000-0000-0000-0000-000000000000',
    id: 'ade8fecc-bd0a-4aac-8c5c-5225bfefaf09',
  },
  {
    type: 'Import Time Log',
    header: 'Worked Date*',
    regexValidation:
      '^(?:(?:(?:0?[13578]|1[02])(\\/|-|\\.)31)\\1|(?:(?:0?[1,3-9]|1[0-2])(\\/|-|\\.)(?:29|30)\\2))(?:(?:1[6-9]|[2-9]\\d)?\\d{4})$|^(?:0?2(\\/|-|\\.)29\\3(?:(?:(?:1[6-9]|[2-9]\\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\\/|-|\\.)(?:0?[1-9]|1\\d|2[0-8])\\4(?:(?:1[6-9]|[2-9]\\d)?\\d{4})$',
    position: 2,
    deletionTime: null,
    isDeleted: false,
    deleterUserId: null,
    lastModificationTime: '2023-10-18T07:37:56.7382681+00:00',
    lastModifierUserId: '00000000-0000-0000-0000-000000000000',
    creationTime: '2023-10-18T07:37:56.7382681+00:00',
    creatorUserId: '00000000-0000-0000-0000-000000000000',
    id: '677d41d0-52d0-4760-a1e2-96ab3d906d5c',
  },
  {
    type: 'Import Time Log',
    header: 'Hours*',
    regexValidation: '^[+-]?(\\d+\\b[.,])?\\d+$',
    position: 3,
    deletionTime: null,
    isDeleted: false,
    deleterUserId: null,
    lastModificationTime: '2023-10-18T07:39:39.8383766+00:00',
    lastModifierUserId: '00000000-0000-0000-0000-000000000000',
    creationTime: '2023-10-18T07:39:39.8383766+00:00',
    creatorUserId: '00000000-0000-0000-0000-000000000000',
    id: 'f6029e78-fa47-4d8e-b5e5-d92305d67a6c',
  },
  {
    type: 'Import Time Log',
    header: 'Description',
    regexValidation: '',
    position: 4,
    deletionTime: null,
    isDeleted: false,
    deleterUserId: null,
    lastModificationTime: '2023-10-18T07:39:55.6592083+00:00',
    lastModifierUserId: '00000000-0000-0000-0000-000000000000',
    creationTime: '2023-10-18T07:39:55.6592083+00:00',
    creatorUserId: '00000000-0000-0000-0000-000000000000',
    id: 'f2e81a3a-3f06-42e0-9673-c8399e422748',
  },
];

const wrapper = ({ children }) => (
  <ContextNeededWrapper>
    {children}
    {/* <SignalRContextProvider>{children}</SignalRContextProvider> */}
  </ContextNeededWrapper>
);

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: mockCommonUser,
    })),
  };
});

const TestComponent = () => {
  const {
    openModalByType,
    setTargetIcon,
    countBadgeInProcess,
    getIconStatus,
    shouldDisplayLoadingIcon,
    dataModal,
    updateDataModalById,
    removeModalById,
  } = useImportExportNotifier();
  const refIcon = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (refIcon.current && typeof setTargetIcon === 'function') {
      setTargetIcon(refIcon.current);
    }
  }, []);

  const router = useRouter();

  return (
    <div>
      <ImportExportNotifier />
      {/* <div ref={refIcon} /> */}
      <div>Count: {countBadgeInProcess()}</div>
      <div>Icon Status: {getIconStatus()}</div>
      <div>Display Icon: {shouldDisplayLoadingIcon()}</div>
      <div>
        List:
        {Object.entries(dataModal || {}).map(
          ([_, { fileName, type, modalId, status, flowStatus }]) => {
            // const color = {
            //   [LOADING_STATUS.ERROR_LOADING]: theme.palette.error.main,
            //   [LOADING_STATUS.SUCCESS_LOADING]: theme.palette.success.main,
            //   [LOADING_STATUS.INPROCESS_LOADING]: theme.palette.black.main,
            // }[status as number];

            return (
              <Box
                key={modalId}
                sx={{ paddingBottom: '0.6rem' }}
                data-testid="log-time-submit"
                onClick={() => {
                  if (status === LOADING_STATUS.INPROCESS_LOADING) {
                    return updateDataModalById(modalId, {
                      open: true,
                      isModalInProgress: true,
                    });
                  }

                  if (type === ModalType.TIME_LOG_EXPORT) {
                    removeModalById(modalId);
                    return router.push(APP_ROUTE.EXPORT);
                  }

                  if (type === ModalType.TIME_LOG_IMPORT) {
                    if (
                      status === LOADING_STATUS.ERROR_LOADING &&
                      flowStatus === FLOW_STATUS.WARNING
                    ) {
                      return updateDataModalById(modalId, {
                        type,
                        open: true,
                      });
                    }
                    removeModalById(modalId);
                    return router.push(APP_ROUTE.IMPORT);
                  }
                }}
              >
                <Box display="flex" alignItems="center" className="import-export-notifier-wrapper">
                  <Box>{status}</Box>
                </Box>
              </Box>
            );
          }
        )}
      </div>
      <button
        onClick={() => {
          openModalByType(ModalType.TIME_LOG_IMPORT);
        }}
      >
        Open Import Time Log
      </button>
      <button
        onClick={() => {
          openModalByType(ModalType.TIME_LOG_EXPORT);
        }}
      >
        Open Export Time Log
      </button>
    </div>
  );
};

describe('ImportExportNotifierContext', () => {
  const mockWorker = new Worker('/');

  afterEach(() => {
    window.localStorage.clear();
  });

  it('renders with sync data from local', async () => {
    window.localStorage.setItem(
      'dataModal-51bcd0e2-a712-463c-881f-7415e7ee3e4f',
      JSON.stringify({
        '580f21f8-f988-47c6-bb35-157e640c4358': {
          modalId: '580f21f8-f988-47c6-bb35-157e640c4358',
          type: 'Time Log Import',
          open: true,
          closeAnimation: '',
          fileName: '_files_ImportTimelogTemplate_success.xlsx',
          showPortal: false,
          flowStatus: 3,
          status: 2,
          animated: true,
          progressId: 'uuid',
        },
      })
    );

    await waitFor(() => {
      const { baseElement } = render(
        <ImportExportNotifierContextProvider>
          <TestComponent />
        </ImportExportNotifierContextProvider>,
        { wrapper }
      );

      expect(baseElement).not.toBeNull();
    });
  });

  it('opens a modal import and remove modal', async () => {
    await waitFor(() => {
      const { getByText } = render(
        <ImportExportNotifierContextProvider>
          <TestComponent />
        </ImportExportNotifierContextProvider>,
        { wrapper }
      );

      const openModalButton = getByText('Open Import Time Log');
      fireEvent.click(openModalButton);

      const closeModalButton = getByText('Cancel');
      fireEvent.click(closeModalButton);
    });
  });

  it('renders with animation and validate failed and click resubmit', async () => {
    const { getByTestId, getByText } = render(
      <ImportExportNotifierContextProvider mockWorker={mockWorker}>
        <TestComponent />
      </ImportExportNotifierContextProvider>,
      { wrapper }
    );

    const openModalButton = screen.getByText('Open Import Time Log');
    fireEvent.click(openModalButton);

    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    fireEvent.click(getByText('Upload'));

    await act(async () => {
      await mockWorker.postMessage({
        type: 'error_checking_header',
        error: 'Hours',
        name: 'Hours',
      });
    });

    expect(getByText('Resubmit')).toBeInTheDocument();
    fireEvent.click(getByText('Resubmit'));
  });

  it('renders with animation and druing validate error', async () => {
    const { getByTestId, getByText } = render(
      <ImportExportNotifierContextProvider mockWorker={mockWorker}>
        <TestComponent />
      </ImportExportNotifierContextProvider>,
      { wrapper }
    );

    const openModalButton = screen.getByText('Open Import Time Log');
    fireEvent.click(openModalButton);

    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(getByText('Upload'));
    });

    await act(async () => {
      await jest.advanceTimersByTime(800);
    });

    await act(async () => {
      await mockWorker.postMessage({
        type: 'error_checking_header',
        error: 'Hours',
        name: 'Hours',
      });
    });

    await act(async () => {
      await jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      await jest.advanceTimersByTime(200);
    });
  });

  it('renders with animation and druing validate click minimize modal', async () => {
    const { getByTestId, getByText } = render(
      <ImportExportNotifierContextProvider mockWorker={mockWorker}>
        <TestComponent />
      </ImportExportNotifierContextProvider>,
      { wrapper }
    );

    const openModalButton = screen.getByText('Open Import Time Log');
    fireEvent.click(openModalButton);

    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(getByText('Upload'));
    });

    await act(async () => {
      await jest.advanceTimersByTime(800);
    });

    await act(async () => {
      await jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      await jest.advanceTimersByTime(200);
    });

    const closeIcon = getByTestId('CloseIcon');

    fireEvent.click(closeIcon);
  });

  it('renders with validating success and error when uploading + register import', async () => {
    const { getByTestId, getByText } = render(
      <ImportExportNotifierContextProvider mockWorker={mockWorker}>
        <TestComponent />
      </ImportExportNotifierContextProvider>,
      { wrapper }
    );

    const openModalButton = screen.getByText('Open Import Time Log');
    fireEvent.click(openModalButton);

    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(getByText('Upload'));
    });

    await act(async () => {
      await jest.advanceTimersByTime(800);
    });

    await act(async () => {
      await jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      await jest.advanceTimersByTime(200);
    });

    act(() => {
      mockWorker.postMessage({
        type: 'success',
      });
    });
  });

  it('renders with validating success and uploading success and register error', async () => {
    const { getByTestId, getByText } = render(
      <ImportExportNotifierContextProvider mockWorker={mockWorker}>
        <TestComponent />
      </ImportExportNotifierContextProvider>,
      { wrapper }
    );

    const openModalButton = screen.getByText('Open Import Time Log');
    fireEvent.click(openModalButton);

    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(getByText('Upload'));
    });

    await act(async () => {
      jest.advanceTimersByTime(800);
    });

    await act(async () => {
      await jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      await jest.advanceTimersByTime(200);
    });

    await act(async () => {
      await mockWorker.postMessage({
        type: 'success',
      });
    });
  });

  it('renders with validating success and uploading success and register success', async () => {
    const { getByTestId, getByText } = render(
      <ImportExportNotifierContextProvider mockWorker={mockWorker}>
        <TestComponent />
      </ImportExportNotifierContextProvider>,
      { wrapper }
    );

    const openModalButton = screen.getByText('Open Import Time Log');
    fireEvent.click(openModalButton);

    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(getByText('Upload'));
    });

    await act(async () => {
      await jest.advanceTimersByTime(800);
    });

    await act(async () => {
      await jest.advanceTimersByTime(1000);
    });

    await act(async () => {
      await jest.advanceTimersByTime(200);
    });

    // validating success
    await act(async () => {
      await mockWorker.postMessage({
        type: 'success',
      });
    });

    await act(async () => {
      await jest.advanceTimersByTime(1000);
    });

    await act(() => {
      const fakeMessage = {
        downloadAttachmentUrl: 'fake-url',
        isSuccess: true,
        message: 'Attendance Log Export',
        type: 'Attendance Log Export',
        userId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
      };

      window.dispatchEvent(new CustomEvent('Notification', { detail: fakeMessage }));
    });
  });
});
