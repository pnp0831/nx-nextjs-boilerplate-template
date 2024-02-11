import appConfigs from '@esp/constants/config';
import { render } from '@testing-library/react';

import GoogleAnalyze, { dataLayerPush } from '.';

describe('Google Analyze', () => {
  test('Should render Google Analyze', () => {
    const { baseElement } = render(<GoogleAnalyze />);
    expect(baseElement).toBeTruthy();
  });

  test('should push event to dataLayer and call gtag with the correct arguments', () => {
    const event = { event_name: 'eventName' };
    const configs = {
      client: {
        measurementId: appConfigs.client.measurementId,
        gtmId: appConfigs.client.gtmId,
      },
    };

    const dataLayerMock = {
      push: jest.fn(),
    };

    const gtagMock = jest.fn();

    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => ({
      dataLayer: dataLayerMock,
      gtag: gtagMock,
    }));

    dataLayerPush(event, configs);

    expect(dataLayerMock.push).toHaveBeenCalledWith({
      ...event,
      page_meta_data: 'esp',
      event: event.event_name,
      eventModel: {
        event_name: event.event_name,
        send_to: appConfigs.client.measurementId,
      },
    });

    windowSpy.mockRestore();
  });

  test('should return early when both measurementId and gtmId are falsy', () => {
    const event = { event_name: 'eventName' };

    const windowSpy = jest.spyOn(global, 'window', 'get');
    windowSpy.mockImplementation(() => undefined);

    const result = dataLayerPush(event);

    expect(result).toBeUndefined();

    windowSpy.mockRestore();
  });
});
