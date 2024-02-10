import { ReactNode } from 'react';

export interface ESPUploadInputProps {
  multiple?: boolean;
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#accept
  accept?: string;
  onChange?: (value: ESPFile[]) => void;
  onDrop?: () => void;
  onRemove?: () => void;
  maxSize?: number;
  error?: boolean;
  description?: string | ReactNode;
  errorMessage?: string;
}

export interface ESPFile {
  src?: string;
  file: File;
  isValid?: boolean;
  type: string;
  helperText?: string;
}
