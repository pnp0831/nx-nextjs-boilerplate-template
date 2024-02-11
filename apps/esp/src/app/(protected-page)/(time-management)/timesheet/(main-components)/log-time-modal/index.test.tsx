import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockTasksListData, mockTimePolicyData } from '@esp/__mocks__/data-mock';
import { act, fireEvent, render, renderHook } from '@testing-library/react';
import { NotifyContextProvider } from '@ui-kit/contexts/notify-context';
import dayjs from 'dayjs';
import React from 'react';
import { useForm } from 'react-hook-form';

import { useGetTimePolicies } from '../../../administrative-tools/(main-components)/time-policy/time-policy.helper';
import { formatDateBasedOnStatementDate, useGetUserTasksList } from '../../timesheet-helper';
import LogTimeModal from '.';

const mockFetchedTaskList = [
  { taskName: 'demo1', taskCode: 'demo1-1', value: '1', label: 'demo1 - test1-1' },
  { taskName: 'demo2', taskCode: 'demo2-2', value: '2', label: 'demo2 - test2-2' },
];

const formDataWithTimePolicy = {
  datePicker: dayjs().startOf('day'),
  duration: dayjs().add(7, 'hour'),
  description: '',
  selectedTask: {
    label: 'a',
    value: '1',
    taskCode: '1',
    taskName: 'demo1',
  },
};

const formDataErrorTimePolicy = {
  datePicker: dayjs().startOf('day'),
  duration: dayjs().startOf('day'),
  description: '',
  selectedTask: {
    label: 'a',
    value: '1',
    taskCode: '1',
    taskName: 'demo1',
  },
};

jest.mock('../../../administrative-tools/(main-components)/time-policy/time-policy.helper', () => ({
  useGetTimePolicies: jest.fn(),
}));

jest.mock('../../timesheet-helper', () => {
  const originalModule = jest.requireActual('../../timesheet-helper');

  return {
    ...originalModule,
    useGetUserTasksList: jest.fn(),
    formatDateBasedOnStatementDate: jest.fn(),
  };
});

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  getValues: () => {
    return [];
  },
}));

