import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockImportHistoryData } from '@esp/__mocks__/data-mock';
import { getLinkDownloadFile } from '@esp/apis/file-management';
import { ErrorResponse } from '@esp/constants/error';
import { act, fireEvent, render } from '@testing-library/react';
import { NotifyContextProvider } from '@ui-kit/contexts/notify-context';

import ImportHistory from '.';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: () => ({
      isLoading: false,
      error: {},
      data: {
        data: mockImportHistoryData,
      },
    }),
  };
});

jest.mock('@esp/apis/file-management', () => ({
  getLinkDownloadFile: jest.fn(),
}));

describe('Export History', () => {
  it('should render correct data', async () => {
    const { getByText } = render(
      <ContextNeededWrapper>
        <ImportHistory />
      </ContextNeededWrapper>
    );

    expect(getByText('File 1')).toBeInTheDocument();
    expect(getByText('File 3')).toBeInTheDocument();
    expect(getByText('Success')).toBeInTheDocument();
    expect(getByText('In Progress')).toBeInTheDocument();
  });

  it('should trigger handleDownloadFile', async () => {
    const fileName = 'example-file.txt';
    const data = 'https://test.com/download';

    const mockResponse = {
      data: {
        data: data,
      },
    };

    (getLinkDownloadFile as jest.Mock).mockResolvedValue(mockResponse);

    const { getAllByText } = render(
      <ContextNeededWrapper>
        <ImportHistory />
      </ContextNeededWrapper>
    );

    const downloadButton = getAllByText('Download');
    if (downloadButton[0]) {
      fireEvent.click(downloadButton[0]);
      await getLinkDownloadFile(fileName);
      expect(getLinkDownloadFile).toBeCalled();
    }
  });

  it('should handle error and showNotify', async () => {
    const ERROR_CODE = 400;
    const errorMessage = 'An error occurred';

    const errorResponse: ErrorResponse = {
      status: ERROR_CODE,
      errors: [{ message: errorMessage, errorCode: '100' }],
    };

    (getLinkDownloadFile as jest.Mock).mockRejectedValue(errorResponse);

    const { getAllByText } = render(
      <ContextNeededWrapper>
        <NotifyContextProvider>
          <ImportHistory />
        </NotifyContextProvider>
      </ContextNeededWrapper>
    );

    const downloadButton = getAllByText('Download');
    if (downloadButton[0]) {
      await act(async () => {
        await fireEvent.click(downloadButton[0]);
        expect(errorMessage).toEqual(errorResponse.errors[0].message);
      });
    }
  });

  it('should return if no data when trigger handleDownloadFile', async () => {
    const fileName = 'example-file.txt';

    const mockResponse = {
      data: null,
    };

    (getLinkDownloadFile as jest.Mock).mockResolvedValue(mockResponse);

    const { getAllByText } = render(
      <ContextNeededWrapper>
        <ImportHistory />
      </ContextNeededWrapper>
    );

    const downloadButton = getAllByText('Download');
    if (downloadButton[0]) {
      fireEvent.click(downloadButton[0]);

      await getLinkDownloadFile(fileName);
      expect(mockResponse.data).toBeNull();
    }
  });
});
