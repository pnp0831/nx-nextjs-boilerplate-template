import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import request from '@esp/apis/axios';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import ImportModal from '.';
import {
  FileValidatingBox,
  FinishedUploadingBox,
  InstructionBox,
  Stepper,
  UploadProgressBox,
} from './import-time-log-modal.components';
import { IMPORT_STEP } from './import-time-log-modal.type';

jest.useFakeTimers();

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

// Mock the useGetTimeLogTemplateValidation hook
jest.mock('./import-time-log-modal.helper.tsx', () => ({
  useGetTimeLogTemplateValidation: jest.fn().mockReturnValue({ data: templateValidation }),
}));

// jest.mock('@esp/apis/time-management', () => ({
//   importTimeLogs: jest.fn(),
// }));

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

const wrapper = ({ children }) => <ContextNeededWrapper>{children}</ContextNeededWrapper>;

describe('Import Time Log Modal', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockWorker = new Worker('/');
  it('should render content successfully default and click cancel to close modal', () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
      />,
      { wrapper }
    );
    const uploadButton = getByText('Upload');
    expect(uploadButton).toBeDisabled();
    const cancelButton = getByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
    fireEvent.click(cancelButton);
    expect(onClose).toHaveBeenCalled();
  });
  it('should render content successfully after upload file xlsx and delete file', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(getByText('Upload')).toBeDisabled();
    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });
    expect(getByText('kakaka.xlsx')).toBeInTheDocument();
    expect(getByText('Upload')).not.toBeDisabled();
    expect(getByText('Delete')).toBeInTheDocument();
    fireEvent.click(getByText('Delete'));
    expect(getByText('Upload')).toBeDisabled();
  });
  it('should render content successfully when upload file ( step checking ) and click cancel', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
      />,
      { wrapper }
    );
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
    fireEvent.click(getByText('Cancel'));
    fireEvent.click(getByText('Do you want to cancel the process?'));
    fireEvent.click(getByText('No'));
    fireEvent.click(getByText('Cancel'));
    fireEvent.click(getByText('Do you want to cancel the process?'));
    fireEvent.click(getByText('Confirm'));
    expect(onClose).toHaveBeenCalled();
  });
  it('should render content successfully when worker postmessage error and click resubmit', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        mockWorker={mockWorker}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
      />,
      { wrapper }
    );
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
    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_value',
        name: 'Employee Email',
        error: 'Employee Email',
      });
    });

    expect(getByText('Resubmit')).toBeInTheDocument();
    fireEvent.click(getByText('Resubmit'));
  });

  it('should render content successfully when worker postmessage error error_checking_data', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        mockWorker={mockWorker}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
      />,
      { wrapper }
    );
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
    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_data',
        error: 'File is empty',
      });
    });

    expect(getByText('Resubmit')).toBeInTheDocument();
    fireEvent.click(getByText('Resubmit'));
  });
  it('should render content successfully when worker postmessage error and click cancel', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
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
    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_value',
        name: 'Employee Email',
        error: 'Employee Email',
      });
    });
    expect(getByText('Resubmit')).toBeInTheDocument();
    fireEvent.click(getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });
  it('should render content successfully when worker postmessage success and click cancel', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
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
    act(() => {
      mockWorker.postMessage({
        type: 'success',
      });
    });
    expect(getByText('Cancel')).toBeInTheDocument();
    fireEvent.click(getByText('Cancel'));
    fireEvent.click(getByText('Confirm'));
    expect(onClose).toHaveBeenCalled();
  });
  it('should render content successfully when worker postmessage success and click minimize', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
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
    act(() => {
      mockWorker.postMessage({
        type: 'success',
      });
    });
    const minimizeButton = getByTestId('CloseIcon');

    fireEvent.click(minimizeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should render content successfully when worker postmessage success and uploading success', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    jest
      .spyOn(request, 'post')
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: [
            {
              id: 'uploadFileId',
              sizeInMb: 0.001,
            },
          ],
        });
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: 'progressId',
        });
      });

    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await act(async () => {
      await fireEvent.click(getByText('Upload'));
    });

    await act(async () => {
      await mockWorker.postMessage({
        type: 'success',
      });
    });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    await act(() => {
      jest.advanceTimersByTime(1000);
    });

    const okayText = getByText('OK');

    expect(okayText).toBeInTheDocument();

    fireEvent.click(okayText);
  });

  it('should render content successfully when worker postmessage success and uploading failed', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
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
      fireEvent.click(getByText('Upload'));
    });

    await act((async) => {
      mockWorker.postMessage({
        type: 'success',
      });
    });

    jest
      .spyOn(request, 'post')
      .mockClear()
      .mockImplementationOnce(() => {
        return Promise.resolve({
          data: [
            {
              id: 'uploadFileId',
              sizeInMb: 0.001,
            },
          ],
        });
      })
      .mockImplementationOnce(() => {
        return Promise.reject({
          data: 'progressId',
        });
      });

    expect(getByText('Cancel')).toBeInTheDocument();
  });

  it('should render content successfully when happen interrupted', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const onInterrupted = jest.fn();

    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        mockWorker={mockWorker}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        onInterrupted={onInterrupted}
      />,
      { wrapper }
    );
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

    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_value',
        name: 'Employee Email',
        error: 'Employee Email',
      });
    });

    const beforeUnloadEvent = new Event('beforeunload');
    const unloadEvent = new Event('unload');
    window.dispatchEvent(beforeUnloadEvent);
    window.dispatchEvent(unloadEvent);

    expect(onInterrupted).toHaveBeenCalled();
  });

  it('should render content successfully when happen interrupted and close modal', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const onInterrupted = jest.fn();

    const { getByText } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        mockWorker={mockWorker}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        onInterrupted={onInterrupted}
        initState={{ fileName: 'FileError.xlsx' }}
        isInterrupted
      />,
      { wrapper }
    );

    expect(getByText('Close')).toBeInTheDocument();
    expect(getByText('Resubmit')).toBeInTheDocument();

    fireEvent.click(getByText('Close'));

    expect(onClose).toHaveBeenCalledWith(true);
  });

  it('should render content successfully after upload file invalid file name', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
    const fileInput = getByTestId('upload-input');
    // Create a mock file object
    const file = new File(['file content'], 'fileNameError123@@@@@', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(getByText('Upload')).toBeDisabled();
    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });
    expect(getByText('fileNameError123@@@@@')).toBeInTheDocument();
    expect(getByText('Upload')).toBeDisabled();
    expect(getByText('Reselect')).toBeInTheDocument();
  });

  it('should render content successfully after upload file invalid file name', async () => {
    const onClose = jest.fn();
    const onError = jest.fn();
    const onResubmit = jest.fn();
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();
    const { getByText, getByTestId } = render(
      <ImportModal
        open
        title="Import Time Log"
        downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
        onClose={onClose}
        onError={onError}
        onSuccess={onSuccess}
        onReceiveFileSize={onReceiveFileSize}
        onResubmit={onResubmit}
        mockWorker={mockWorker}
      />,
      { wrapper }
    );
    const fileInput = getByTestId('upload-input');

    const fileName =
      'fileNameError123@fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123fileNameError123';
    // Create a mock file object
    const file = new File(['file content'], fileName, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    expect(getByText('Upload')).toBeDisabled();
    // Simulate a file change event
    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(getByText('Upload')).toBeDisabled();
    expect(getByText('Reselect')).toBeInTheDocument();
  });
});

