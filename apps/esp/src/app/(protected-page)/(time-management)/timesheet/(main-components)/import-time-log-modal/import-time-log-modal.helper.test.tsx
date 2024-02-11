import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockImportTemplateValidation } from '@esp/__mocks__/data-mock';
import { useQuery } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { useGetTimeLogTemplateValidation } from './import-time-log-modal.helper';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: jest.fn(),
  };
});

describe('useGetAttendanceLogs', () => {
  it('should fetch and format data correctly', async () => {
    // Mock the useQuery hook
    (useQuery as jest.Mock).mockReturnValue(mockImportTemplateValidation);

    const { result } = renderHook(() => useGetTimeLogTemplateValidation(), {
      wrapper: ContextNeededWrapper,
    });

    const { data } = result.current;

    expect(data).not.toBeNull();
  });
});
