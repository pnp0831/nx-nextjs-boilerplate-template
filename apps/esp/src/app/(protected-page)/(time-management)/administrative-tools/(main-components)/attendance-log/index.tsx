'use client';

import { IDataAttendanceLog } from '@esp/apis/time-management';
import { useGetUnits } from '@esp/components/organizations-select/organizations-select.helper';
import { Column, ESPTable } from '@ui-kit/components/table';
import { IExtendParams, ILoadOptions } from '@ui-kit/components/table/type';
import dayjs from 'dayjs';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';

import AttendanceLogAction from './attendance-log.action';
import { useGetAttendanceLogs } from './attendance-log.helper';
import { AttendanceFilterFormData } from './attendance-log.type';

const tableName = 'attendance-log-table';

const format = 'HH:mm';

const AttendanceLog = memo(() => {
  const [loadOptions, setLoadOptions] = useState<ILoadOptions & AttendanceFilterFormData>({});

  const { data, loading } = useGetAttendanceLogs({
    tableName,
    loadOptions,
  });

  const tableFuncRef = useRef<{ resetPage?: () => void }>({});

  const onLoadOptionsChange = useCallback(
    (newLoadOptions: ILoadOptions, extendParams?: IExtendParams) => {
      setLoadOptions((loadOption) => {
        return {
          ...loadOption,
          ...newLoadOptions,
          ...extendParams,
        };
      });
    },
    []
  );

  const resetPageOptions = useCallback(() => {
    if (typeof tableFuncRef?.current?.resetPage === 'function') {
      tableFuncRef.current.resetPage();
    }
  }, []);

  const { employees } = useGetUnits();

  const tableColumns: Column<IDataAttendanceLog>[] = useMemo(() => {
    return [
      {
        id: 'shiftId',
        label: 'Shift Id',
        resizable: true,
        sortable: true,
        minWidth: 150,
      },
      {
        id: 'shiftName',
        label: 'Name',
        resizable: true,
        sortable: true,
        render: (row) => {
          return employees[row.employeeId]?.name;
        },
        minWidth: 300,
      },
      {
        id: 'workingStartDate',
        label: 'Date',
        resizable: true,
        sortable: true,
        render: (row) => {
          return row.workingStartTime ? dayjs(row.workingStartTime).format('DD/MMM/YYYY') : null;
        },
        sortingId: 'workingStartTime',
      },
      {
        id: 'workingStartTime',
        label: 'Shift Start',
        resizable: true,
        render: (row) => {
          return row.workingStartTime ? dayjs(row.workingStartTime).format(format) : null;
        },
        minWidth: 150,
        sortable: true,
      },
      {
        id: 'workingEndTime',
        label: 'Shift End',
        resizable: true,
        render: (row) => {
          return row.workingEndTime ? dayjs(row.workingEndTime).format(format) : null;
        },
        minWidth: 150,
        sortable: true,
      },
      {
        id: 'firstCheckIn',
        label: 'Check In',
        resizable: true,
        render: (row) => {
          return row.firstCheckIn ? dayjs(row.firstCheckIn).format(format) : null;
        },
        minWidth: 150,
        sortable: true,
      },
      {
        id: 'lastCheckOut',
        label: 'Check Out',
        resizable: true,
        render: (row) => {
          return row.lastCheckOut ? dayjs(row.lastCheckOut).format(format) : null;
        },
        minWidth: 150,
        sortable: true,
      },
      {
        id: 'lateIn',
        label: 'Late In',
        resizable: true,
        minWidth: 150,
        render: (row) => `${row.lateIn} min(s)`,
        sortable: true,
      },
      {
        id: 'earlyOut',
        label: 'Early Out',
        resizable: true,
        minWidth: 150,
        render: (row) => `${row.earlyOut} min(s)`,
        sortable: true,
      },
      {
        id: 'leaveHours',
        label: 'Leave Hours',
        resizable: true,
        minWidth: 150,
        render: (row) => `${row.leaveHours || 0} hour(s)`,
        sortable: true,
      },
      {
        id: 'remark',
        label: 'Remark',
        resizable: true,
        minWidth: 250,
        sortable: true,
      },
    ];
  }, [employees]);

  return (
    <>
      <ESPTable
        topPosition={{
          direction: 'left',
          action: (
            <AttendanceLogAction
              onLoadOptionsChange={onLoadOptionsChange}
              resetPageOptions={resetPageOptions}
              isFilterDataEmptied={!data?.data.length}
            />
          ),
        }}
        tableName={tableName}
        columns={tableColumns}
        totalItems={data?.totalCount as number}
        data={data?.data || []}
        onLoadOptionsChange={onLoadOptionsChange}
        defaultPageSize={10}
        pageSizeOptions={[10, 20, 25, 50]}
        defaultSort={{
          field: 'shiftId',
          order: 'asc',
        }}
        loading={loading}
        funcRef={tableFuncRef}
      />
    </>
  );
});

AttendanceLog.displayName = 'AttendanceLog';

export default AttendanceLog;
