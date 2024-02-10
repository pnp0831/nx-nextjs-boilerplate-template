import appConfigs from '@esp/constants/config';
import { isServer } from '@esp/utils/helper';
import axios from 'axios';

const request = axios.create({
  timeout: 60000,
  baseURL: isServer ? appConfigs.server.apiUrl : '/',
});

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response.data?.errors || error.response.data);
    }

    return Promise.reject(error);
  }
);

request.interceptors.request.use(async (request) => {
  request.url = request.url?.startsWith('/') ? `/api${request.url}` : `/api/${request.url}`;
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  request.headers['timeZone'] = timeZone;

  if (isServer) {
    const serverApiUrl = appConfigs.server.apiUrl;
    request.baseURL = serverApiUrl;
  }

  return request;
});

export default request;
