/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 委譲
 * @template T ターゲット
 * @template U 委譲先
 * @param {T} target
 *   元のオブジェクト (優先的にアクセスされる)
 * @param {U} delegate
 *   委譲対象となるオブジェクト (プロパティ・メソッドが存在すればそちらに転送される)
 * @returns {T & U}
 *   プロキシオブジェクト
 */
export function delegate<T extends object, U extends object>(
  target: T,
  delegate: U
): T & U {
  return new Proxy(target, {
    get(_, prop, receiver) {
      if (prop in delegate) {
        const value = (delegate as any)[prop];
        return typeof value === 'function' ? value.bind(delegate) : value;
      }
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value) {
      if (prop in delegate) {
        (delegate as any)[prop] = value;
        return true;
      }
      (target as any)[prop] = value;
      return true;
    },
  }) as T & U;
}
