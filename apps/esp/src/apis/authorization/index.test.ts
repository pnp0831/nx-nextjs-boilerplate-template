import request from '../axios';
import {
  generateToken,
  IDENTITY_API_PATH,
  mockOktaToken,
  mockResponseGenerateToken,
  refreshToken,
} from './index';

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => mockResponseGenerateToken,
  })
);

jest.mock('@esp/constants/config', () => ({
  common: {
    useMockData: true,
  },
  server: {
    apiUrl: 'https://',
  },
}));

describe('Authorization service', () => {
  const accessToken = mockOktaToken;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate token successfully', async () => {
    jest.spyOn(request, 'post').mockResolvedValue(mockResponseGenerateToken);

    const response = await generateToken(accessToken);

    expect(response).toEqual(mockResponseGenerateToken);
    expect(request.post).toHaveBeenCalledTimes(1);
    expect(request.post).toHaveBeenCalledWith(IDENTITY_API_PATH.generateToken, {
      accessToken,
    });
  });

  it('should refresh token successfully', async () => {
    jest.spyOn(request, 'post').mockResolvedValue(mockResponseGenerateToken);

    const response = await refreshToken({ accessToken, refreshToken: 'refreshToken' });

    expect(response).toEqual(mockResponseGenerateToken);
  });

  it('should handle error and return undefined when generating token', async () => {
    jest.mock('@esp/constants/config', () => ({
      common: {
        useMockData: true,
      },
    }));
    let response;
    try {
      const error = new Error('error');
      jest.spyOn(request, 'post').mockRejectedValue(error);

      response = await generateToken(accessToken);
    } catch (error) {
      expect(response).toBe(undefined);
      expect(request.post).toHaveBeenCalledTimes(1);
      expect(request.post).toHaveBeenCalledWith(IDENTITY_API_PATH.generateToken, {
        accessToken,
      });
    }
  });
});
