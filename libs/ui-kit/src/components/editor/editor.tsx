'use client';

import './editor.scss';

import { Editor } from '@toast-ui/react-editor';
import { useRef } from 'react';

import { ESPEditorProps } from './type';

export const ESPEditor = ({ onChange, ...props }: ESPEditorProps) => {
  const editorRef = useRef<Editor>(null);

  const handleOnChange = () => {
    const value = editorRef.current?.getInstance().getHTML();

    if (typeof onChange === 'function') {
      onChange(value as string);
    }
  };

  return (
    <div className="editor-wrapper">
      <Editor
        ref={editorRef}
        previewStyle="vertical"
        height="400px"
        useCommandShortcut={true}
        hideModeSwitch={true}
        initialEditType="wysiwyg"
        toolbarItems={[
          ['heading', 'bold', 'italic', 'strike'],
          ['hr', 'quote'],
          ['ul', 'ol', 'task', 'indent', 'outdent'],
          ['table', 'image', 'link'],
        ]}
        autofocus={false}
        {...props}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default ESPEditor;
