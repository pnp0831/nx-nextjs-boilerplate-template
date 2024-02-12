'use client';

import './upload-input.scss';

import AudioFileIcon from '@mui/icons-material/AudioFile';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorIcon from '@mui/icons-material/Error';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { Box } from '@mui/material';
import clsx from 'clsx';
import React, { forwardRef, useRef, useState } from 'react';

import { ESPTypography } from '../typography';
import { ESPFile, ESPUploadInputProps } from './type';

const getIcon = (type = '') => {
  switch (true) {
    case type.startsWith('audio/'):
      return <AudioFileIcon fontSize="small" color="primary" />;
    case type.startsWith('video/'):
      return <VideoFileIcon fontSize="small" color="primary" />;
    case type.startsWith('text/csv'):
    case type.startsWith('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'):
      return <FileCopyIcon fontSize="small" color="primary" />;

    case type.indexOf('pdf') > -1:
      return <PictureAsPdfIcon fontSize="small" color="primary" />;

    default:
      return <DescriptionIcon fontSize="small" color="primary" />;
  }
};

const onBeforeUpload = (files: FileList, maxSize = 5 * 1024 * 1024) => {
  const reviewFiles: ESPFile[] = [];
  const valid = true;

  const arrayFiles = Array.from(files);

  const currentSize = arrayFiles.reduce((newSize, { size }) => newSize + size, 0);

  if (currentSize > maxSize) {
    return {
      files: [],
      valid: false,
      helperText: 'File is error',
    };
  }

  arrayFiles.forEach((file) => {
    if (file.type?.startsWith('image/')) {
      const src = URL.createObjectURL(file);
      reviewFiles.push({
        file,
        src,
        isValid: !!src,
        type: file.type,
      });
    } else {
      reviewFiles.push({
        file,
        type: file.type,
      });
    }
  });

  return {
    files: reviewFiles,
    valid,
    helperText: '',
  };
};

export const ESPUploadInput = forwardRef((props: ESPUploadInputProps, _ref) => {
  const { multiple, accept, maxSize, error, onChange, errorMessage } = props;

  const [filesReview, setFilesReview] = useState<ESPFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const { files, valid, helperText } = await onBeforeUpload(event.currentTarget.files, maxSize);

      if (!valid && helperText) {
        return;
      }

      if (onChange) {
        onChange(files);
      }

      const newFiles = multiple ? [...filesReview, ...files] : [...files];

      setFilesReview(newFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    const tmpFiles = [...filesReview];
    tmpFiles.splice(index, 1);
    setFilesReview(tmpFiles);

    if (onChange) {
      onChange(tmpFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isEmptyFiles = filesReview.length === 0;

  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleChange({
        currentTarget: {
          files: multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]],
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const commonProps = {
    onDragEnter: handleDrag,
    onDragLeave: handleDrag,
    onDragOver: handleDrag,
    onDrop: handleDrop,
    'data-testid': 'dropcontent',
  };

  return (
    <div
      className={clsx('upload-input', {
        'upload-input__empty': multiple ? isEmptyFiles : true,
      })}
      onDragEnter={handleDrag}
      data-testid="dropzone"
    >
      {multiple ? (
        <div
          className={clsx('upload-input-content', {
            'upload-input-content__empty': isEmptyFiles,
            'upload-input-content__dragger': dragActive,
          })}
          {...commonProps}
        >
          {filesReview.map(({ src, file, type }, index) => {
            return (
              <div
                className={clsx('file-review', {
                  'file-review__file': !type?.startsWith('image/'),
                })}
                key={src || index}
              >
                {type?.startsWith('image/') ? (
                  <img src={src} alt={file.name} loading="lazy" />
                ) : (
                  <div className="file-review__file__content file-review__file__content--multiple">
                    {getIcon(file.type)}
                    <ESPTypography variant="bold_s">{file.name}</ESPTypography>
                  </div>
                )}
                <div className="upload-input-content__delete">
                  <CloseIcon
                    fontSize="small"
                    data-testid={`remove-img-${index}`}
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              </div>
            );
          })}

          <div
            className={clsx('upload-input-wrapper', {
              'upload-input-wrapper__empty': isEmptyFiles,
              'upload-input-wrapper__error': error,
            })}
            onClick={() => {
              if (inputRef.current) {
                inputRef.current.click();
              }
            }}
          >
            <CloudUploadIcon color="primary" />

            <ESPTypography component="p" variant="regular_s">
              Drop your file here or
              <ESPTypography
                color="primary"
                component="span"
                variant="regular_s"
                sx={{ marginLeft: '0.25rem' }}
              >
                Browse
              </ESPTypography>
            </ESPTypography>

            {isEmptyFiles && (
              <ESPTypography variant="regular_m">
                Files: png, jpg, pdf, docx, doc, xls, xlsx, csv, svg, etc
              </ESPTypography>
            )}
          </div>
        </div>
      ) : (
        <div
          className={clsx('upload-input-wrapper', {
            'upload-input-wrapper__empty': true,
            'upload-input-wrapper__error': error,
            'upload-input-wrapper__dragger': dragActive,
          })}
          {...commonProps}
          onClick={() => {
            if (inputRef.current) {
              inputRef.current.click();
            }
          }}
        >
          {filesReview.map(({ src, file, type }, index) => {
            return (
              <div key={src || index}>
                {type?.startsWith('image/') ? (
                  <img src={src} alt={file.name} loading="lazy" />
                ) : (
                  <div>
                    {errorMessage ? <ErrorIcon color="error" /> : getIcon(file.type)}

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ESPTypography
                        variant="bold_s"
                        sx={{
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          maxWidth: '20rem',
                        }}
                      >
                        {file.name}
                      </ESPTypography>

                      <ESPTypography
                        sx={{ cursor: 'pointer', marginLeft: '0.25rem' }}
                        onClick={(e) => {
                          e.stopPropagation();

                          if (!errorMessage) {
                            return handleRemoveFile(index);
                          }

                          if (inputRef.current) {
                            inputRef.current.click();
                          }
                        }}
                        variant="regular_s"
                        color="primary"
                      >
                        {errorMessage ? 'Reselect' : 'Delete'}
                      </ESPTypography>
                    </Box>
                  </div>
                )}
              </div>
            );
          })}

          {isEmptyFiles && (
            <>
              <CloudUploadIcon color="primary" sx={{ marginBottom: '0.5rem' }} />
              <ESPTypography component="p" variant="regular_s">
                Drop your file here or
                <ESPTypography
                  color="primary"
                  component="span"
                  variant="regular_s"
                  sx={{ marginLeft: '0.25rem' }}
                >
                  Browse
                </ESPTypography>
              </ESPTypography>

              <ESPTypography variant="regular_m">
                {typeof props.description !== 'undefined'
                  ? 'Files: png, jpg, pdf, docx, doc, xls, xlsx, csv, svg, etc'
                  : ''}
              </ESPTypography>
            </>
          )}

          {errorMessage && (
            <ESPTypography variant="regular_s" color="error" sx={{ marginTop: '0.25rem' }}>
              {errorMessage}
            </ESPTypography>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        accept={accept}
        type="file"
        onChange={handleChange}
        multiple={multiple}
        hidden
        data-testid="upload-input"
      />
    </div>
  );
});

ESPUploadInput.displayName = 'ESPUploadInput';

export default ESPUploadInput;
