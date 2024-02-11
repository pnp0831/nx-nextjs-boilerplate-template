import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import {
  mockExportHistoryData,
  mockFormattedExportHistoryData,
  mockGetProgressInformationData,
} from '@esp/__mocks__/data-mock';
import { IDataProgressInformation, IExportProgressItems } from '@esp/apis/progress-management';
import { useQuery } from '@tanstack/react-query';
import { render, renderHook } from '@testing-library/react';

import {
  formatExportProgress,
  renderDownloadButton,
  useGetProgressInformation,
} from './export-history.helper';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

describe('useGetProgressInformation', () => {
  it('should fetch and format data correctly', async () => {
    (useQuery as jest.Mock).mockReturnValue(mockGetProgressInformationData);
    const { result } = renderHook(
      () =>
        useGetProgressInformation({
          exportTableName: 'export-helper',
          loadOptions: {},
        }),
      {
        wrapper: ContextNeededWrapper,
      }
    );
    const { data } = result.current;
    expect(data).not.toBeNull();
  });
});

describe('formattedExportProgress', () => {
  it('it should deflat export progress', async () => {
    const { data, totalCount } = formatExportProgress(
      mockExportHistoryData as IDataProgressInformation[]
    );
    expect(totalCount).toBe(3);
    expect(data).toEqual(mockFormattedExportHistoryData);
  });
});

describe('renderDownloadButton', () => {
  it('render Export Progress that has group', async () => {
    const { getByText } = render(
      renderDownloadButton(mockFormattedExportHistoryData[0] as IExportProgressItems, jest.fn())
    );
    expect(getByText('Download all')).toBeInTheDocument();
  });
  it('render Export Progress that has only 1 item', async () => {
    const { getByText } = render(
      renderDownloadButton(mockFormattedExportHistoryData[1] as IExportProgressItems, jest.fn())
    );
    expect(getByText('Download all')).toBeInTheDocument();
  });
});
