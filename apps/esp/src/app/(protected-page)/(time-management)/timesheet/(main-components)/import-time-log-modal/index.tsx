import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { ESPButton } from '@ui-kit/components/button';
import { ESPModal } from '@ui-kit/components/modal';
import { ESPTypography } from '@ui-kit/components/typography';
import { ESPFile, ESPUploadInput } from '@ui-kit/components/upload-input';
import usePrevious from '@ui-kit/hooks/usePrevious';
import { memo, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import {
  FileValidatingBox,
  FinishedUploadingBox,
  InstructionBox,
  Stepper,
  UploadProgressBox,
} from './import-time-log-modal.components';
import { useGetTimeLogTemplateValidation } from './import-time-log-modal.helper';
import {
  IImportModalProps,
  IMPORT_STEP,
  ITimeLogTemplateValidation,
} from './import-time-log-modal.type';

export const FILE_NAME_MAXIMUM_LENGTH = 100;
export const ERROR_FILE_NAME_MAXIMUM_LENGTH = `File name can not have more than ${FILE_NAME_MAXIMUM_LENGTH} characters`;
export const ERROR_FILE_NAME_TEXT = 'File name contains invalid characters.';
export const CANCEL_IMPORT_TEXT = 'Do you want to cancel the process?';
export const UPLOAD_ERROR_TEXT = 'Upload failed. Make sure that your network is working.';

const ImportModal = memo(
  ({
    title,
    accept = '.csv, .xls, .xlsx',
    downloadTemplateUrl,
    mockWorker,
    open,
    onClose,
    onSuccess,
    onError,
    onResubmit: propOnResubmit,
    className,
    initState,
    status,
    onReceiveFileSize,
    isInterrupted,
    onInterrupted,
    onUpdateState,
  }: IImportModalProps) => {
    const [workerThread] = useState(
      () => mockWorker || new Worker(`/scripts/import-time-log.worker.js`)
    );

    useEffect(() => {
      return () => {
        workerThread.terminate();
      };
    }, [workerThread]);

    const [disableCancelBtn, setDisableCancelBtn] = useState(false);
    const [helperText, setHelperText] = useState<string | ReactNode | null>();
    const [disableUploadBtn, setDisableUploadBtn] = useState(true);
    const [step, setStep] = useState<IMPORT_STEP | null>(() => initState?.step ?? null);
    const [selectedFile, setSelectedFile] = useState<ESPFile | null>(null);

    const [uploadHelperText, setUploadHelperText] = useState<string>();

    const previousStep = usePrevious(step);

    useEffect(() => {
      if (
        onUpdateState &&
        step === IMPORT_STEP.COMPLETED &&
        step !== previousStep &&
        initState?.step !== IMPORT_STEP.COMPLETED
      ) {
        onUpdateState({ step });
      }
    }, [step, previousStep]);

    const onBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    }, []);

    const onUnload = useCallback(
      (e: BeforeUnloadEvent) => {
        if (onInterrupted) {
          onInterrupted({
            fileName: selectedFile?.file.name,
            step,
          });
        }
      },
      [selectedFile?.file.name, step]
    );

    useEffect(() => {
      if (
        [IMPORT_STEP.CHECKING, IMPORT_STEP.UPLOADING].includes(step as IMPORT_STEP) &&
        !isInterrupted
      ) {
        window.addEventListener('beforeunload', onBeforeUnload);
        window.addEventListener('unload', onUnload);
      }

      return () => {
        if ([IMPORT_STEP.CHECKING, IMPORT_STEP.UPLOADING].includes(step as IMPORT_STEP)) {
          window.removeEventListener('beforeunload', onBeforeUnload);
          window.removeEventListener('unload', onUnload);
        }
      };
    }, [onBeforeUnload, onUnload, step, isInterrupted]);

    const onUploadInputChange = useCallback((files: ESPFile[]) => {
      const selectedFile = files?.[0];

      if (!selectedFile) {
        setDisableUploadBtn(true);
        return setSelectedFile(selectedFile);
      }

      const name = selectedFile?.file.name;

      // Check file name
      if (name.length > FILE_NAME_MAXIMUM_LENGTH) {
        setUploadHelperText(ERROR_FILE_NAME_MAXIMUM_LENGTH);
        return setDisableUploadBtn(true);
      }

      // Remove the file extension
      const fileNameWithoutExtension = name.replace(/\.[^/.]+$/, '');

      const regexFileName = new RegExp(/^[a-zA-Z0-9\-_]+$/);

      const isValidFileName = regexFileName.test(fileNameWithoutExtension);

      setUploadHelperText(isValidFileName ? '' : ERROR_FILE_NAME_TEXT);
      setDisableUploadBtn(!isValidFileName);
      setSelectedFile(selectedFile);
    }, []);

    const onClickUpload = useCallback(() => {
      onClose(false, selectedFile?.file.name as string);
      setStep(IMPORT_STEP.CHECKING);
    }, [setStep, onClose, selectedFile]);

    const onResubmit = useCallback(() => {
      setStep(null);
      setHelperText(null);
      setDisableUploadBtn(true);
      propOnResubmit();
    }, [setStep, propOnResubmit]);

    const onCancel = useCallback(() => {
      switch (step) {
        case IMPORT_STEP.CHECKING:
        case IMPORT_STEP.UPLOADING:
          if (helperText && helperText !== CANCEL_IMPORT_TEXT) {
            return onClose(true);
          }

          setHelperText(CANCEL_IMPORT_TEXT);

          break;

        default:
          // Close Modal
          onClose(true);
          break;
      }
    }, [step, helperText, onClose]);

    const onCheckingError = useCallback(
      (message: string | ReactNode) => {
        if (helperText !== CANCEL_IMPORT_TEXT) {
          setHelperText(message);
          onError(true);
        }
      },
      [setHelperText, helperText, onError]
    );

    const onCheckingSuccess = useCallback(() => setStep(IMPORT_STEP.UPLOADING), []);

    const onRegisterSuccess = useCallback(
      (data: string) => {
        onSuccess(data as string, selectedFile?.file.name as string);
        setTimeout(() => {
          setStep(IMPORT_STEP.COMPLETED);
        }, 1000);
      },
      [selectedFile?.file]
    );

    const onUploadAttachmentSuccess = useCallback(() => {
      setDisableCancelBtn(true);
      setHelperText(null);
    }, []);

    const onUploadOrRegisterError = useCallback(
      (message: string, isWarningFlow?: boolean) => {
        if (helperText !== UPLOAD_ERROR_TEXT) {
          setHelperText(message || UPLOAD_ERROR_TEXT);

          setDisableCancelBtn(false);

          onError(isWarningFlow);
        }
      },
      [setHelperText, helperText, onError]
    );

    const activeStep = useMemo(
      () =>
        ({
          [IMPORT_STEP.CHECKING]: 0,
          [IMPORT_STEP.UPLOADING]: 1,
          [IMPORT_STEP.COMPLETED]: 2,
        }[step as IMPORT_STEP] || 0),
      [step]
    );

    const { data: template } = useGetTimeLogTemplateValidation();

    const onMinimize = useCallback(() => {
      onClose();
    }, []);

    const onConfirm = useCallback(() => {
      if (step === IMPORT_STEP.CHECKING) {
        workerThread.terminate();
      }

      onClose(true);
    }, [onClose, step, workerThread]);

    const renderModalFooter = () => {
      if (isInterrupted) {
        return (
          <>
            <ESPButton onClick={() => onClose(true)} color="secondary" sx={{ width: '6.875rem' }}>
              Close
            </ESPButton>
            <ESPButton sx={{ width: '6.875rem' }} onClick={onResubmit}>
              Resubmit
            </ESPButton>
          </>
        );
      }

      /* Case init modal */
      if (!step) {
        return (
          <>
            <ESPButton
              onClick={onCancel}
              disabled={disableCancelBtn}
              color="secondary"
              sx={{ width: '6.875rem' }}
            >
              Cancel
            </ESPButton>
            <ESPButton
              disabled={disableUploadBtn}
              sx={{ width: '6.875rem' }}
              onClick={onClickUpload}
            >
              Upload
            </ESPButton>
          </>
        );
      }

      /* Case uploading + register success */
      if (step === IMPORT_STEP.COMPLETED) {
        return (
          <Box textAlign="right" width="100%">
            <ESPButton
              onClick={() => {
                onClose();
              }}
              color="secondary"
              sx={{
                width: '6.875rem',
              }}
            >
              OK
            </ESPButton>
          </Box>
        );
      }

      /* Case validating error / call api failed */
      if (!helperText) {
        return (
          <ESPButton
            onClick={onCancel}
            disabled={disableCancelBtn}
            color="secondary"
            sx={{ width: '6.875rem' }}
          >
            Cancel
          </ESPButton>
        );
      }

      /* Case user click cancel button when uploading, validating */
      if (helperText === CANCEL_IMPORT_TEXT) {
        return (
          <>
            <ESPButton onClick={onConfirm} color="primary" sx={{ width: '6.875rem' }}>
              Confirm
            </ESPButton>
            <ESPButton
              onClick={() => {
                setHelperText(null);
              }}
              color="secondary"
              sx={{ width: '6.875rem' }}
            >
              No
            </ESPButton>
          </>
        );
      }

      return (
        <>
          <ESPButton
            onClick={onCancel}
            disabled={disableCancelBtn}
            color="secondary"
            sx={{ width: '6.875rem' }}
          >
            Cancel
          </ESPButton>
          <ESPButton onClick={onResubmit} sx={{ width: '6.875rem' }}>
            Resubmit
          </ESPButton>
        </>
      );
    };

    return (
      <ESPModal
        title={title}
        open={open}
        fullWidth
        maxWidth="sm"
        keepMounted
        className={className}
        actions={renderModalFooter()}
        hideCloseIcon={!step}
        closeIcon={
          <IconButton onClick={onMinimize}>
            <CloseIcon />
          </IconButton>
        }
      >
        {isInterrupted ? (
          <ESPTypography variant="regular_l">
            Sorry. Your submission
            <ESPTypography variant="bold_l" sx={{ margin: '0 0.25rem' }}>
              {initState?.fileName}
            </ESPTypography>{' '}
            had been interrupted.
          </ESPTypography>
        ) : (
          <>
            {!step && (
              <>
                <ESPUploadInput
                  accept={accept}
                  onChange={onUploadInputChange}
                  description={undefined}
                  errorMessage={uploadHelperText}
                  error={!!uploadHelperText}
                />
                <InstructionBox downloadTemplateUrl={downloadTemplateUrl} />
              </>
            )}

            {step && (
              <Stepper
                activeStep={activeStep}
                steps={Object.values(IMPORT_STEP)}
                selectedFile={selectedFile}
                isError={!!helperText && ![CANCEL_IMPORT_TEXT].includes(helperText as string)}
              />
            )}

            <Box sx={{ marginTop: '0.625rem' }}>
              {step === IMPORT_STEP.CHECKING && (
                <FileValidatingBox
                  workerThread={workerThread}
                  selectedFile={selectedFile}
                  onError={onCheckingError}
                  onSuccess={onCheckingSuccess}
                  templateValidation={template as ITimeLogTemplateValidation[]}
                />
              )}

              {step === IMPORT_STEP.UPLOADING && (
                <UploadProgressBox
                  selectedFile={selectedFile}
                  onSuccess={onRegisterSuccess}
                  onError={onUploadOrRegisterError}
                  onUploadAttachmentSuccess={onUploadAttachmentSuccess}
                  onReceiveFileSize={onReceiveFileSize}
                />
              )}
              {step === IMPORT_STEP.COMPLETED && (
                <FinishedUploadingBox onClose={onClose} status={status} />
              )}
            </Box>

            {step !== IMPORT_STEP.COMPLETED && (
              <Box mt="0.5rem" sx={{ minHeight: '1.5rem' }}>
                <ESPTypography variant="regular_m" color="error">
                  {helperText}
                </ESPTypography>
              </Box>
            )}
          </>
        )}
      </ESPModal>
    );
  }
);

ImportModal.displayName = 'ImportModal';

export default ImportModal;
