import { UploadApiResult } from './model/uploadModel';
import { defHttp } from '/@/utils/http/axios';
import { UploadFileParams } from '/#/axios';
import { useGlobSetting } from '/@/hooks/setting';

const { uploadUrl = '' } = useGlobSetting();
export enum Api {
  GetCosRegion = '/agent/getCosRegion',
  GetCosToken = '/agent/getTencentStsKey',
  GetVideoCover = '/dy/getVideoFirstFrame',
}
export enum OssType {
  media = 1,
  image,
}

/**
 * @description: Upload interface
 */
export function uploadApi(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: ProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: uploadUrl,
      // @ts-ignore
      onUploadProgress,
    },
    params,
  );
}

export function getCosRegion(isMedia = 0) {
  return defHttp.get({ url: Api.GetCosRegion, params: { is_kt_media: isMedia } });
}

export function getCosToken(isMedia = 0) {
  return defHttp.post({ url: Api.GetCosToken, data: { is_kt_media: isMedia } });
}

export function getOssToken(params: { path?: string; type: OssType } = { type: OssType.image }) {
  return defHttp.get({
    url: '/common/getOssToken',
    params: { path: params.path || '', type: params.type },
  });
}

export function getVideoCover(video_url: string) {
  return defHttp.post(
    {
      url: Api.GetVideoCover,
      data: { video_url },
    },
    {
      apiUrl: 'https://image-to-video.yizhiweixin.com',
      withToken: false,
    },
  );
}
