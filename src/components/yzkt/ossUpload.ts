import axios from 'axios';
import dayjs from 'dayjs';
import { getOssToken, OssType } from '/@/api/sys/upload';
import { randomString } from '/@/utils';

interface Authorization {
  accessid: string;
  dir: string;
  expire: number;
  host: string;
  policy: string;
  signature: string;
  time: string;
  cdn_host: string;
}

// 检测签名是否过期
function checkExpire(expire: number): boolean {
  const now = Date.now() / 1000;
  // 判断当前expire是否超过了当前时间， 如果超过了当前时间， 就重新取签名，5s 作为缓冲。
  return expire < now + 5;
}

// 取文件后缀
function getSuffix(filename: string) {
  const pos = filename.lastIndexOf('.');
  let suffix = '';
  if (pos != -1) {
    suffix = filename.substring(pos);
  }
  return suffix || '.png';
}

const OssToken: Partial<Record<'media' | 'image', Authorization>> = {};
let sleep = false;
function checkHasToken(tokenKey): Promise<void> {
  return new Promise((resolve) => {
    const timer = setInterval(() => {
      if (OssToken[tokenKey] || !sleep) {
        clearInterval(timer);
        resolve();
      }
    }, 100);
  });
}
/**
 * @description oss上传
 * @param {string} dir 上传文件夹地址，示例：music/cover/
 */
export default async function upload(
  file: File | Blob,
  options: {
    fileType?: OssType;
    dir?: string;
    onProgress?: (percent: number) => void;
  },
): Promise<string> {
  const dir = options?.dir || 'zixun-uploads/';
  const tokenKey = options?.fileType === 1 ? 'media' : 'image';

  if (!OssToken[tokenKey] || checkExpire(OssToken[tokenKey]!.expire)) {
    if (sleep) {
      await checkHasToken(tokenKey);
    } else {
      sleep = true;
      OssToken[tokenKey] = await getOssToken({
        // path: '',
        type: options?.fileType || 2,
      })
        .catch(console.log)
        .finally(() => (sleep = false));
    }
  }
  if (!OssToken[tokenKey]) return Promise.reject('获取上传相关信息失败');

  const key = `${dir}${dayjs().format('YYYYMMDDHHmmss')}_${randomString(16)}${getSuffix(
    (file as File)?.name,
  ).toLocaleLowerCase()}`;
  const { accessid, host, policy, signature, cdn_host } = OssToken[tokenKey]!;
  const formData = new FormData();
  formData.append('key', key);
  formData.append('OSSAccessKeyId', accessid);
  formData.append('signature', signature);
  formData.append('policy', policy);
  formData.append('file', file);
  formData.append('success_action_status', '200');
  return axios({
    url: host,
    data: formData,
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;charset=UTF-8;',
    },
    // responseType: 'text',
    onUploadProgress: function (e) {
      options?.onProgress?.(Math.round((e.loaded / (e?.total || 0)) * 100 || 0));
    },
    transformResponse: undefined,
  })
    .then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return Promise.resolve((cdn_host || host) + '/' + key);
      } else {
        return Promise.reject('图片上传错误');
      }
    })
    .catch((err) => {
      const data = err?.response?.data;
      if (typeof data === 'string') {
        const dom = document.createElement('div');
        dom.innerHTML = data;
        return Promise.reject((dom.querySelector('message') as HTMLElement)?.innerText);
      }
      return Promise.reject('图片上传错误！');
    });
}
