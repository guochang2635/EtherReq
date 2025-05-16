// src/etherreq.js

export const create = (defaultConfig = {}) => {
  const interceptors = {
    request: [],
    response: [],
  };

  const use = (fulfilled, rejected, type = 'request') => {
    interceptors[type].push({ fulfilled, rejected });
  };

 const dispatchRequest = async (config) => {
  // 请求拦截器执行
    for (const interceptor of interceptors.request) {
    config = await interceptor.fulfilled(config);
  }
 let response;


  // 否则才发起网络请求
  const { url, method = 'GET', headers = {}, body } = config;
  try {
  const options = {
    method,
    headers,
    body: method !== 'GET' ? JSON.stringify(body) : undefined,
  };

  const res = await fetch(url, options);
  const data = await res.json();
  let response;


    if (!res.ok) {
      const error = new Error(`HTTP 错误: ${res.status} - ${res.statusText}`);
      error.response = {
        data,
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      };
      throw error;
    }

    response = {
      data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config,
    };
  } catch (error) {
    // 响应拦截器 - 错误处理
    for (const interceptor of interceptors.response) {
      if (interceptor.rejected) {
        return interceptor.rejected(error);
      }
    }
    throw error;
  }

  // 响应拦截器执行
  for (const interceptor of interceptors.response) {
    response = await interceptor.fulfilled(response);
  }

  return response;
};

  const instance = (config) => {
    return dispatchRequest({
      ...defaultConfig,
      ...config,
    });
  };

  instance.use = (fulfilled, rejected) => use(fulfilled, rejected, 'request');
  instance.interceptors = {
    request: {
      use: (fulfilled, rejected) => use(fulfilled, rejected, 'request'),
    },
    response: {
      use: (fulfilled, rejected) => use(fulfilled, rejected, 'response'),
    },
  };


  return instance;
};