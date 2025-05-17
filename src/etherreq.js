// src/etherreq.js

export const create = (defaultConfig = {}) => {
  const interceptors = {
    request: [],
    response: [],
  };

  const use = (fulfilled, rejected, type = 'request') => {
    interceptors[type].push({ fulfilled, rejected });
  };

  // ✅ 使用 const 显式声明 dispatchRequest
// etherreq.js
const dispatchRequest = async (config) => {
  // 请求拦截器执行
  for (const interceptor of interceptors.request) {
    const nextConfig = await interceptor.fulfilled(config);
    // ✅ 拦截器可以返回一个 response 对象，表示中断请求
    if (nextConfig && nextConfig.isFromCache) {
      return nextConfig; // ✅ 直接返回缓存结果，不再往下执行
    }
    config = nextConfig;
  }

  let response;
  const { url, method = 'GET', headers = {}, body } = config;
  let text = '';
  try {
    const options = {
      method,
      headers,
      body: method !== 'GET' ? JSON.stringify(body) : undefined,
    };

    const res = await fetch(url, options);
    text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP 错误: ${res.status} - ${res.statusText}`);
    }

    if (text.trim().startsWith('<')) {
      throw new Error('服务器返回了 HTML 页面，预期为 JSON 格式');
    }

    const data = JSON.parse(text);

    response = {
      data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config,
    };
  } catch (error) {
    error.message += `\n请求地址: ${url}`;
    if (text) {
      error.message += `\n响应内容: ${text.substring(0, 200)}...`;
    }

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