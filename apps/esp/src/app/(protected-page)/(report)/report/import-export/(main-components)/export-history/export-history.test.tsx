import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockExportHistoryData, mockFormattedExportHistoryData } from '@esp/__mocks__/data-mock';
import { getLinkDownloadFile } from '@esp/apis/file-management';
import { ErrorResponse } from '@esp/constants/error';
import { fireEvent, render } from '@testing-library/react';
import { NotifyContextProvider } from '@ui-kit/contexts/notify-context';

import ExportHistory from '.';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: () => ({
      isLoading: false,
      error: {},
      data: {
        data: mockExportHistoryData,
      },
    }),
  };
});

jest.mock('@esp/apis/file-management', () => ({
  getLinkDownloadFile: jest.fn(),
}));

jest.mock('./export-history.helper', () => ({
  ...jest.requireActual('./export-history.helper'),
  useGetProgressInformation: jest.fn().mockReturnValue({
    data: {
      data: mockFormattedExportHistoryData,
      totalCount: 3,
    },
  }),
}));

describe('Export History', () => {
  it('should render correct data', () => {
    const { getByText, getAllByText } = render(
      <ContextNeededWrapper>
        <ExportHistory />
      </ContextNeededWrapper>
    );

    expect(getByText('ExportTimeLog_20240122144440')).toBeInTheDocument();
    expect(getAllByText('Download all')).toHaveLength(1);
    expect(getAllByText('Success')).toHaveLength(1);
    expect(getByText('Error')).toBeInTheDocument();
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
        <ExportHistory />
      </ContextNeededWrapper>
    );

    const downloadButton = getAllByText('Download all');
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
          <ExportHistory />
        </NotifyContextProvider>
      </ContextNeededWrapper>
    );

    const downloadButton = getAllByText('Download all');
    if (downloadButton[0]) {
      fireEvent.click(downloadButton[0]);

      expect(errorMessage).toEqual(errorResponse.errors[0].message);
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
        <ExportHistory />
      </ContextNeededWrapper>
    );

    const downloadButton = getAllByText('Download all');
    if (downloadButton[0]) {
      fireEvent.click(downloadButton[0]);

      await getLinkDownloadFile(fileName);
      expect(mockResponse.data).toBeNull();
    }
  });
});
