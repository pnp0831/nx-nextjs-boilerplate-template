import './view-detail-log-time-modal.scss';

import { deleteUserTimeLog } from '@esp/apis/time-management';
import { useGetTimePolicies } from '@esp/app/(protected-page)/(time-management)/administrative-tools/(main-components)/time-policy/time-policy.helper';
import { SkeletonLoading } from '@esp/components/timesheet-calendar/components';
import useAuth from '@esp/hooks/useAuth';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ESPButton } from '@ui-kit/components/button';
import { ESPModal } from '@ui-kit/components/modal';
import { ESPTable } from '@ui-kit/components/table';
import { ESPTooltip } from '@ui-kit/components/tooltip';
import { ESPTypography } from '@ui-kit/components/typography';
import { useNotify } from '@ui-kit/contexts/notify-context';
import dayjs, { Dayjs } from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  convertNumberToDayjs,
  formatDateBasedOnStatementDate,
  formatHours,
  minutesToHours,
} from '../../../timesheet-helper';
import { IDataRowViewDetail, IDataViewDetail } from '../../../type';
import { TaskStatus } from './timesheet-calendar.status';

const ViewDetailLogTimeModal = memo(
  ({ dataSource, setDataSource, setOpenLogTimeModal, onSubmitCallback }: IDataViewDetail) => {
    const { data: policyTime } = useGetTimePolicies();
    const { notifySuccess, notifyError } = useNotify();

    const { user } = useAuth();
    const theme = useTheme();

    const statementDate = policyTime?.statementDate as number;

    const [deleteTimeLogId, setDeleteTimeLogId] = useState<string>('');
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const handleCloseViewModal = () => {
      setDataSource(null);
      setDeleteTimeLogId('');
    };

    const addNewTimeLog = () => {
      setOpenLogTimeModal({
        selectedTask: dataSource?.selectedTask,
        datePicker: dayjs(dataSource?.datePicker),
      });
      setDataSource(null);
      setDeleteTimeLogId('');
    };

    useEffect(() => {
      if (dataSource?.data?.length === 0) {
        setDataSource(null);
      }
    }, [dataSource?.data]);

    const editTimeLog = (row: IDataRowViewDetail) => {
      setOpenLogTimeModal({
        selectedTask: dataSource?.selectedTask,
        datePicker: dayjs(dataSource?.datePicker),
        duration: convertNumberToDayjs(row.duration),
        description: row.description,
        id: row.id,
      });

      setDataSource(null);
      setDeleteTimeLogId('');
    };

    const handleDeleteAction = async (id: string) => {
      try {
        setIsDeleteLoading(true);
        await deleteUserTimeLog(id as string, user?.employeeId as string, user?.id as string);

        notifySuccess('Successfully deleted');

        const params = {
          id: id as string,
        };

        if (onSubmitCallback) {
          onSubmitCallback(params, 'delete');
        }

        setDeleteTimeLogId('');
        setDataSource({
          data: dataSource?.data?.filter((i) => i.id !== id),
          selectedTask: dataSource?.selectedTask,
        });
      } catch (err) {
        notifyError(err);
      } finally {
        setIsDeleteLoading(false);
      }
    };

    const renderDeleteConfirmation = (id: string) => {
      return (
        <Box className={'esp-view-detail-delete-actions'}>
          <ESPButton
            color="primary"
            loading={isDeleteLoading}
            onClick={() => {
              handleDeleteAction(id);
            }}
            className="esp-view-detail-delete-actions-confirm"
          >
            Yes
          </ESPButton>
          <ESPButton color="secondary" onClick={() => setDeleteTimeLogId('')}>
            No
          </ESPButton>
        </Box>
      );
    };

    const renderEditDeleteActions = (row: IDataRowViewDetail) => {
      return (
        <>
          <Box>
            <ESPButton
              className="esp-view-detail-actions-icon"
              startIcon={<EditIcon className="esp-view-detail-actions-icon-edit" />}
              sx={{
                marginRight: '1.2rem',
              }}
              onClick={() => {
                editTimeLog(row);
              }}
            />
          </Box>
          <Box>
            <ESPButton
              className="esp-view-detail-actions-icon"
              startIcon={<DeleteForeverIcon className="esp-view-detail-actions-icon-delete" />}
              onClick={() => {
                setDeleteTimeLogId(row.id);
              }}
            />
          </Box>
        </>
      );
    };

    const hiddenBasedOnStatementDate = useCallback(
      (statementDate: Dayjs, currentDateInCalendar: Dayjs) => {
        const defaultTime = dayjs().startOf('day');

        const isSameMonth = currentDateInCalendar.isSame(statementDate, 'month');
        const currentMonthIsAfterStatement = currentDateInCalendar.isAfter(statementDate, 'month');

        if (currentMonthIsAfterStatement) {
          return false;
        }

        if (statementDate.isAfter(defaultTime, 'day') && isSameMonth) {
          return false;
        }

        return statementDate.add(1, 'day').isAfter(currentDateInCalendar, 'day');
      },
      []
    );

    const columnsViewDetail = useMemo(() => {
      return [
        {
          id: 'description',
          label: 'Description',
          minWidth: 200,
          sortable: true,
          render: (row: IDataRowViewDetail) => {
            if (deleteTimeLogId === row.id) {
              return (
                <ESPTypography variant="regular_m" color={theme.palette.error.main}>
                  Are you sure to delete this time log?
                </ESPTypography>
              );
            }

            if (row.description) {
              return (
                <ESPTooltip
                  className="esp-view-detail-description-tooltip"
                  title={row.description}
                  placement="bottom"
                  textAlign="left"
                >
                  <ESPTypography className="esp-view-detail-description-text" variant="regular_m">
                    {row.description}
                  </ESPTypography>
                </ESPTooltip>
              );
            }

            return <ESPTypography variant="regular_m">No given description</ESPTypography>;
          },
        },
        {
          id: 'duration',
          className: 'esp-view-detail-duration-header',
          label: 'Duration',
          minWidth: 20,
          render: (row: IDataRowViewDetail) => {
            return (
              deleteTimeLogId !== row.id && (
                <ESPTypography variant="regular_m" textAlign={'center'}>
                  {formatHours(minutesToHours(row.duration as number))}
                </ESPTypography>
              )
            );
          },
        },
        {
          id: '',
          className: 'esp-view-detail-description-header',
          hidden: hiddenBasedOnStatementDate(
            dayjs(formatDateBasedOnStatementDate(statementDate as number)),
            dayjs(dataSource?.datePicker)
          ),
          label: (
            <ESPButton
              className="esp-view-detail-columns-header-button"
              startIcon={<AddIcon />}
              color="secondary"
              onClick={() => {
                addNewTimeLog();
              }}
            >
              Add New
            </ESPButton>
          ),
          minWidth: 20,
          render: (row: IDataRowViewDetail) => {
            return (
              <Box className={'esp-view-detail-actions'}>
                {deleteTimeLogId === row.id
                  ? renderDeleteConfirmation(row.id)
                  : renderEditDeleteActions(row)}
              </Box>
            );
          },
        },
      ];
    }, [deleteTimeLogId, dataSource?.data, renderDeleteConfirmation, renderEditDeleteActions]);

    return (
      <ESPModal
        open={!!dataSource}
        title="View Detail"
        onClose={() => handleCloseViewModal()}
        className="esp-view-detail-modal"
      >
        <Box>
          <Box display="flex" alignItems="center" marginBottom={2.5}>
            <TaskStatus status={dataSource?.selectedTask?.status as number} />
            <SkeletonLoading loading={!dataSource?.selectedTask?.taskCode}>
              <ESPTypography variant="bold_m" sx={{ marginRight: '0.25rem' }}>
                {`[${dataSource?.selectedTask?.taskCode}]`}
              </ESPTypography>
              <ESPTypography variant="bold_m" sx={{ marginRight: '0.25rem' }}>
                {`-`}
              </ESPTypography>
            </SkeletonLoading>

            <ESPTypography variant="regular_m"> {dataSource?.selectedTask?.taskName}</ESPTypography>
          </Box>
          <Box>
            <ESPTable
              className="esp-view-detail-table"
              data={dataSource?.data || []}
              columns={columnsViewDetail}
              showPageSize={false}
              showPagination={false}
              minHeight={250}
            />
          </Box>
        </Box>
      </ESPModal>
    );
  }
);

ViewDetailLogTimeModal.displayName = 'ViewDetailLogTimeModal';

export default ViewDetailLogTimeModal;
