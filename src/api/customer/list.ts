import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetConsultantClientList = '/consultant_client/getConsultantClientList',
  GetUserConsultingList = '/consultant_client/getUserConsultingList',
  GetUserTagList = '/consultant_client/getUserTagList',
  GetConsultantUserTagList = '/consultant_client/getConsultantUserTagList',
  DelConsultantUserTag = '/consultant_client/delConsultantUserTag',
  AddConsultantUserTag = '/consultant_client/addConsultantUserTag',
}

export function getConsultantClientList(params) {
  return defHttp.get({ url: Api.GetConsultantClientList, params });
}

export function getUserConsultingList(params) {
  return defHttp.get({ url: Api.GetUserConsultingList, params });
}

export function getUserTagList(params) {
  return defHttp.get({ url: Api.GetUserTagList, params });
}

export function getConsultantUserTagList(params) {
  return defHttp.get({ url: Api.GetConsultantUserTagList, params });
}

export function delConsultantUserTag(params) {
  return defHttp.get({ url: Api.DelConsultantUserTag, params });
}

export function addConsultantUserTag(params) {
  return defHttp.post({ url: Api.AddConsultantUserTag, params });
}
