import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockCommonUser, mockOptionUnitsData } from '@esp/__mocks__/data-mock';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import useAuth from '@esp/hooks/useAuth';
import { fireEvent, render } from '@testing-library/react';

import AttendanceLogAction, { ButtonAction } from './attendance-log.action';

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: mockCommonUser,
    })),
  };
});

jest.mock('./attendance-log.helper');
jest.mock('@esp/components/organizations-select/organizations-select.helper', () => ({
  useGetUnits: jest.fn(),
  getEmployeeIds: jest.fn(),
}));
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
}));

describe('Attendance Log Action', () => {
  it('should render content successfully', async () => {
    const onLoadOptionsChangeMock = jest.fn();
    const resetPageOptionsMock = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({
      user: mockCommonUser,
    });

    (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });

    const { getByText } = await render(
      <AttendanceLogAction
        onLoadOptionsChange={onLoadOptionsChangeMock}
        resetPageOptions={resetPageOptionsMock}
      />,
      { wrapper: ContextNeededWrapper }
    );

    // expect(getByText('Period')).toBeInTheDocument();
    expect(getByText('For')).toBeInTheDocument();
    // expect(getByTestId('autocomplete-units')).toBeInTheDocument();
    // console.log(getByTestId('autocomplete-units'));

    // fireEvent.click(getByTestId('autocomplete-units'));
    // expect(getByText('Filter')).toBeInTheDocument();
    // expect(getByText('Export')).toBeInTheDocument();

    // fireEvent.click(getByText('Filter'));

    // expect(onLoadOptionsChangeMock).not.toBeCalled();

    // fireEvent.click(getByText('Export'));
  });

  //
  // it('should trigger onChange function in Units dropdown', async () => {
  //   const onLoadOptionsChangeMock = jest.fn();
  //   const resetPageOptionsMock = jest.fn();

  //   (useAuth as jest.Mock).mockReturnValue({
  //     user: mockCommonUser,
  //   });

  //   (useGetUnits as jest.Mock).mockReturnValue({ optionUnits: mockOptionUnitsData });
  //   const { getByRole, getByPlaceholderText } = await render(
  //     <AttendanceLogAction
  //       onLoadOptionsChange={onLoadOptionsChangeMock}
  //       resetPageOptions={resetPageOptionsMock}
  //     />,
  //     { wrapper: ContextNeededWrapper }
  //   );

  //   const unitsDropdown = getByPlaceholderText('Select teams or individual');
  //   fireEvent.change(unitsDropdown, { target: { value: 'qa' } });

  //   fireEvent.mouseDown(unitsDropdown);

  //   const option = getByRole('button', { name: 'QA Team' });
  //   fireEvent.click(option);

  //   expect(option).toBeInTheDocument();
  // });
});

describe('Button Action', () => {
  it('should render content successfully', async () => {
    const watch = jest.fn();
    const handleExport = jest.fn();
    const mockSetIsDirty = jest.fn();

    const { getByText } = await render(
      <ButtonAction setIsDirty={mockSetIsDirty} watch={watch} handleExport={handleExport} />,
      {
        wrapper: ContextNeededWrapper,
      }
    );

    expect(getByText('Filter')).toBeInTheDocument();
    expect(getByText('Export')).toBeInTheDocument();

    fireEvent.click(getByText('Export'));

    expect(handleExport).not.toBeCalled();
  });

  it('should render content successfully witch click export', async () => {
    const watch = jest.fn().mockReturnValue(['value1', 'value2']);
    const handleExport = jest.fn();
    const mockSetIsDirty = jest.fn();
    const mockDataFiltered = [
      {
        employeeId: '23d4deae-0eb5-4a2d-f3f8-46230fb80be1',
        workingStartTime: '2023-10-18T15:00:00+00:00',
        workingEndTime: '2023-10-18T00:00:00+00:00',
        firstCheckIn: '2023-10-18T09:36:25.328+00:00',
        lastCheckOut: '2023-10-18T22:36:48.809+00:00',
        lateIn: 15,
        earlyOut: 15,
        auditDay: 'a',
        lastAuditDay: 'b',
        lateInAllow: 15,
        earlyOutAllow: 15,
        shiftId: 'DS',
        shiftName: 'Day Shift',
        remark: 'Missing Attendance',
        leaveHours: 12,
        deleterUserId: 'test-user',
        deletionTime: 10,
        isDeleted: false,
        lastModificationTime: '2023-10-18T09:27:44.117+00:00',
        lastModifierUserId: 'b8541a07-3010-4dc1-2bd2-664a6f1aa622',
        creationTime: '2023-10-18T00:00:00+00:00',
        creatorUserId: 'b8541a07-3010-4dc1-2bd2-664a6f1aa622',
        id: 'cc38ad69-3ee4-371f-3fa2-4faec2028c7e',
      },
    ];

    const { getByText } = await render(
      <ButtonAction
        watch={watch}
        handleExport={handleExport}
        dataFiltered={mockDataFiltered}
        setIsDirty={mockSetIsDirty}
      />,
      {
        wrapper: ContextNeededWrapper,
      }
    );

    expect(getByText('Filter')).toBeInTheDocument();
    expect(getByText('Export')).toBeInTheDocument();

    fireEvent.click(getByText('Export'));

    expect(handleExport).toBeCalled();
  });
});
