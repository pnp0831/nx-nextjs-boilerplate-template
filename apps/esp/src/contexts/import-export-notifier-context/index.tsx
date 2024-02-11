'use client';

import { IDataProgressInformation } from '@esp/apis/progress-management';
import { getProgressInformation } from '@esp/apis/progress-management';
import ExportTimeLogModal from '@esp/app/(protected-page)/(time-management)/timesheet/(main-components)/export-time-log-modal';
import ImportModal from '@esp/app/(protected-page)/(time-management)/timesheet/(main-components)/import-time-log-modal';
import { IInitStateModal } from '@esp/app/(protected-page)/(time-management)/timesheet/(main-components)/import-time-log-modal/import-time-log-modal.type';
import CircleLoading from '@esp/components/circle-loading';
import { IOrganizationUnitOptions } from '@esp/components/organizations-select/organizations-select.type';
import useAuth from '@esp/hooks/useAuth';
import useLocalStorage from '@esp/hooks/useLocalStorage';
import { stringifyLoadOptions } from '@esp/utils/helper';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import { IconButton } from '@mui/material';
import { ESPBadge } from '@ui-kit/components/badge';
import { CondOperator } from '@ui-kit/components/table/type';
import loSet from 'lodash/set';
import React, {
  Fragment,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 as uuidv4 } from 'uuid';

const STEP_FLYING_DURATION = 1000;
const STEP_ZOOMOUT_DURATION = 800;

export enum LOADING_STATUS {
  'ERROR_LOADING' = 0,
  'SUCCESS_LOADING' = 1,
  'INPROCESS_LOADING' = 2,
  'NO_LOADING' = 3,
}

export enum FLOW_STATUS {
  'ERROR' = 0,
  'SUCCESS' = 1,
  'INPROCESS' = 2,
  'WARNING' = 3,
}

const getLoadingStatusByProgressStatus = (status: string) =>
  ({
    Error: LOADING_STATUS.ERROR_LOADING,
    Success: LOADING_STATUS.SUCCESS_LOADING,
    'In Progress': LOADING_STATUS.INPROCESS_LOADING,
  }[status] ?? LOADING_STATUS.NO_LOADING);

type ImportExportNotifierContextProviderProps = {
  children: ReactNode;
  mockWorker?: Worker;
};

interface IImportExportNotifierContext {
  setTargetIcon: (target: HTMLElement) => void;

  openModalByType: (type: ModalType, formData?: IFormDataInLocalStorage) => void;
  removeModalById: (modalId: string) => void;

  updateDataModalById: (modalId: string, data: Partial<IDataModal>) => void;
  updateDataByProgressId: (progressId: string, status: LOADING_STATUS) => void;

  shouldDisplayLoadingIcon: () => boolean;
  getIconStatus: () => LOADING_STATUS;
  countBadgeInProcess: () => number;
  dataModal: IStateDataModal;
}

export interface IFormDataInLocalStorage extends Partial<IInitStateModal> {
  // for export
  employeeIds: IOrganizationUnitOptions[];
  startDate: string;
  endDate: string;
}

export enum ModalType {
  TIME_LOG_IMPORT = 'Time Log Import',
  TIME_LOG_EXPORT = 'Time Log Export',
  ATTENDANCE_LOG_EXPORT = 'Attendance Log Export',
}

export interface TExportInfoProgressIds {
  [progressId: string]: LOADING_STATUS;
}

export interface IDataModal {
  // Common
  status?: LOADING_STATUS;
  modalId: string;
  open: boolean;
  type: ModalType;
  fileSize?: number;
  fileName?: string;

  // In case import, take progressId from API
  // In case export, take the last progressId from API
  progressId?: string;

  showPortal?: boolean;
  closeAnimation?: string; // close animation className
  animated?: boolean;

  // Import
  flowStatus?: FLOW_STATUS;
  isInterrupted?: boolean;

  // Export
  progressIds?: string[]; // Store all progressIds to check WS postMessage
  infoProgressIds?: TExportInfoProgressIds; // Store all progressIds to check WS postMessage
  isModalInProgress?: boolean;
  formData?: Partial<IFormDataInLocalStorage>;
}

export interface IStateDataModal {
  [modalId: string]: IDataModal;
}