describe('Stepper', () => {
  it('should render content successfully', () => {
    const { getByText } = render(
      <Stepper activeStep={0} steps={Object.values(IMPORT_STEP)} selectedFile={null} />,
      { wrapper }
    );

    expect(getByText('Check')).toBeInTheDocument();
  });

  it('should render content successfully with complete', () => {
    const { getByText } = render(
      <Stepper activeStep={2} steps={Object.values(IMPORT_STEP)} selectedFile={null} />,
      { wrapper }
    );

    expect(getByText('Check')).toBeInTheDocument();
  });
});

describe('InstructionBox', () => {
  it('should render content successfully', () => {
    const { getByText } = render(<InstructionBox downloadTemplateUrl="/" />, { wrapper });

    expect(getByText('Download template')).toBeInTheDocument();
    fireEvent.click(getByText('Download template'));
  });
});

describe('FileValidatingBox', () => {
  const mockWorker = new Worker('/');

  const file = new File(['file content'], 'kakaka.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const selectedFile = {
    file,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const { getByText } = render(
      <FileValidatingBox
        workerThread={new Worker('')}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
      />
    );

    expect(getByText('Validating data...')).toBeInTheDocument();
  });

  it('renders with worker post message checking header', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_header',
        error: 'Hours',
        name: 'Hours',
      });
    });

    expect(onError).toHaveBeenCalled();
  });

  it('renders with worker post message checking value', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_value',
        name: 'Employee Email',
        error: 'Employee Email',
      });
    });

    expect(onError).toHaveBeenCalled();
  });

  it('renders with worker post message checking data', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_data',
        error: 'File does have any data',
      });
    });

    expect(onError).toHaveBeenCalled();
  });

  it('renders with checking update state', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    const { getByTestId } = render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'update_state',
        data: {
          ['Employee Email']: {
            name: 'Employee Email',
            status: 'valid',
          },
        },
      });
    });

    expect(getByTestId('CheckCircleIcon')).toBeInTheDocument();
  });

  it('renders with success', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'success',
      });
    });

    expect(onSuccess).toHaveBeenCalled();
  });

  it('renders with error', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      if (mockWorker.onerror) {
        mockWorker.onerror('Simulated worker error');
      }
    });

    expect(onError).toHaveBeenCalled();
  });

  it('renders with worker post message error_checking_maximum_records', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'error_checking_maximum_records',
      });
    });

    expect(onError).toHaveBeenCalled();
  });
  it('renders with worker post message error_missing_value', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'error_missing_value',
        name: 'Employee Email',
        error: 'Employee Email',
      });
    });

    expect(onError).toHaveBeenCalled();
  });

  it('renders with worker post message success_checking_maximum_records', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();

    render(
      <FileValidatingBox
        workerThread={mockWorker}
        selectedFile={selectedFile}
        onError={onError}
        onSuccess={onSuccess}
        templateValidation={templateValidation}
      />
    );

    act(() => {
      mockWorker.postMessage({
        type: 'success_checking_maximum_records',
      });
    });
  });
});