describe('Modal Log Time', () => {
  (useGetTimePolicies as jest.Mock).mockReturnValue(mockTimePolicyData);
  (useGetUserTasksList as jest.Mock).mockReturnValue(mockTasksListData);
  (formatDateBasedOnStatementDate as jest.Mock).mockReturnValue(mockTimePolicyData.statementDate);
  beforeAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should close modal when clicking Cancel button', () => {
    const mockSetOpenModal = jest.fn();
    const mockOpenLogTimeModal = true;

    const { getByRole } = render(
      <ContextNeededWrapper>
        <LogTimeModal
          setOpenLogTimeModal={mockSetOpenModal}
          listOptions={mockFetchedTaskList}
          openLogTimeModal={mockOpenLogTimeModal}
        />
      </ContextNeededWrapper>
    );

    const cancelButton = getByRole('button', { name: 'Cancel' });
    fireEvent.click(cancelButton);

    expect(mockSetOpenModal).toBeCalledTimes(1);
  });

  it('should close modal when clicking X icon', () => {
    const mockSetOpenModal = jest.fn();
    const mockOpenLogTimeModal = true;

    const { getAllByTestId } = render(
      <ContextNeededWrapper>
        <LogTimeModal
          setOpenLogTimeModal={mockSetOpenModal}
          // listOptions={mockFetchedTaskList}
          openLogTimeModal={mockOpenLogTimeModal}
        />
      </ContextNeededWrapper>
    );

    const closeIcon = getAllByTestId('CloseIcon');
    fireEvent.click(closeIcon[0]);

    expect(mockSetOpenModal).toBeCalled();
  });

  it('should trigger toggle description', async () => {
    const mockOpenLogTimeModal = true;
    const mockSetOpenModal = jest.fn();

    const { getByTestId } = render(
      <ContextNeededWrapper>
        <LogTimeModal
          // listOptions={mockFetchedTaskList}
          openLogTimeModal={mockOpenLogTimeModal}
          setOpenLogTimeModal={mockSetOpenModal}
        />
      </ContextNeededWrapper>
    );

    const descriptionToggle = document.getElementsByClassName('MuiSwitch-input');
    fireEvent.click(descriptionToggle[0]);

    const descriptionTextarea = getByTestId('log-time-textarea');
    expect(descriptionTextarea).toBeInTheDocument();
  });

  it('should trigger checkbox Log another', async () => {
    const mockOpenLogTimeModal = true;
    const mockSetOpenModal = jest.fn();

    const { getByTestId, getByRole } = render(
      <ContextNeededWrapper>
        <LogTimeModal
          // listOptions={mockFetchedTaskList}
          openLogTimeModal={mockOpenLogTimeModal}
          setOpenLogTimeModal={mockSetOpenModal}
        />
      </ContextNeededWrapper>
    );

    const logAnotherButton = getByRole('checkbox', { name: 'Log another' });
    fireEvent.click(logAnotherButton);

    const checkedLogAnotherButton = getByTestId('CheckBoxIcon');
    expect(checkedLogAnotherButton).toBeInTheDocument();
  });

  it('should return defaultTask if modal is editted', async () => {
    const mockOpenLogTimeModal = true;
    const mockSetOpenModal = jest.fn();

    await act(async () => {
      await render(
        <ContextNeededWrapper>
          <LogTimeModal
            // listOptions={mockFetchedTaskList}
            openLogTimeModal={mockOpenLogTimeModal}
            setOpenLogTimeModal={mockSetOpenModal}
            isCreating={false}
            data={formDataWithTimePolicy}
          />
        </ContextNeededWrapper>
      );

      expect(formDataWithTimePolicy.selectedTask.value).toEqual(mockFetchedTaskList[0].value);
    });
  });

  it('should set error and return when time policy validation fails 1', async () => {
    const mockOpenLogTimeModal = true;
    const mockSetOpenModal = jest.fn();

    const { result } = renderHook(() => useForm());

    const { getByTestId, getByRole } = render(
      <ContextNeededWrapper>
        <NotifyContextProvider>
          <LogTimeModal
            // listOptions={mockFetchedTaskList}
            openLogTimeModal={mockOpenLogTimeModal}
            setOpenLogTimeModal={mockSetOpenModal}
            isCreating={false}
            data={formDataErrorTimePolicy}
          />
        </NotifyContextProvider>
      </ContextNeededWrapper>
    );

    const logAnotherButton = getByRole('checkbox', { name: 'Log another' });
    fireEvent.click(logAnotherButton);

    const submitButton = getByTestId('log-time-submit');
    fireEvent.click(submitButton);

    await act(async () => {
      await result.current.setValue('datePicker', formDataErrorTimePolicy.datePicker);
      await result.current.setValue('description', formDataErrorTimePolicy.description);
      await result.current.setValue('duration', formDataErrorTimePolicy.duration);
      await result.current.setValue('selectedTask', formDataErrorTimePolicy.selectedTask);
    });

    expect(
      result.current.setError('duration', {
        type: 'manual',
        message: 'Logged time must be greater than 5 minutes',
      })
    );
  }, 10000);

  it('should set error and return when time policy validation fails', async () => {
    const mockOpenLogTimeModal = true;
    const mockSetOpenModal = jest.fn();

    const { result } = renderHook(() => useForm());

    const { getByTestId, getByRole } = render(
      <ContextNeededWrapper>
        <LogTimeModal
          // listOptions={mockFetchedTaskList}
          openLogTimeModal={mockOpenLogTimeModal}
          setOpenLogTimeModal={mockSetOpenModal}
          isCreating={false}
          data={formDataWithTimePolicy}
        />
      </ContextNeededWrapper>
    );

    const logAnotherButton = getByRole('checkbox', { name: 'Log another' });
    fireEvent.click(logAnotherButton);

    const submitButton = getByTestId('log-time-submit');
    fireEvent.click(submitButton);

    await act(async () => {
      await result.current.setValue('datePicker', formDataWithTimePolicy.datePicker);
      await result.current.setValue('description', formDataWithTimePolicy.description);
      await result.current.setValue('duration', formDataWithTimePolicy.duration);
      await result.current.setValue('selectedTask', formDataWithTimePolicy.selectedTask);
    });
  }, 10000);

  it('should trigger focus on Autocomplete', async () => {
    const mockOpenLogTimeModal = true;
    const mockSetOpenModal = jest.fn();

    const useRefSpy = jest.spyOn(React, 'useRef');

    const { getByRole } = render(
      <ContextNeededWrapper>
        <LogTimeModal
          listOptions={mockFetchedTaskList}
          openLogTimeModal={mockOpenLogTimeModal}
          setOpenLogTimeModal={mockSetOpenModal}
        />
      </ContextNeededWrapper>
    );

    const autocompleteInput = getByRole('combobox', { name: '' });
    fireEvent.focus(autocompleteInput);
    fireEvent.mouseDown(autocompleteInput);

    expect(useRefSpy).toHaveBeenCalledWith(true);

    fireEvent.blur(autocompleteInput);
  });
});