const ImportExportNotifierContext = React.createContext<IImportExportNotifierContext>({
  setTargetIcon: (target: HTMLElement) => {},

  openModalByType: (type: ModalType, formData?: IFormDataInLocalStorage) => {},
  removeModalById: (modalId: string) => {},
  updateDataModalById: (modalId: string, data: Partial<IDataModal>, useOldStatus = false) => {},
  updateDataByProgressId: (progressId: string, status: LOADING_STATUS) => {},

  shouldDisplayLoadingIcon: () => true,
  getIconStatus: () => LOADING_STATUS.INPROCESS_LOADING,
  countBadgeInProcess: () => 0,
  dataModal: {},
});

export const useImportExportNotifier = () => useContext(ImportExportNotifierContext);

export const ImportExportNotifierContextProvider = ({
  children,
  mockWorker,
}: ImportExportNotifierContextProviderProps) => {
  const { user } = useAuth();

  // Why use refWSMessage, bc sometime WS return message before API successfully, so store the messages from WS to ref,
  // and when API successfully we checking this value

  const refWSMessage = useRef<{
    [progressId: string]: { status: LOADING_STATUS; progressId: string };
  }>({});

  // Why use refDataModal, bc we dont want display import export notifer icon during effect running
  // and when the effect running, cal the remaining time of the effect to display the icon

  const refDataModal = useRef<{
    [modalId: string]: {
      status?: LOADING_STATUS;
      animated?: boolean;
    };
  }>({});

  const refTargetIcon = useRef<HTMLElement | null>();

  const localStorageKey = useMemo(
    () => (user?.id ? `dataModal-${user?.id}` : null),
    [user?.id]
  ) as string;

  const [dataModalFromLS, storeDataModalToLS] = useLocalStorage<IStateDataModal>(
    localStorageKey,
    {}
  );

  const syncStatusWhenReload = async (dataModal: IStateDataModal) => {
    const ids = Object.values(dataModalFromLS)
      .filter(
        (i) =>
          i.progressId &&
          (i.status === LOADING_STATUS.INPROCESS_LOADING || i.status === LOADING_STATUS.NO_LOADING)
      )
      .map((item) => (!item.progressIds?.length ? item.progressId : item.progressIds))
      .flat(2);

    const idsLength = ids.length;

    if (ids.length) {
      const params = stringifyLoadOptions({
        filter: ids.flatMap((id, index) => {
          const baseCondition = ['id', CondOperator.CONTAINS, id];

          return index === ids.length - 1 ? [baseCondition] : [baseCondition, CondOperator.OR];
        }),

        skip: 0,
        take: idsLength,
      });

      try {
        const { data } = await getProgressInformation(params);
        (data.data as IDataProgressInformation[])?.forEach(({ id, status, fileName }) => {
          updateDataByProgressId(id, getLoadingStatusByProgressStatus(status), fileName);
        });
      } catch {
        //
      }
    }
  };

  const [dataModal, setDataModal] = useState<IStateDataModal>(() => {
    const tmpDataModal = { ...dataModalFromLS };

    Object.values(tmpDataModal).forEach(({ open, modalId, progressId, status }) => {
      tmpDataModal[modalId].open = false;
      // when reload, all modal should disable animation
      tmpDataModal[modalId].animated = true;

      if (typeof status === 'undefined') {
        delete tmpDataModal[modalId];
      }
    });

    syncStatusWhenReload(tmpDataModal);

    return tmpDataModal;
  });

  const openModalByType = useCallback((type: ModalType, formData?: IFormDataInLocalStorage) => {
    const modalId = uuidv4();
    refDataModal.current[modalId] = {};

    setDataModal((oldDataModal) => ({
      ...oldDataModal,
      [modalId]: {
        modalId,
        type,
        open: true,
        formData,
      },
    }));
  }, []);

  // Close modal, but keep state
  const closeModalById = useCallback((modalId: string, fileName?: string) => {
    setDataModal((oldDataModal = {}) => ({
      ...oldDataModal,
      [modalId]: {
        ...(oldDataModal[modalId] || {}),
        open: false,
        fileName: fileName || oldDataModal[modalId]?.fileName,
      },
    }));
  }, []);

  // Close modal and remove state
  const removeModalById = useCallback((modalId: string) => {
    setDataModal((oldDataModal) => {
      const tmpDataModal = { ...oldDataModal };
      delete tmpDataModal[modalId];
      delete refDataModal.current[modalId];
      return tmpDataModal;
    });

    delete refDataModal.current[modalId];
  }, []);

  // Update
  const updateDataModalById = useCallback((modalId: string, data: Partial<IDataModal>) => {
    setDataModal((oldDataModal = {}) => {
      return {
        ...oldDataModal,
        [modalId]: {
          ...(oldDataModal[modalId] || {}),
          ...data,
          modalId,
        },
      };
    });
  }, []);

  // For flying to target icon
  const setTargetIcon = useCallback((target: HTMLElement) => {
    refTargetIcon.current = target;
  }, []);

  const countBadgeInProcess = useCallback((): number => {
    let countBadge = 0;

    for (const modalId in dataModal) {
      if (dataModal[modalId].status === LOADING_STATUS.INPROCESS_LOADING) {
        countBadge++;
      }
    }

    return countBadge;
  }, [dataModal]);

  const shouldDisplayLoadingIcon = useCallback(() => {
    return Object.values(dataModal).some(
      ({ status }) => typeof status !== 'undefined' && status !== LOADING_STATUS.NO_LOADING
    );
  }, [dataModal]);

  const getIconStatus = useCallback((): LOADING_STATUS => {
    let countError = 0;
    let countInProcess = 0;

    for (const modalId in dataModal) {
      if (dataModal[modalId].status === LOADING_STATUS.ERROR_LOADING) {
        countError++;
        break;
      }

      if (dataModal[modalId].status === LOADING_STATUS.INPROCESS_LOADING) {
        countInProcess++;
        break;
      }
    }

    if (countError > 0) return LOADING_STATUS.ERROR_LOADING;
    if (countInProcess > 0) return LOADING_STATUS.INPROCESS_LOADING;

    return LOADING_STATUS.SUCCESS_LOADING;
  }, [dataModal]);

  // Handle store dataModal to local storage, and keep state
  useEffect(() => {
    storeDataModalToLS(dataModal);
  }, [dataModal, storeDataModalToLS]);

  // Step: 1
  // Call Import/Export API successfully -> use this function to store progressId into dataModal
  // and then, when WS returns data with progressId, we will know which modal it is in.
  const addProgressIdByModalId = useCallback(
    (progressId: string, status: LOADING_STATUS, modalId: string) => {
      return setDataModal((oldDataModal) => ({
        ...oldDataModal,
        [modalId]: {
          ...(oldDataModal[modalId] || {}),
          status,
          progressId,
        },
      }));
    },
    []
  );
  // Step: 2
  // WS return the messages, store proressId to dataModal
  const updateDataByProgressId = useCallback(
    async (
      progressId: string,
      status: LOADING_STATUS,
      fileName?: string,
      formData?: IFormDataInLocalStorage
    ) => {
      refWSMessage.current[progressId] = { status, progressId };

      return setDataModal((dataModal) => {
        let foundModalId;
        for (const modalId in dataModal) {
          if (dataModal[modalId].progressId === progressId) {
            foundModalId = dataModal[modalId].modalId;
            break;
          }

          if (dataModal[modalId].progressIds?.includes(progressId)) {
            foundModalId = dataModal[modalId].modalId;
            break;
          }
        }

        if (foundModalId) {
          // for case export multiple files
          if (dataModal[foundModalId].type === ModalType.TIME_LOG_EXPORT) {
            loSet(dataModal, [foundModalId, 'infoProgressIds', progressId], status);

            status = LOADING_STATUS.INPROCESS_LOADING;

            if (
              Object.values(dataModal[foundModalId].infoProgressIds || {}).includes(
                LOADING_STATUS.ERROR_LOADING
              )
            ) {
              status = LOADING_STATUS.ERROR_LOADING;
            }

            if (
              Object.values(dataModal[foundModalId].infoProgressIds || {}).every(
                (status) => status === LOADING_STATUS.SUCCESS_LOADING
              )
            ) {
              status = LOADING_STATUS.SUCCESS_LOADING;
            }
          }

          if (refDataModal.current[foundModalId]) {
            refDataModal.current[foundModalId].status = status;
          }

          // Update component state as before
          const updatedDataModal = {
            ...dataModal,
            [foundModalId]: {
              ...dataModal[foundModalId],
              status,
              fileName: fileName !== undefined ? fileName : dataModal[foundModalId].fileName,
              formData: formData !== undefined ? formData : dataModal[foundModalId].formData,
            },
          };

          return updatedDataModal;
        }

        return dataModal;
      });
    },
    []
  );

  // // When close the modal, create animation
  const createModalAnimate = useCallback(
    async (modalId: string, fileName?: string) => {
      const restFileName = fileName ? { fileName } : {};

      // Step 1: Add className to modal, to create zoomout effect
      updateDataModalById(modalId, {
        closeAnimation: 'esp-close-modal-animation',
        ...restFileName,
      });

      // Wait for animation completed
      await new Promise((resolve) => setTimeout(resolve, STEP_ZOOMOUT_DURATION));

      // Step 2: Create a icon portal to fly to target icon, hide modal
      updateDataModalById(modalId, {
        ...restFileName,
        showPortal: true,
        closeAnimation: 'esp-close-modal-animation esp-close-modal-animation-opacity0',
      });

      await new Promise((resolve) => setTimeout(resolve, STEP_FLYING_DURATION));

      const objUpdateStatus =
        typeof refDataModal.current[modalId]?.status !== 'undefined'
          ? { status: refDataModal.current[modalId].status }
          : { status: LOADING_STATUS.INPROCESS_LOADING };

      // Step 3: Animation completed, close the modal, and set latest status
      updateDataModalById(modalId, {
        open: false,
        showPortal: false,
        animated: true,
        ...restFileName,
        ...objUpdateStatus,
      });

      // Step 4: Reset state modal after animation completed
      setTimeout(() => {
        updateDataModalById(modalId, {
          closeAnimation: '',
          ...restFileName,
        });
      }, 200);

      refDataModal.current[modalId].animated = true;
    },
    [updateDataModalById]
  );

  // // When the icon flying, this function use to decide when to display the icon import export notifier
  const createErrorAnimate = useCallback(
    async (modalId: string) => {
      if (!refDataModal.current[modalId]?.animated) {
        return (refDataModal.current[modalId] = {
          status: LOADING_STATUS.ERROR_LOADING,
        });
      }

      return updateDataModalById(modalId, {
        status: LOADING_STATUS.ERROR_LOADING,
      });
    },
    [updateDataModalById]
  );

  const resetModal = useCallback((defaultState: { modalId: string; type: ModalType }) => {
    const { modalId, type } = defaultState;
    refDataModal.current[modalId] = {};

    setDataModal((oldDataModal) => {
      return {
        ...oldDataModal,
        [modalId]: {
          type,
          open: true,
          modalId,
          closeAnimation: '',
          animated: false,
          status: LOADING_STATUS.NO_LOADING,
        },
      };
    });
  }, []);

  const onUpdateFormState = useCallback(
    (modalId: string, formState: Partial<IFormDataInLocalStorage>) => {
      setDataModal((oldDataModal) => {
        return {
          ...oldDataModal,
          [modalId]: {
            ...(oldDataModal[modalId] || {}),
            formData: {
              ...(oldDataModal[modalId].formData || {}),
              ...formState,
            },
          },
        };
      });
    },
    []
  );

  return (
    <ImportExportNotifierContext.Provider
      value={{
        updateDataByProgressId,
        dataModal,

        removeModalById,

        updateDataModalById,

        shouldDisplayLoadingIcon,
        getIconStatus,
        countBadgeInProcess,
        setTargetIcon,

        openModalByType,
      }}
    >
      {children}

      {Object.entries(dataModal || {}).map(
        ([
          _,
          {
            open,
            type,
            modalId,
            closeAnimation,
            formData,
            showPortal,
            animated,
            status,
            isInterrupted,
            isModalInProgress,
          },
        ]) => {
          const portalElement =
            showPortal && refTargetIcon.current ? (
              <FlyingIcon icon={refTargetIcon.current} />
            ) : null;

          if (type === ModalType.TIME_LOG_IMPORT) {
            return (
              <Fragment key={modalId}>
                <ImportModal
                  open={open}
                  title="Import Time Log"
                  downloadTemplateUrl="/files/ImportTimelogTemplate.xlsx"
                  className={closeAnimation}
                  onResubmit={() => {
                    resetModal({ modalId, type });
                  }}
                  onError={(isWarningFlow?: boolean) => {
                    if (isWarningFlow) {
                      updateDataModalById(modalId, {
                        flowStatus: FLOW_STATUS.WARNING,
                      });
                    }

                    return createErrorAnimate(modalId);
                  }}
                  onClose={(isRemove?: boolean, fileName?: string) => {
                    if (isRemove) {
                      return removeModalById(modalId);
                    }
                    if (!animated && !refDataModal.current[modalId]?.animated) {
                      return createModalAnimate(modalId, fileName);
                    }
                    return closeModalById(modalId);
                  }}
                  onSuccess={(progressId: string, fileName: string) => {
                    updateDataModalById(modalId, {
                      fileName,
                    });

                    let status = LOADING_STATUS.INPROCESS_LOADING;

                    if (
                      typeof refWSMessage.current[progressId]?.status !== 'undefined' &&
                      refWSMessage.current[progressId]?.progressId === progressId
                    ) {
                      status = refWSMessage.current[progressId].status;
                    }

                    addProgressIdByModalId(progressId, status, modalId);
                  }}
                  onReceiveFileSize={(fileSize: number) =>
                    updateDataModalById(modalId, {
                      fileSize,
                    })
                  }
                  initState={formData as IInitStateModal}
                  mockWorker={mockWorker}
                  status={status}
                  isInterrupted={isInterrupted}
                  onInterrupted={(initState) => {
                    const formData = { ...initState } as Partial<IFormDataInLocalStorage>;
                    setDataModal((oldDataModal) => {
                      const dataModal = {
                        ...oldDataModal,
                        [modalId]: {
                          ...(oldDataModal[modalId] || {}),
                          isInterrupted: true,
                          modalId,
                          formData,
                          status: LOADING_STATUS.ERROR_LOADING,
                          flowStatus: FLOW_STATUS.WARNING,
                          animated: true,
                          closeAnimation: '',
                          showPortal: false,
                        },
                      };

                      storeDataModalToLS(dataModal);

                      return dataModal;
                    });
                  }}
                  onUpdateState={(formState) => {
                    onUpdateFormState(modalId, formState as Partial<IFormDataInLocalStorage>);
                  }}
                />
                {portalElement}
              </Fragment>
            );
          }

          if (type === ModalType.TIME_LOG_EXPORT) {
            return (
              <Fragment key={modalId}>
                <ExportTimeLogModal
                  id={modalId}
                  open={open}
                  title="Export Time Log"
                  className={closeAnimation}
                  formData={formData as IFormDataInLocalStorage}
                  onError={() => {
                    return createErrorAnimate(modalId);
                  }}
                  onClose={(isRemove?: boolean, fileName?: string) => {
                    if (isRemove) {
                      return removeModalById(modalId);
                    }

                    if (!animated && !refDataModal.current[modalId]?.animated) {
                      return createModalAnimate(modalId, fileName);
                    }

                    return closeModalById(modalId, fileName);
                  }}
                  isModalInProgress={isModalInProgress}
                  onSuccess={(progressId: string, progressIds: string[], fileName: string) => {
                    const infoProgressIds = progressIds.reduce(
                      (acc, progressId) => ({ ...acc, [progressId]: LOADING_STATUS.NO_LOADING }),
                      {}
                    );

                    updateDataModalById(modalId, {
                      infoProgressIds,
                      progressIds,
                      fileName,
                      progressId,
                      isModalInProgress: true,
                      status: LOADING_STATUS.NO_LOADING,
                    });
                  }}
                />
                {portalElement}
              </Fragment>
            );
          }

          return null;
        }
      )}
    </ImportExportNotifierContext.Provider>
  );
};

