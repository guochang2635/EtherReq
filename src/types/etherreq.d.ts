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
  login: EtherRequestMethod; // 新增 login 类型
}

// 导出对象
declare const etherreq: EtherreqStatic;

declare module 'etherreq' {
  export const etherreq: EtherreqStatic;
  export let baseURL: string;
  export function setBaseURL(url: string): void;
}

export { etherreq };