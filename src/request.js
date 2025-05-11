// src/request.js
import { create } from './myaxios';

const instance = create({
  baseURL: 'https://api.example.com',
});

// 请求拦截器 - 自动注入 token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  return {
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  };
});

// 响应拦截器 - 返回 data
instance.interceptors.response.use(
  (response) => {
    return response.data; // 自动提取 data
  },
  (error) => {
    console.error('请求异常:', error);
    return Promise.reject(error);
  }
);

export const request = (url, options) => {
  return instance({
    ...options,
    url: options.baseURL + url,
  });
};