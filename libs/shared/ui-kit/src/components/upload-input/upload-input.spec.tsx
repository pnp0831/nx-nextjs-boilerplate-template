import { act, fireEvent, render, screen } from '@testing-library/react';

import { ESPUploadInput } from '.';
import UploadInput from './upload-input';

describe('ESPUploadInput', () => {
  window.URL.createObjectURL = jest.fn();

  it('should render successfully', () => {
    const { baseElement } = render(<UploadInput />);
    expect(baseElement).toBeTruthy();
  });

  it('should render successfully', () => {
    render(<ESPUploadInput />);
    expect(screen.getByText('Drop your file here or')).toBeInTheDocument();

    const clickOpenBrowse = screen.getByText('Browse');

    expect(clickOpenBrowse).toBeInTheDocument();

    fireEvent.click(clickOpenBrowse);
  });

  it('handles file upload', async () => {
    render(<ESPUploadInput />);
    const fileInput = screen.getByTestId('upload-input');

    // Create a mock file object
    const file = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate a file change event

    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    const uploadedImage = screen.getByAltText('test.jpg');
    expect(uploadedImage).toBeInTheDocument();
  });

  it('handles file upload max size', async () => {
    render(<ESPUploadInput maxSize={1024} />);
    const fileInput = screen.getByTestId('upload-input');

    // Simulate a file change event

    await act(async () => {
      await fireEvent.change(fileInput, {
        target: {
          files: [
            {
              type: 'video',
              size: 5 * 1024 * 1024 * 1024,
            },
          ],
        },
      });
    });
  });

  it('handles file upload multiple', async () => {
    render(<ESPUploadInput multiple />);
    const fileInput = screen.getByTestId('upload-input');

    // Create a mock file object
    const file = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });
    const file2 = new File(['file content'], 'test123.jpg', { type: 'image/jpeg' });

    // Simulate a file change event

    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file, file2] } });
    });

    expect(screen.getByAltText('test.jpg')).toBeInTheDocument();

    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
  });

  it('handles file removed', async () => {
    render(<ESPUploadInput multiple />);
    const fileInput = screen.getByTestId('upload-input');

    // Create a mock file object
    const file = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate a file change event

    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    const uploadedImage = screen.getByAltText('test.jpg');
    expect(uploadedImage).toBeInTheDocument();

    const removeBtn = screen.getByTestId(`remove-img-0`);
    expect(removeBtn).toBeInTheDocument();

    // Trigger the file removal

    fireEvent.click(removeBtn);

    expect(uploadedImage).not.toBeInTheDocument();
  });

  it('handles drag drop multiple file', async () => {
    render(<ESPUploadInput multiple />);
    const dropContent = screen.getByTestId('dropcontent');

    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    expect(dropContent).toBeInTheDocument();

    // Create a mock file object
    const file = new File(['file content'], 'test2.jpg', { type: 'image/jpeg' });
    const file1 = new File(['file content'], 'test1.jpg', { type: 'image/jpeg' });

    // Simulate a file drag event
    fireEvent.dragEnter(screen.getByTestId('dropzone'), {
      dataTransfer: { files: [file] },
    });

    expect(dropContent).toHaveClass('upload-input-content__dragger');

    // Simulate the dragover event
    fireEvent.dragOver(dropContent);

    const fileList: FileList = {
      0: file,
      1: file1,
      length: 2,
      item: (index: number) => file,
    } as FileList;

    await act(async () => {
      await fireEvent.drop(dropContent, {
        dataTransfer: {
          files: fileList,
        },
      });
    });

    fireEvent.dragLeave(dropContent);

    expect(screen.getByTestId('dropcontent')).not.toHaveClass('upload-input-content__dragger');
    expect(screen.getByAltText('test1.jpg')).toBeInTheDocument();
    expect(screen.getByAltText('test2.jpg')).toBeInTheDocument();
  });

  it('handles drag drop single file', async () => {
    render(<ESPUploadInput multiple />);
    const dropContent = screen.getByTestId('dropcontent');

    expect(screen.getByTestId('dropzone')).toBeInTheDocument();
    expect(dropContent).toBeInTheDocument();

    // Create a mock file object
    const file = new File(['file content'], 'test.jpg', { type: 'image/jpeg' });

    // Simulate a file drag event
    fireEvent.dragEnter(screen.getByTestId('dropzone'), {
      dataTransfer: { files: [file] },
    });

    expect(dropContent).toHaveClass('upload-input-content__dragger');

    // Simulate the dragover event
    fireEvent.dragOver(dropContent);

    await act(async () => {
      await fireEvent.drop(dropContent, {
        dataTransfer: {
          files: [{ src: 'file1', name: 'file1' }],
        },
      });
    });

    expect(dropContent).not.toHaveClass('upload-input-content__dragger');
    expect(screen.getByText('file1')).toBeInTheDocument();
  });

  it('should render successfully', () => {
    render(<ESPUploadInput multiple description={undefined} />);

    expect(screen.getByText('Drop your file here or')).toBeInTheDocument();

    const clickOpenBrowse = screen.getByText('Browse');

    expect(clickOpenBrowse).toBeInTheDocument();

    fireEvent.click(clickOpenBrowse);
  });

  it('should render successfully with error', async () => {
    const mockOnChange = jest.fn();
    render(
      <ESPUploadInput
        description={undefined}
        error
        errorMessage="Error message"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Drop your file here or')).toBeInTheDocument();

    const fileInput = screen.getByTestId('upload-input');

    // Simulate a file change event

    const file = new File(['file content'], 'test.csv', { type: 'text/csv' });

    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(mockOnChange).toHaveBeenCalled();

    expect(screen.getByText('test.csv')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();

    const reselectButton = screen.getByText('Reselect');

    fireEvent.click(reselectButton);
  });

  it('should render successfully without error', async () => {
    const mockOnChange = jest.fn();
    render(<ESPUploadInput description={undefined} onChange={mockOnChange} />);

    expect(screen.getByText('Drop your file here or')).toBeInTheDocument();

    const fileInput = screen.getByTestId('upload-input');

    // Simulate a file change event

    const file = new File(['file content'], 'test.jpg', { type: 'image/jpg' });

    await act(async () => {
      await fireEvent.change(fileInput, { target: { files: [file] } });
    });

    expect(mockOnChange).toHaveBeenCalled();

    expect(screen.getByAltText('test.jpg')).toBeInTheDocument();
  });
});
