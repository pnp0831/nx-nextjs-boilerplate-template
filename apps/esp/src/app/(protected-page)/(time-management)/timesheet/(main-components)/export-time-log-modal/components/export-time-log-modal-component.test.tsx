import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockCommonUser } from '@esp/__mocks__/data-mock';
import { fireEvent, render, renderHook } from '@testing-library/react';
import { theme } from '@ui-kit/theme';
import { useForm } from 'react-hook-form';

import { ExportTimeLogDetailModal } from './export-time-log-detail-modal.component';
import { ExportTimeLogPendingModal } from './export-time-log-pending-modal.component';

describe('ExportTimeLogPendingModal component', () => {
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

  jest.mock('@esp/components/organizations-select/organizations-select.helper', () => ({
    useGetUnits: jest.fn(),
  }));

  it('should trigger onClick ExportTimeLogProgressModal', () => {
    const mockOnCloseModal = jest.fn();

    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogPendingModal onClose={mockOnCloseModal} />
      </ContextNeededWrapper>
    );

    const confirmButton = getByText('OK');
    fireEvent.click(confirmButton);

    expect(mockOnCloseModal).toHaveBeenCalledTimes(1);
  });
});

describe('ExportTimeLogDetailModal component', () => {
  it('should trigger onChange period in ExportTimeLogDetailModal', () => {
    const mockOnCloseModal = jest.fn();
    const mockResetModal = jest.fn();
    const mockHandleCheckboxChange = jest.fn();
    const { result } = renderHook(() => useForm());
    const mockControl = result.current.control;
    const mockGetValues = jest.fn();
    const { getByText } = render(
      <ContextNeededWrapper>
        <ExportTimeLogDetailModal
          onCloseModal={mockOnCloseModal}
          resetModal={mockResetModal}
          handleCheckbox={mockHandleCheckboxChange}
          theme={theme}
          control={mockControl}
          getValues={mockGetValues}
        />
      </ContextNeededWrapper>
    );
    const getOptionByLabel = getByText('Current year');
    fireEvent.click(getOptionByLabel);
    expect(mockHandleCheckboxChange).toHaveBeenCalledTimes(1);
  });
});
