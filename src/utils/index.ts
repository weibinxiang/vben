import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Component } from 'vue';

import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es';
import { unref } from 'vue';
import { isArray, isObject, isBoolean } from '/@/utils/is';

export const noop = () => {};

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * Recursively merge two objects.
 * 递归合并两个对象。
 *
 * @param source The source object to merge from. 要合并的源对象。
 * @param target The target object to merge into. 目标对象，合并后结果存放于此。
 * @param mergeArrays How to merge arrays. Default is "replace".
 *        如何合并数组。默认为replace。
 *        - "union": Union the arrays. 对数组执行并集操作。
 *        - "intersection": Intersect the arrays. 对数组执行交集操作。
 *        - "concat": Concatenate the arrays. 连接数组。
 *        - "replace": Replace the source array with the target array. 用目标数组替换源数组。
 * @returns The merged object. 合并后的对象。
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace',
): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`);
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
}

/** 生成随机整数：min ≤ r ≤ max */
export function randomIntNumber(Min: number, Max: number) {
  const Range = Max - Min;
  const Rand = Math.random();
  const num = Min + Math.round(Rand * Range); //四舍五入
  return num;
}
/* 生成随机字符串 */
export function randomString(len) {
  len = len || 32;
  const $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz-';
  // const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

export function openWindow(
  url: string,
  opt?: { target?: TargetContext | string; noopener?: boolean; noreferrer?: boolean },
) {
  const { target = '__blank', noopener = true, noreferrer = true } = opt || {};
  const feature: string[] = [];

  noopener && feature.push('noopener=yes');
  noreferrer && feature.push('noreferrer=yes');

  window.open(url, target, feature.join(','));
}

// dynamic use hook props
export function getDynamicProps<T extends Record<string, unknown>, U>(props: T): Partial<U> {
  const ret: Recordable = {};

  Object.keys(props).map((key) => {
    ret[key] = unref((props as Recordable)[key]);
  });

  return ret as Partial<U>;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

// https://github.com/vant-ui/vant/issues/8302
type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void;
    };
  };
};

export type WithInstall<T> = T & {
  install(app: App): void;
} & EventShim;

export type CustomComponent = Component & { displayName?: string };

export const withInstall = <T extends CustomComponent>(component: T, alias?: string) => {
  (component as Record<string, unknown>).install = (app: App) => {
    const compName = component.name || component.displayName;
    if (!compName) return;
    app.component(compName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as WithInstall<T>;
};

// 按ascii码从小到大排序
export function sortAscii(obj) {
  let str = '';

  const testFun = function (item) {
    const ss = '';
    if (item === null) {
      item = '';
    }
    if (isObject(item)) {
      return ss + `{${sortAscii(item)}}`;
    } else if (isArray(item)) {
      return ss + `[${sortAscii(item)}]`;
    } else {
      return ss + item;
    }
  };
  if (isObject(obj)) {
    const keys = Object.keys(obj).sort();
    for (const item in keys) {
      str += keys[item] + '=' + testFun(obj[keys[item]]) + '&';
    }
    const char = '&';
    str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
  } else if (isArray(obj)) {
    obj.forEach((element) => {
      str += testFun(element) + ',';
    });
    const char = ',';
    str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
  }
  return str;
}

/**  过滤undefined和null的参数 Boolean转换为数字 */
export function formatParams(params) {
  for (const key in params) {
    params[key] ?? delete params[key];
    if (isObject(params[key])) {
      formatParams(params[key]);
    } else if (isArray(params[key])) {
      params[key].forEach((item) => isObject(item) && formatParams(item));
      !params[key].length && delete params[key];
    } else if (isBoolean(params[key])) {
      params[key] = +params[key];
    }
  }
}

export function formatTime(second) {
  if (second >= 60) {
    return `${Math.floor(Number(second) / 60) || 0}小时`;
  } else {
    return `${second || 0}分钟`;
  }
}

export function randomDate(serviceTime) {
  let time = '';
  let year = new Date(serviceTime.timestamp * 1000).getFullYear();
  const month = new Date(serviceTime.timestamp * 1000).getMonth() + 1;
  let m = Math.floor(Math.random() * month);
  const d = Math.floor(Math.random() * 28 + 1);
  const h = Math.floor(Math.random() * 23 + 1);
  const f = Math.floor(Math.random() * 59 + 1);
  const s = Math.floor(Math.random() * 59 + 1);
  if (m < 1) {
    m = Math.floor(Math.random() * 12 + 1);
    year--;
  }
  time = `${year}/${m < 10 ? '0' + m : m}/${d < 10 ? '0' + d : d} ${h < 10 ? '0' + h : h}:${
    f < 10 ? '0' + f : f
  }:${s < 10 ? '0' + s : s}`;
  return time;
}

export function regTel(tel) {
  if (/^1[3456789]\d{9}$/.test(tel)) {
    return true;
  } else {
    return false;
  }
}