describe('UploadProgressBox', () => {
  it('should render content successfully without fle', () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onReceiveFileSize = jest.fn();
    const { getByText } = render(
      <UploadProgressBox
        onSuccess={onSuccess}
        onError={onError}
        selectedFile={null}
        onReceiveFileSize={onReceiveFileSize}
      />,
      { wrapper }
    );

    expect(getByText('0 %')).toBeInTheDocument();
  });

  it('should render content successfully with Error', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onReceiveFileSize = jest.fn();

    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const selectedFile = {
      file,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    jest.spyOn(request, 'post').mockRejectedValue('error');

    render(
      <UploadProgressBox
        onSuccess={onSuccess}
        onError={onError}
        selectedFile={selectedFile}
        onReceiveFileSize={onReceiveFileSize}
      />,
      { wrapper }
    );

    await waitFor(() => {
      expect(onError).toHaveBeenCalled();
    });
  });

  it('should render content successfully with successful upload', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onReceiveFileSize = jest.fn();

    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const selectedFile = {
      file,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    jest
      .spyOn(request, 'post')

      .mockResolvedValue({ data: '123123123' });

    await act(async () => {
      await render(
        <UploadProgressBox
          onSuccess={onSuccess}
          onError={onError}
          selectedFile={selectedFile}
          onReceiveFileSize={onReceiveFileSize}
        />,
        { wrapper }
      );
    });
  });

  it('calls onUploadProgress with the correct progress 100% and fake intervar', async () => {
    const onSuccess = jest.fn();
    const onError = jest.fn();
    const onReceiveFileSize = jest.fn();

    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const selectedFile = {
      file,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    const progressEvent = { progress: 1 };

    jest.spyOn(request, 'post').mockImplementationOnce((url, data, config) => {
      if (config) {
        config.onUploadProgress(progressEvent); // Simulate upload progress
      }
      return Promise.resolve({ data: {} }); // Simulate a successful response
    });

    await act(async () => {
      await render(
        <UploadProgressBox
          onSuccess={onSuccess}
          onError={onError}
          selectedFile={selectedFile}
          onReceiveFileSize={onReceiveFileSize}
        />,
        { wrapper }
      );
    });

    act(() => {
      Array.from({ length: 50 }).map(() => jest.advanceTimersByTime(100));
    });
  });

  it('calls onUploadProgress with the correct progress 98%', async () => {
    const onReceiveFileSize = jest.fn();
    const onSuccess = jest.fn();

    const onError = jest.fn();
    const file = new File(['file content'], 'kakaka.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const selectedFile = {
      file,
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };

    jest
      .spyOn(request, 'post')
      .mockImplementationOnce((url, data, config) => {
        if (config) {
          config.onUploadProgress({ progress: 0.96 });
        }
        return Promise.resolve({ data: {} });
      })
      .mockImplementationOnce((url, data, config) => {
        if (config) {
          config.onUploadProgress({ progress: 0.98 });
        }
        return Promise.resolve({ data: {} });
      })
      .mockResolvedValue({ message: 'ok' })
      .mockImplementationOnce((url, data, config) => {
        if (config) {
          config.onUploadProgress({ progress: 1 });
        }
        return Promise.resolve({ data: {} });
      });

    await act(async () => {
      await render(
        <UploadProgressBox
          onSuccess={onSuccess}
          onError={onError}
          selectedFile={selectedFile}
          onReceiveFileSize={onReceiveFileSize}
        />,
        { wrapper }
      );

      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});

describe('FinishedUploadingBox', () => {
  it('should render content successfully', () => {
    const mockOnClose = jest.fn();
    const { baseElement } = render(<FinishedUploadingBox onClose={mockOnClose} />, { wrapper });

    expect(baseElement).not.toBeNull();
  });
});
