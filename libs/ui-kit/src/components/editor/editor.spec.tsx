import { fireEvent, render, screen } from '@testing-library/react';

import { ESPEditor } from '.';
import ESPEditorInput from './editor';

describe('ESPEditor', () => {
  it('should render successfully', () => {
    const { container } = render(<ESPEditor />);

    const editorWrapper = container.querySelector('.editor-wrapper');
    expect(editorWrapper).toBeInTheDocument();
  });

  it('should render successfully', () => {
    const onChangeMock = jest.fn();
    const { container } = render(<ESPEditorInput />);

    const editorWrapper = container.querySelector('.editor-wrapper');
    expect(editorWrapper).toBeInTheDocument();
    expect(onChangeMock).not.toHaveBeenCalled();
  });

  it('calls the onChange callback with the correct value', async () => {
    const onChangeMock = jest.fn();

    const { container } = render(<ESPEditor onChange={onChangeMock} />);

    const editorInstance = container.querySelector('.toastui-editor-contents');

    expect(editorInstance).toBeInTheDocument();

    fireEvent.input(editorInstance as Element, { target: { textContent: 'New text content' } });

    expect(screen.getByText('New text content')).toBeInTheDocument();
  });
});
