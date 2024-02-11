import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockTimePolicyData } from '@esp/__mocks__/data-mock';
import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { useForm } from 'react-hook-form';

import TimePolicy from '.';

jest.mock('@tanstack/react-query', () => {
  const originalModule = jest.requireActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: () => ({
      isLoading: false,
      error: {},
      data: {
        data: mockTimePolicyData,
      },
    }),
  };
});

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  getValues: () => {
    return [];
  },
}));

describe('Time Policy', () => {
  it('should render content successfully', () => {
    const { baseElement } = render(
      <ContextNeededWrapper>
        <TimePolicy />
      </ContextNeededWrapper>
    );
    expect(baseElement).not.toBeNull();
  });

  it('should trigger button Reset successfully', () => {
    const { result } = renderHook(() => useForm());

    const { getByRole } = render(
      <ContextNeededWrapper>
        <TimePolicy />
      </ContextNeededWrapper>
    );

    const resetButton = getByRole('button', { name: 'Reset' });
    act(() => {
      fireEvent.click(resetButton);

      expect(
        result.current.setValue('minimumDurationPerLog', mockTimePolicyData.minimumDurationPerLog)
      );
    });
  });

  it('should trigger button Submit successfully', async () => {
    const { getByRole } = render(
      <ContextNeededWrapper>
        <TimePolicy />
      </ContextNeededWrapper>
    );

    await act(async () => {
      const resetButton = getByRole('button', { name: 'Save' });
      await fireEvent.submit(resetButton);
    });
  });
});
