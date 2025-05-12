// src/types/etherreq.d.ts

interface EtherRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string | number | boolean>;
  body?: any;
  params?: Record<string, any>;
  baseURL?: string;
}

interface EtherRequestResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

// 请求方法类型
type EtherRequestMethod = <T = any>(
  url: string,
  options?: EtherRequestOptions
) => Promise<T>;

// 主函数类型（支持调用 + 属性方法）
interface EtherreqStatic extends EtherRequestMethod {
  get: EtherRequestMethod;
  post: EtherRequestMethod;
  put: EtherRequestMethod;
  delete: EtherRequestMethod;
  del: EtherRequestMethod;
}

// 导出对象
declare const etherreq: EtherreqStatic;

export { etherreq };