import './import-time-log-modal.scss';

import { IUploadAttachment, uploadAttachment } from '@esp/apis/file-management';
import { registerImportTimeLog } from '@esp/apis/time-management';
import CircleLoading from '@esp/components/circle-loading';
import { APP_ROUTE } from '@esp/constants';
import { LOADING_STATUS } from '@esp/contexts/import-export-notifier-context';
import CustomLink from '@esp/libs/next-link';
import { triggerDownload } from '@esp/utils/helper';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DangerousIcon from '@mui/icons-material/Dangerous';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { LinearProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import { StepIconProps } from '@mui/material/StepIcon';
import MuiStepper from '@mui/material/Stepper';
import { useTheme } from '@mui/material/styles';
import { ESPTypography } from '@ui-kit/components/typography';
import { ESPFile } from '@ui-kit/components/upload-input';
import { getErrorMessages } from '@ui-kit/helpers';
import { AxiosProgressEvent } from 'axios';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import {
  ColorlibConnector,
  ColorlibStepIconRoot,
  StyledStepLabel,
} from './import-time-log-modal.style';
import {
  ColumnValidationStatus,
  ICheckingInfo,
  IFileValidatingBoxProps,
  ITimeLogTemplateValidation,
  IUploadProgressBoxProps,
} from './import-time-log-modal.type';

const MAXIMUM_RECORDS = 10000;

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className, error } = props;

  const theme = useTheme();

  const isError = active && error;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LibraryAddCheckIcon sx={{ fontSize: '1rem' }} />,
    2: <CloudUploadIcon sx={{ fontSize: '1rem' }} />,
    3: <ImportantDevicesIcon sx={{ fontSize: '1rem' }} />,
  };

  let status;
  let overrideCircleColor;

  switch (true) {
    case isError:
      status = LOADING_STATUS.ERROR_LOADING;
      overrideCircleColor = '#EBEEF0';
      break;

    case active:
      status = LOADING_STATUS.INPROCESS_LOADING;
      overrideCircleColor = theme.palette.orange.main;
      break;

    case completed:
      status = LOADING_STATUS.SUCCESS_LOADING;
      overrideCircleColor = theme.palette.orange.main;
      break;

    default:
      status = LOADING_STATUS.NO_LOADING;
      overrideCircleColor = '#EBEEF0';
      break;
  }

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active, error: isError }} className={className}>
      <CircleLoading status={status} overrideCircleColor={overrideCircleColor} showNoLoading />
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

export const InstructionBox = memo(({ downloadTemplateUrl }: { downloadTemplateUrl: string }) => {
  const onDowloadTemplate = () => triggerDownload(downloadTemplateUrl);

  return (
    <>
      <ESPTypography variant="bold_s" sx={{ lineHeight: '1.375rem', marginTop: '0.25rem' }}>
        Things to pay attention before submitting your file:
      </ESPTypography>
      <Box component="ul" sx={{ paddingLeft: 0, margin: 0 }}>
        {[
          'The file can be max 10000 rows.',
          'Do not modify the Table Header (the first row).',
          'The second row is an example.',
          "You can only import yours and your subordinates' time logs.",
          'All the columns of the Download template are required except Description.',
          'File name can only be: max 100 chars, alphanumeric (a-z, 0-9), hyphen(-), or underscore(_)',
        ].map((text) => (
          <Box key={text} display="flex" alignItems="center">
            <FiberManualRecordIcon sx={{ fontSize: '0.375rem', margin: '0 0.375rem' }} />
            <ESPTypography variant="regular_s" sx={{ fontStyle: 'italic', lineHeight: '1.375rem' }}>
              {text}
            </ESPTypography>
          </Box>
        ))}
      </Box>
      <ESPTypography
        variant="regular_s"
        color="primary"
        sx={{
          textDecoration: 'underline',
          cursor: 'pointer',
          lineHeight: '1.375rem',
          fontWeight: 500,
          width: 'max-content',
        }}
        onClick={onDowloadTemplate}
      >
        Download template
      </ESPTypography>
    </>
  );
});

interface IStepperProps {
  activeStep: number;
  steps: string[];
  selectedFile: ESPFile | null;
  isError?: boolean;
}

export const Stepper = memo(({ steps, activeStep, selectedFile, isError }: IStepperProps) => {
  return (
    <Box className="stepper-wrapper">
      <ESPTypography variant="bold_m" component="p">
        {selectedFile?.file.name}
      </ESPTypography>
      <MuiStepper
        activeStep={activeStep === 2 ? 3 : activeStep}
        sx={{
          alignItems: 'flex-start',
        }}
        connector={<ColorlibConnector />}
      >
        {steps.map((label, currentStep) => (
          <Step key={label}>
            <StyledStepLabel
              error={isError && activeStep === currentStep}
              StepIconComponent={ColorlibStepIcon}
            >
              <ESPTypography variant="bold_s" sx={{ color: (theme) => theme.palette.mandate.main }}>
                {label}
              </ESPTypography>
            </StyledStepLabel>
          </Step>
        ))}
      </MuiStepper>
    </Box>
  );
});

