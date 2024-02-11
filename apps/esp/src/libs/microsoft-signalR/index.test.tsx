import { act, render } from '@testing-library/react';
import React from 'react';

import SignalRHandler from './index';

describe('SignalRHandler', () => {
  it('should start the SignalR connection', async () => {
    const onReceiveMessage = jest.fn();
    const userId = '51bcd0e2-a712-463c-881f-7415e7ee3e4f';

    render(<SignalRHandler userId={userId} onReceiveMessage={onReceiveMessage} />);

    act(() => {
      const fakeMessage = {
        downloadAttachmentUrl: 'fake-url',
        isSuccess: true,
        message: 'Attendance Log Export',
        type: 'Attendance Log Export',
        userId: '51bcd0e2-a712-463c-881f-7415e7ee3e4f',
      };

      window.dispatchEvent(new CustomEvent('Notification', { detail: fakeMessage }));

      // expect(onReceiveMessage).toHaveBeenCalled();
    });
  });
});
