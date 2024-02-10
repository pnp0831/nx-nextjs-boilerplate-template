/**
 * @jest-environment node
 */

import request from './axios';

jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({
      value: undefined,
    }),
  }),
}));
jest.doMock('@esp/utils/helper', () => ({
  isServer: true,
  getServerApiUrl: () => '30191',
}));

describe('Request Interceptors', () => {
  it('Request baseURL should correct', async () => {
    expect(request.defaults.baseURL).toBe(process.env.API_URL);
  });

  it('Request baseURL should correct', async () => {
    const response = { data: 'Success' };

    jest.spyOn(request, 'get').mockResolvedValue({
      data: response.data,
      headers: {},
    });

    request.interceptors.request.handlers[0].fulfilled = (config) => {
      config.headers = config.headers || {}; // Ensure headers object exists
      config.headers['timeZone'] = 'Asia/SaiGon'; // Set timeZone
      return config;
    };

    const fulfilledPromise = Promise.resolve(response);
    await request.interceptors.response.handlers[0].fulfilled(fulfilledPromise);

    await request.interceptors.request.handlers[0].fulfilled({ url: '/time-management' });

    const interceptedResponse = await request.get('/time-management');

    expect(interceptedResponse.data).toBe(response.data);
  });
});