export const FileValidatingBox = memo(
  ({
    selectedFile,
    onError,
    onSuccess,
    workerThread: worker,
    templateValidation,
  }: IFileValidatingBoxProps) => {
    const refCheckFile = useRef(false);

    const getMaximumRecordsObj = useCallback((status: ColumnValidationStatus = 'unknown') => {
      return {
        maximumRecords: {
          name: 'Within maximum records',
          status,
        },
      };
    }, []);

    const getValidatingResult = useCallback(
      (status: ColumnValidationStatus = 'unknown') => {
        return (templateValidation || [])?.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.header]: {
              name: cur.header,
              status,
              isColumn: true,
            },
          }),
          {
            ...getMaximumRecordsObj('unknown'),
          }
        );
      },
      [getMaximumRecordsObj, templateValidation]
    );

    const [checkingInfo, setCheckingInfo] = useState<ICheckingInfo>(
      () => getValidatingResult('unknown') as ICheckingInfo
    );

    const handleCheckingFile = useCallback(
      (file: File, templateValidation: ITimeLogTemplateValidation[]) => {
        // Send the file to the Web Worker for processing
        worker.postMessage({
          file,
          template: templateValidation,
          maximum_records: MAXIMUM_RECORDS,
        });

        worker.onmessage = function (event) {
          const { type, error, data, name, invalidRow } = event.data;

          if (type === 'error_checking_maximum_records') {
            setCheckingInfo((oldData) => ({
              ...oldData,
              ...getMaximumRecordsObj('invalid'),
            }));

            return onError('The file can not have more than 10,000 rows');
          }

          if (type === 'success_checking_maximum_records') {
            setCheckingInfo((oldData) => ({
              ...oldData,
              ...getMaximumRecordsObj('valid'),
            }));
          }

          if (type === 'error_checking_data') {
            setCheckingInfo(getValidatingResult('invalid') as ICheckingInfo);
            return onError(error as string);
          }

          if (type === 'error_checking_header') {
            setCheckingInfo((oldData) => ({
              ...oldData,
              ...data,
            }));

            return onError(
              <>
                Missing
                <ESPTypography variant="bold_m" sx={{ marginLeft: '0.25rem' }}>
                  {name.replace('*', '')}
                </ESPTypography>{' '}
                column. Please do not modify the Table Header
              </>
            );
          }

          if (type === 'error_checking_value') {
            return onError(
              <>
                <ESPTypography variant="bold_m" sx={{ marginRight: '0.25rem' }}>
                  &rdquo;{name.replace('*', '')}&rdquo;
                </ESPTypography>
                on row
                <ESPTypography variant="bold_m" sx={{ margin: '0 0.25rem' }}>
                  #{invalidRow}
                </ESPTypography>
                is invalid
              </>
            );
          }

          if (type === 'error_missing_value') {
            return onError(
              <>
                Missing&nbsp;
                <ESPTypography variant="bold_m" sx={{ marginRight: '0.25rem' }}>
                  &rdquo;{name.replace('*', '')}&rdquo;
                </ESPTypography>
                on row
                <ESPTypography variant="bold_m" sx={{ margin: '0 0.25rem' }}>
                  #{invalidRow}
                </ESPTypography>
              </>
            );
          }

          if (type === 'update_state') {
            setCheckingInfo((oldData) => ({
              ...oldData,
              ...data,
            }));
          }

          if (type === 'success') {
            onSuccess();
          }
        };

        worker.onerror = function (error) {
          onError('Error when read file, please try again!');
        };
      },
      [getMaximumRecordsObj, getValidatingResult, onError, onSuccess, worker]
    );

    useEffect(() => {
      if (selectedFile?.file && !refCheckFile.current && templateValidation?.length) {
        handleCheckingFile(selectedFile.file, templateValidation);
        refCheckFile.current = true;
      }
    }, [selectedFile, handleCheckingFile, templateValidation]);

    return (
      <Box>
        <ESPTypography variant="bold_m">Validating data...</ESPTypography>

        <Box sx={{ marginLeft: '0.25rem' }} className="scrollbar-trigger-visibility">
          {Object.entries(checkingInfo).map(([key, value], index) => {
            return (
              <Box key={key} display="flex" alignItems="center">
                {value.status === 'invalid' && (
                  <DangerousIcon sx={{ fontSize: '1.125rem', color: 'var(--red-color)' }} />
                )}

                {value.status === 'valid' && (
                  <CheckCircleIcon sx={{ fontSize: '1.125rem' }} color="success" />
                )}

                {value.status === 'unknown' && (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: '1.125rem', color: 'var(--black-muted-color)' }}
                  />
                )}

                <ESPTypography
                  sx={{
                    fontStyle: 'italic',
                    marginLeft: '0.25rem',
                    lineHeight: '1.5rem',
                  }}
                  variant="regular_s"
                >
                  {value.isColumn ? `Column: ${value.name.replace('*', '')}` : value.name}
                </ESPTypography>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
);

export const UploadProgressBox = memo(
  ({
    selectedFile,
    onSuccess,
    onError,
    onUploadAttachmentSuccess,
    onReceiveFileSize,
  }: IUploadProgressBoxProps) => {
    const [progress, setProgress] = useState(0);
    const [isDoneIntialUploading, setisDoneIntialUploading] = useState<boolean>(false);
    const [controller] = useState(() => new AbortController());
    const refFirstReturnData = useRef(false);

    const [isFakeProgress, setIsFakeProgress] = useState(false);

    const [isError, setIsError] = useState(false);

    useEffect(() => {
      if (isDoneIntialUploading) {
        setProgress(98);
      }
    }, [isDoneIntialUploading]);

    useEffect(() => {
      let interval: NodeJS.Timer;
      if (isFakeProgress) {
        interval = setInterval(() => {
          setProgress((progress) => {
            if (progress <= 96) {
              return progress + 2;
            }

            return progress;
          });
        }, 100);

        if (isDoneIntialUploading || isError) {
          clearInterval(interval as unknown as number);
        }
      }

      return () => {
        clearInterval(interval as unknown as number);
      };
    }, [isFakeProgress, isDoneIntialUploading, isError]);

    useEffect(() => () => controller.abort(), []);

    const handleUploadFile = useCallback(async (file: File) => {
      try {
        const { data: resUploadAttachment } = await uploadAttachment(file, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: async (progressEvent: AxiosProgressEvent) => {
            let percentCompleted = Math.floor((progressEvent.progress ?? 0) * 100);
            if (!refFirstReturnData.current && percentCompleted === 100) {
              setIsFakeProgress(true);
            } else {
              if (percentCompleted === 100 && !isDoneIntialUploading) {
                percentCompleted = 98;
              }
              setProgress(percentCompleted);
            }
            refFirstReturnData.current = true;
          },
        });

        setisDoneIntialUploading(true);

        onUploadAttachmentSuccess();

        const { id, sizeInMB } = resUploadAttachment[0] as IUploadAttachment;

        onReceiveFileSize(sizeInMB);

        const { data: progressId } = await registerImportTimeLog(id);

        setProgress(100);
        onSuccess(progressId);
      } catch (e) {
        if ((e as Error).name !== 'CanceledError') {
          const errorMessage = getErrorMessages(e);
          onError(errorMessage, true);
          setIsError(true);
        }
      }
    }, []);

    useEffect(() => {
      if (selectedFile) {
        const { file } = selectedFile;
        handleUploadFile(file);
      }
    }, [handleUploadFile, selectedFile]);

    return (
      <>
        <Box display="flex" pt="0.625rem" alignItems="center" justifyContent="space-between">
          <ESPTypography variant="bold_m">
            {progress === 98 ? 'Finalizing' : 'Uploading'}...
          </ESPTypography>
          <ESPTypography
            variant="bold_s"
            sx={{
              color: 'var(--orange-color)',
            }}
          >
            {progress} %
          </ESPTypography>
        </Box>

        <LinearProgress
          variant="determinate"
          sx={{
            margin: '1rem 0 ',
            backgroundColor: 'var(--gray-medium-color)',
            borderRadius: '0.5rem',
            '& span': {
              backgroundColor: 'var(--orange-color)',
            },
          }}
          value={progress}
        />
      </>
    );
  }
);

export const FinishedUploadingBox = memo(
  ({
    onClose,
    status,
  }: {
    status?: LOADING_STATUS;
    onClose: (isRemove?: boolean, fileName?: string) => void;
  }) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={'column'}
        mt="1.25rem"
      >
        <ESPTypography variant="regular_m" sx={{ lineHeight: '1.375rem' }}>
          We have received your submission. You will be notified once it is ready, or please check
          <CustomLink
            href={APP_ROUTE.IMPORT}
            onClick={() => {
              if (status === LOADING_STATUS.INPROCESS_LOADING) {
                onClose();
              }

              if (
                status === LOADING_STATUS.SUCCESS_LOADING ||
                status === LOADING_STATUS.ERROR_LOADING
              ) {
                onClose(true);
              }
            }}
          >
            <ESPTypography
              color="primary"
              variant="regular_m"
              component="span"
              sx={{
                textDecoration: 'underline',
                margin: '0 0.25rem',
                cursor: 'pointer',
                lineHeight: '1.375rem',
              }}
            >
              Import History
            </ESPTypography>
          </CustomLink>
          for the status.
        </ESPTypography>
      </Box>
    );
  }
);

FinishedUploadingBox.displayName = 'FinishedUploadingBox';
UploadProgressBox.displayName = 'UploadProgressBox';
FileValidatingBox.displayName = 'FileValidatingBox';
Stepper.displayName = 'Stepper';
InstructionBox.displayName = 'InstructionBox';