const FlyingIcon = memo(
  ({
    className = 'flying-icon',
    speed = STEP_FLYING_DURATION,
    icon,
  }: {
    className?: string;
    speed?: number;
    icon: HTMLElement;
  }) => {
    return (
      <div
        className={className}
        ref={(ref) => {
          if (ref) {
            const target = icon.getBoundingClientRect();

            ref.style.transition = `all ${speed}ms ease, transform ${speed}ms ease, top ${speed}ms ease, left ${speed}ms ease`;
            ref.style.transform = 'translate(-50%, -50%) scale(1)';
            ref.style.top = `${target?.top + target?.height - target?.height / 2}px`;
            ref.style.left = `${target?.left + target?.width - target?.width / 2}px`;
          }
        }}
      >
        <IconButton
          sx={{
            borderRadius: '50%',
            background: 'white',
            marginRight: '1rem',
            opacity: 1,
          }}
          size="small"
          className="import-export-notifier-icon"
        >
          <ESPBadge badgeContent={0}>
            <CircleLoading size="1.75rem" status={LOADING_STATUS.INPROCESS_LOADING} />
            <ImportExportIcon
              sx={{
                fontSize: '1.5rem',
                color: (theme) => theme.palette.black.main,
              }}
            />
          </ESPBadge>
        </IconButton>
      </div>
    );
  }
);

FlyingIcon.displayName = 'FlyingIcon';
