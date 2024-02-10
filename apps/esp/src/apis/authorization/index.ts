import appConfigs from '@esp/constants/config';
import dayjs from 'dayjs';

import request from '../axios';
import { IBaseAPIResponse } from '../types';

export const IDENTITY_API_PATH = {
  generateToken: '/identity/v1/Identity/GenerateToken',
  refreshToken: '/identity/v1/Identity/RefreshToken',
};

export interface IResponseGenerateToken {
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export type IGenerateToken = IBaseAPIResponse<IResponseGenerateToken>;

export const generateToken = async (accessToken: string): Promise<IGenerateToken> => {
  return request.post(IDENTITY_API_PATH.generateToken, { accessToken });
};

export const refreshToken = ({
  refreshToken,
  accessToken,
}: {
  refreshToken: string;
  accessToken: string;
}): Promise<IGenerateToken> => {
  const serverApiUrl = appConfigs.server.apiUrl;

  const pathUrl = `${serverApiUrl}/api${IDENTITY_API_PATH.refreshToken}`;

  // Why do we use fetch here instead of axios
  // This method run at next-middleware which run on Edge Runtime, and Edge Runtime doesnt support axios request.
  return fetch(pathUrl, {
    method: 'POST',
    body: JSON.stringify({ accessToken, refreshToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
};

export const mockResponseGenerateToken: IGenerateToken = {
  data: {
    accessToken:
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1MWJjZDBlMi1hNzEyLTQ2M2MtODgxZi03NDE1ZTdlZTNlNGYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibjE0ZGNjbjIxN0BzdHVkZW50LnB0aXRoY20uZWR1LnZuIiwianRpIjoiM2ExNWIwMDktNTI3Mi00MWViLWFlNDEtZGM1NzQ0NDg4ZjFiIiwiYnJhbmNoSWQiOiJmNWIxNjRkNy0yYzcxLTQ0ZmMtOWQ4YS0yMGI3Y2IxNGM5MDciLCJvcmdhbml6YXRpb25JZCI6IjFkNGJlOWViLWNiNDAtNGQzMC1hZWFlLWFiOTkzYWNmZmVhNSIsImVtcGxveWVlSWQiOiI1NmFmZTYxYy1mMGMwLWRlNzctZTNmYS1jNjA4M2E0YTY5MjUiLCJwZXJtaXNzaW9ucyI6WyJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VUYXNrIiwiVGFza01hbmFnZW1lbnQuQWRtaW4uTWFuYWdlRW1wbG95ZWUiLCJUYXNrTWFuYWdlbWVudC5BZG1pbi5NYW5hZ2VSZXNvdXJjZSIsIlRhc2tNYW5hZ2VtZW50LkFkbWluLk1hbmFnZVRpbWUiXSwiZXhwIjoxNjk0MTQ0NDEwLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAifQ.Vmje6T1fNWF89c9MyUvcwC8vvIHar4MTrWvB0hY7xNOLCehrFYprLIDpMaHyJGe_M4BO6rKCn8Jp2gpV5pgQaihM7mWsi7Rqkd3FMWewSEPkWTxWE-2ZIVguNy2gyyQBjuEfQJ_cKSnQGi2T7JjT49rcicK3R_VE4IyS63qJ_baHzSjJBXJAMpFu3g8w53t2fKEHMXf7KNu1vLEkbdFBmsMOmg8axFH5DPotWnZOk8GESI6xhV5q8L7MQ6BPsOWNkEtyEbSzKu-V0w6QrJBezLSkSa-msreMe2A98yYg9kkIR0VKZvQZD7AeKl7rw3LSVuemi4AcL3bqNNiuR9j_QA',
    refreshToken:
      '3o2E4bOTP75xSJIQY4oYWnvs/0AMI9h0tQ4Y60iBmQx1WG/6diE0fkoCtgliS6RBk9/UOd3r9YWt+rU2jPhkcg==',
    expiration: dayjs().add(7, 'd').toISOString(),
  },
};

export const mockOktaToken =
  'eyJraWQiOiJrM0RmMElYbkV6VkEyMzJKdXczcU1mYXU3RmpnYWZHOHoxU3FqbzFKa0FBIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnRRak5JS0NTNldQVS16X0t4bkFuZDNKaVJVb0llMEhZWW1jelVkSWFqS0kiLCJpc3MiOiJodHRwczovL2Rldi03ODM4OTY0Mi5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2OTQxNDI1NjgsImV4cCI6MTY5NDE0NjE2OCwiY2lkIjoiMG9hOXVqbWtxbDJmQ2lMaDk1ZDciLCJ1aWQiOiIwMHU5dWs4b3A5YnlCRm12ZDVkNyIsInNjcCI6WyJwcm9maWxlIiwib3BlbmlkIiwiZW1haWwiXSwiYXV0aF90aW1lIjoxNjk0MTM2NzY3LCJzdWIiOiJuMTRkY2NuMjE3QHN0dWRlbnQucHRpdGhjbS5lZHUudm4ifQ.s2QgTFyVDu7i8Uew-xixDL2vus8v2LHIRe0nEAQGqVugInXLvyvzxkN7LVDP4HxeZyUMFQ7OVngdUqz6lrJv-gGBDXGrJDmLh1dAk1HwF_G37loa0aXPffeWX4NGBxLDA3YJTfJRSr6uqLEArHN41vnHmcqjRkwjOKS-wVP1ozRFQLp2vUvSjXe6XpDzVoSymoyPAk8Wm6RtVfuvUNSbcfewW9EMwEN5mj81c3-Ob65jXHW_CwhoNRl8bV--JsO6QvYDjp3g_RTGdRa90Gaeml0hhbjQVmlQfbq0EYUB5Rh5WAZ19Fse_4ctWkWjVe4qByY8vjVCdRG1kJv8zfYIhg';
