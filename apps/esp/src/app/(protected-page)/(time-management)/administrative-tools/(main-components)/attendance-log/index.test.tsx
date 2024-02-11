import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockGetProgressInformationData } from '@esp/__mocks__/data-mock';
import { act, render } from '@testing-library/react';

import { useGetAttendanceLogs } from './attendance-log.helper';
import AttendaceLog from './index';

// Mock the useGetAttendanceLogs hook
jest.mock('./attendance-log.helper', () => ({
  useGetAttendanceLogs: jest.fn(),
  useGetUnits: jest.fn().mockReturnValue({ optionUnits: [], employees: {} }),
  formatStartDate: jest.fn(),
  formatEndDate: jest.fn(),
  arrayValueUnits: jest.fn(),
}));

describe('AttendaceLog', () => {
  it('should render content successfully', async () => {
    await act(async () => {
      (useGetAttendanceLogs as jest.Mock).mockReturnValue({
        mockGetProgressInformationData,
        loading: false,
      });

      const { baseElement } = await render(
        <ContextNeededWrapper>
          <AttendaceLog />
        </ContextNeededWrapper>
      );

      expect(baseElement).not.toBeNull();
    });
  });

  it('should render content without some data successfully', async () => {
    await act(async () => {
      (useGetAttendanceLogs as jest.Mock).mockReturnValue({
        mockGetProgressInformationData,
        loading: false,
      });

      const { baseElement } = await render(
        <ContextNeededWrapper>
          <AttendaceLog />
        </ContextNeededWrapper>
      );

      expect(baseElement).not.toBeNull();
    });
  });
});
