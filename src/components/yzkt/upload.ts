import COS, { UploadBody } from 'cos-js-sdk-v5';
import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { getCosRegion, getCosToken } from '/@/api/sys/upload';
import { createLocalStorage } from '/@/utils/cache';
import { buildShortUUID } from '/@/utils/uuid';

interface InitParams {
  isMedia: 0 | 1;
  directory?: string;
  inited?: Function;
}

interface Authorization {
  credentials: { sessionToken: string; tmpSecretId: string; tmpSecretKey: string };
  expiredTime: number;
  startTime: number;
}

interface UploadOptions {
  fileName?: string;
  onProgress?: (percent: number) => void;
}
/* @desc
 * 腾讯COS直传文件
 * @param params.isMedia - 视频音频和图片分存储桶存储，图片传 0
 * @param params.directory - 指定上传的文件夹，默认值 'ketang-uploads/'
 * @param params.inited - cos实例初始化完成回调
 */
export default class CosUpload {
  store;
  storeBucketKey: 'COS_BUCKET_MEDIA' | 'COS_BUCKET_IMAGE';
  storeAuthKey: 'COS_AUTH_MEDIA' | 'COS_AUTH_IMAGE';
  isMedia: 0 | 1 = 0;
  bucket?: string;
  region?: string;
  domain?: string;
  authorization?: Authorization;
  cos?: COS;
  inited?: Function;
  directory = 'ketang-uploads/';
  constructor(params?: InitParams) {
    if (params) {
      const { isMedia, directory, inited } = params;
      this.isMedia = isMedia || 0;
      this.inited ??= inited;
      directory && (this.directory = directory);
    }
    this.store = createLocalStorage();
    this.storeBucketKey = this.isMedia ? 'COS_BUCKET_MEDIA' : 'COS_BUCKET_IMAGE';
    this.storeAuthKey = this.isMedia ? 'COS_AUTH_MEDIA' : 'COS_AUTH_IMAGE';

    const bucketInfo = this.store.get(this.storeBucketKey);
    const authInfo = this.store.get(this.storeAuthKey);
    this.authorization ??= authInfo;
    if (bucketInfo) {
      const { bucket, region, domain } = bucketInfo;
      this.bucket ??= bucket;
      this.region ??= region;
      this.domain ??= domain;
    }

    this.init();
  }

  async init() {
    // 没有桶信息或者之前已签名但是过期了，都获取一次桶信息
    if (!this.bucket || (this.authorization && this.checkExpired())) {
      await this.reset();
    }
    this.cos = new COS({
      getAuthorization: async (_options, callback) => {
        await this.getAuth();

        const {
          credentials: { sessionToken, tmpSecretId, tmpSecretKey },
          expiredTime,
          startTime,
        } = this.authorization!;
        callback({
          TmpSecretId: tmpSecretId,
          TmpSecretKey: tmpSecretKey,
          XCosSecurityToken: sessionToken,
          ExpiredTime: expiredTime,
          StartTime: startTime,
        });
      },
    });
    this.inited && this.inited(this.cos);
  }

  async getAuth() {
    if (this.checkExpired()) {
      return getCosToken(this.isMedia).then((data) => {
        this.authorization = data;
        this.store.set(this.storeAuthKey, this.authorization);
      });
    }
  }

  reset() {
    this.cos = undefined;
    return getCosRegion(this.isMedia).then((res) => {
      this.bucket = res.bucket;
      this.region = res.region;
      this.domain = res.domain;
      this.store.set(this.storeBucketKey, {
        bucket: this.bucket,
        region: this.region,
        domain: this.domain,
      });
    });
  }
  // 检查是否需要重新签名
  checkExpired() {
    let expired = true;
    // 如果之前有签名过，判断签名有效期是否大于5分钟，有效直接继续使用
    if (this.authorization) {
      const { expiredTime, startTime } = this.authorization;
      const now = dayjs();
      const start = dayjs.unix(startTime),
        end = dayjs.unix(expiredTime - 300);

      expired = !(now.isAfter(start) && now.isBefore(end));
    }
    return expired;
  }
  /*
   * @param file - 上传的文件对象
   * @param fileName - 文件名称，非File对象时必填且必须包含完整的文件后缀信息
   * @returns url
   */
  upload(file: UploadBody, options: UploadOptions = {}): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.cos) {
        message.warning('上传实例还未完成初始化，请稍后上传');
        return reject('上传实例还未完成初始化，请稍后上传');
      }
      if (!options.fileName) {
        if (file instanceof File) {
          const suffix = file.name.match(/\.\w+$/);
          options.fileName = `${dayjs().format('YYYYMMDDHHmmss')}_${buildShortUUID()}${
            suffix && suffix[0]
          }`;
        }
      }
      this.cos.putObject(
        {
          Bucket: this.bucket! /* 必须 */,
          Region: this.region! /* 必须 */,
          Key: this.directory + options.fileName /* 必须 */,
          Body: file, // 上传文件对象
          onProgress: (progressData) => {
            options.onProgress && options.onProgress(parseInt(progressData.percent * 100));
          },
        },
        (err, data) => {
          if (err) {
            reject(err);
          }
          let result_url = '';
          if (data && data.Location) {
            if (this.domain) {
              result_url = this.domain + data.Location.substring(data.Location.indexOf('/'));
            } else {
              result_url = 'https://' + data.Location;
            }
            resolve(result_url);
          }
        },
      );
    });
  }
}
