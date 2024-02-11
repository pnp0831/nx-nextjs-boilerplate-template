import ContextNeededWrapper from '@esp/__mocks__/context-needed-wrapper';
import { mockDataNotification } from '@esp/__mocks__/data-mock';
import * as NotificationService from '@esp/apis/notification';
import { act, fireEvent, render, waitFor } from '@testing-library/react';

import Notification, { triggerDownload } from '.';

jest.mock('@tanstack/react-query', () => {
  return {
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: () => ({
      isLoading: false,
      error: {},
      data: {
        data: mockDataNotification,
      },
    }),
  };
});

jest.mock('@esp/hooks/useAuth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({
      signIn: jest.fn(),
      signOut: jest.fn(),
      user: {
        id: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
        name: 'Mock User',
        role: 'Mock Role',
        perms: [],
        employeeId: '56afe61c-f0c0-de77-e3fa-c6083a4a6925',
      },
    })),
  };
});

describe('Notification', () => {
  it('Notification should render correctly', async () => {
    jest.spyOn(NotificationService, 'getNotificationUnmark').mockResolvedValueOnce({
      data: 2,
    });

    const { getByTestId, getByText } = await render(
      <ContextNeededWrapper>
        <Notification isUnitTesting />
      </ContextNeededWrapper>
    );

    await waitFor(() => expect(NotificationService.getNotificationUnmark).toHaveBeenCalled());

    const NotificationsIcon = getByTestId('NotificationsIcon');
    expect(NotificationsIcon).toBeInTheDocument();

    act(() => {
      fireEvent.click(NotificationsIcon);
    });

    const message = getByText(mockDataNotification[0].message);

    expect(message).toBeInTheDocument();

    fireEvent.click(message);

    act(() => {
      fireEvent.click(NotificationsIcon);
    });
  });

  it('should create a download link and trigger download', () => {
    // Define a URL to use for testing
    const testUrl = 'https://example.com/testfile.pdf';

    // Call the triggerDownload function
    triggerDownload(testUrl);
  });
});
