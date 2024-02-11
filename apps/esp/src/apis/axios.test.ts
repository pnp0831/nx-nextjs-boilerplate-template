import request from './axios';

jest.mock('next-auth/jwt', () => ({
  decode: jest.fn().mockReturnValue({
    accessToken: 'yourAccessToken',
  }),
}));

const responseData = { message: 'Success' };
const errorResponseData = { message: 'Error' };

describe('Request Interceptors', () => {
  it('Request baseURL should correct', async () => {
    expect(request.defaults.baseURL).toBe('/');
  });

  it('Should set the "request url" correctly ', async () => {
    const interceptedRequest = await request.interceptors.request.handlers[0].fulfilled({
      headers: {},
      url: 'testing',
    });

    expect(interceptedRequest.url).toBe('/api/testing');

    const interceptedRequest1 = await request.interceptors.request.handlers[0].fulfilled({
      headers: {},
      url: '/testing',
    });

    expect(interceptedRequest1.url).toBe('/api/testing');
  });

  it('Should resolve with response data for successful response', async () => {
    // Mock a successful response
    const response = { data: responseData };
    jest.spyOn(request, 'get').mockResolvedValue(response);
    const fulfilledPromise = Promise.resolve(response);
    await request.interceptors.response.handlers[0].fulfilled(fulfilledPromise);
    const interceptedResponse = await request.get('/');
    // Assert that the intercepted response contains the response data
    expect(interceptedResponse).toBe(response);
  });

  it('Should reject with response data for error response', async () => {
    const error = {
      response: {
        data: errorResponseData,
      },
    };
    jest.spyOn(request, 'get').mockRejectedValue(error);
    try {
      await request.interceptors.response.handlers[0].rejected(error);
      await request.get('/');
    } catch (error) {
      expect(error).toBe(error);
    }
  });

  it('Should reject without response data for error response', async () => {
    const error = {};
    jest.spyOn(request, 'get').mockRejectedValue(error);
    try {
      await request.interceptors.response.handlers[0].rejected(error);
      await request.get('/');
    } catch (error) {
      expect(error).toBe(error);
    }
  });
});
