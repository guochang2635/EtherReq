// src/request.js
import { create } from './etherreq';
import { requestCache, getCacheKey } from './cache';

// 创建一个带有默认配置的请求实例
const instance = create({
  baseURL: 'https://api.example.com', // 默认基础 URL
});

// 请求拦截器：自动注入 token、Content-Type 和缓存处理
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  const headers = {
    ...(config.headers || {}),
    Authorization: token ? `Bearer ${token}` : undefined,
    'Content-Type': 'application/json',
  };

  if (config.method === 'GET' && !config.disableCache) {
    const cacheKey = getCacheKey(config.url, config);
    const cached = requestCache.get(cacheKey);
    if (cached) {
      const fakeResponse = {
        data: cached,
        status: 200,
        statusText: 'OK',
        config,
        isFromCache: true, // ✅ 添加标志位
      };
      return Promise.resolve(fakeResponse); // ✅ 返回响应对象，中断请求链
    }
  }

  return {
    ...config,
    headers,
  };
});

// 响应拦截器：自动提取 response.data 并写入缓存
instance.interceptors.response.use(
    (response) => {
    // 判断是否是缓存返回的数据（没有 .config）
    if (!response.config && response.data !== undefined) {
      // 已经是 data，直接返回
      return response;
    }

    const config = response.config;

    if (config && config.method === 'GET' && !config.disableCache) {
      const cacheKey = getCacheKey(config.url, config);
      requestCache.set(cacheKey, response.data);
    }
    return response.data;
  },
  (error) => {
    console.error('请求异常:', error);
    return Promise.reject(error);
  }
);
let _baseURL = 'https://api.example.com'; // 内部变量用于保存 base URL

/**
 * 封装 request 函数，支持 baseURl 拼接等逻辑
 * @param {string} url - 请求路径
 * @param {Object} options - 请求配置
 */
export const request = (url, options = {}) => {
  const baseURL = options.baseURL || _baseURL;
  const finalURL = new URL(url, baseURL).toString();

  return instance({
    ...options,
    url: finalURL,
  });
};

// 导出可读写的 baseURL 变量
export { _baseURL as baseURL };

// 允许外部设置 baseURL
export const setBaseURL = (newBaseURL) => {
  _baseURL = newBaseURL;
};