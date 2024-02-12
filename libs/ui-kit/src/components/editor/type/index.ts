import { EditorProps } from '@toast-ui/react-editor';

export interface ESPEditorProps extends Omit<EditorProps, 'children'> {
  onChange?: (data: string) => void;
  initialValue?: string;
}
