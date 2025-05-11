// src/index.js
import { request } from './request';

const createMethod = (method) => (url, options) =>
  request(url, { ...options, method });

export const etherreq = Object.assign(
  (url, options) => createMethod('GET')(url, options),
  {
    get: createMethod('GET'),
    post: createMethod('POST'),
    put: createMethod('PUT'),
    delete: createMethod('DELETE'),
    del: createMethod('DELETE'),
  }
);