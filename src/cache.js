// src/cache.js
const cacheStore = new Map();

/**
 * 获取缓存 key
 * @param {string} url 请求地址
 * @param {Object} options 请求参数
 * @returns {string}
 */
function getCacheKey(url, options) {
  const params = new URLSearchParams(options.params || {});
  return `${options.method}:${url}?${params.toString()}`;
}

export const requestCache = {
  /**
   * 设置缓存
   * @param {string} key 缓存 key
   * @param {*} value 缓存值
   * @param {number} ttl 过期时间（毫秒）
   */
  set(key, value, ttl = 5 * 60 * 1000) {
    const expireAt = Date.now() + ttl;
    cacheStore.set(key, { value, expireAt });
  },

  /**
   * 获取缓存
   * @param {string} key 缓存 key
   * @returns {*}
   */
  get(key) {
    const entry = cacheStore.get(key);
    if (entry && entry.expireAt > Date.now()) {
      return entry.value;
    }
    return null;
  },

  /**
   * 删除指定缓存
   * @param {string} key
   */
  delete(key) {
    cacheStore.delete(key);
  },

  /**
   * 清空所有缓存
   */
  clear() {
    cacheStore.clear();
  },
};

export { getCacheKey };