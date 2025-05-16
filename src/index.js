// src/index.js
import { request, baseURL as _baseURL, setBaseURL } from './request';

// 设置全局 base URL
// setBaseURL('http://localhost:8081/api');

// 示例封装方法
const createMethod = (method) => (url, data, callback) => {
  let options;

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
    login: (url, data, callback) => {
      const loginPromise = createMethod('POST')(url, data);

      loginPromise.then(response => {
        const token = response.data?.token;
        if (token) {
          localStorage.setItem('token', token); // 保存 token 到 localStorage
        }
        return response;
      });

      if (typeof callback === 'function') {
        loginPromise.then(data => callback(null, data)).catch(err => callback(err, null));
      } else {
        return loginPromise;
      }
    },
  }
);

export { setBaseURL, _baseURL as baseURL };