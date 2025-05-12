import { request } from './request';

const createMethod = (method) => (url, data, callback) => {
  let options;

  // 如果 data 是普通对象（而不是包含 headers/body/method 的配置对象），则将其视为 body
  if (
    data &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    !(data instanceof FormData) &&
    !data.method &&
    !data.headers &&
    !data.params &&
    !data.baseURL
  ) {
    options = { body: data, method };
  } else {
    options = { ...data, method };
  }

  const promise = request(url, options);

  if (typeof callback === 'function') {
    promise.then(data => callback(null, data)).catch(err => callback(err, null));
  } else {
    return promise;
  }
};

export const etherreq = Object.assign(
  (url, options, callback) => createMethod('GET')(url, options, callback),
  {
    get: createMethod('GET'),
    post: createMethod('POST'),
    put: createMethod('PUT'),
    delete: createMethod('DELETE'),
    del: createMethod('DELETE'),
  }
);