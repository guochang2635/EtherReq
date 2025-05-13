// src/request.js
import { create } from './myaxios';

// 创建一个带有默认配置的请求实例
const instance = create({
  baseURL: 'https://api.example.com', // 默认基础 URL
});

// 请求拦截器：自动注入 token 和 Content-Type
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  // 构建最终 headers
  const headers = {
    ...(config.headers || {}), // 用户自定义 headers
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  // 如果是 POST/PUT 等非 GET 请求，并且没有指定 Content-Type，则默认为 application/json
  if (config.method !== 'GET' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  return {
    ...config,
    headers,
  };
});

// 响应拦截器：自动提取 response.data
instance.interceptors.response.use(
  (response) => {
    return response.data; // 返回 data 字段作为结果
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