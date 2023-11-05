import { defHttp } from '/@/utils/http/axios';
import {
  ConsultantItemModel,
  ConsultantDetailModel,
  SaveConsultantDetailParams,
  DomainModel,
  ConsultantSkus,
  SaveConsultantSkuParams,
  QualificationModel,
  SaveQualificationParams,
  ConsultantSpreadItem,
} from './model/consultant';

/** 获取咨询师管理列表 */
export function getConsultantList(params: {
  search_key?: string;
  law_firm_id?: number;
  page: number;
  page_size: number;
}) {
  return defHttp.get<{ data: ConsultantItemModel[] }>({
    url: '/service_consultant/getConsultantList',
    params,
  });
}

/** 获取咨询师详情 */
export function getConsultantDetail(params: { consultant_id: number }) {
  return defHttp.get<ConsultantDetailModel>({
    url: '/service_consultant/getConsultantDetail',
    params,
  });
}

/** 保存咨询师详情 */
export function saveConsultantDetail(data: SaveConsultantDetailParams) {
  return defHttp.post({
    url: '/service_consultant/saveConsultantDetail',
    data,
  });
}

/** 获取咨询师领域数据 */
export function getConsultantDomain() {
  return defHttp.get<DomainModel[]>({
    url: '/consultant/getConsultantDomain',
  });
}

/** 获取咨询师售卖管理 */
export function getConsultantSku(params: { consultant_id: number }) {
  return defHttp.get<ConsultantSkus[]>({
    url: '/service_consultant/getConsultantSku',
    params,
  });
}

/** 保存售卖管理 */
export function saveConsultantSku(data: SaveConsultantSkuParams) {
  return defHttp.post({
    url: '/service_consultant/saveConsultantSku',
    data,
  });
}

/** 资质认证详情 */
export function getQualification(params: { consultant_id: number }) {
  return defHttp.get<QualificationModel>({
    url: '/service_consultant/qualification',
    params,
  });
}

/** 保存咨询师资质认证 */
export function saveQualification(data: SaveQualificationParams) {
  return defHttp.post({
    url: '/service_consultant/saveQualification',
    data,
  });
}

/** 删除咨询师 */
export function delConsultant(data: { consultant_id: number }) {
  return defHttp.post({
    url: '/service_consultant/delConsultant',
    data,
  });
}

/** 获取咨询师推广链接 */
export function getConsultantDyLink(params: { consultant_id: number }) {
  return defHttp.get({
    url: '/service_consultant/getConsultantDyLink',
    params,
  });
}

/** 获取咨询师推广二维码 */
export function getConsultantDyQrcode(params: { consultant_id: number }) {
  return defHttp.get({
    url: '/service_consultant/getConsultantDyQrcode',
    params,
  });
}

/** 执业单位列表(不分页)
 */
export function getPracticeUnitNoPageList() {
  return defHttp.get({
    url: '/practice_unit/getPracticeUnitNoPageList',
  });
}

/** 邀请咨询师入驻
 */
export function inviteInConsultant(data) {
  return defHttp.post({
    url: '/service_consultant/inviteInConsultant',
    data,
  });
}

/** 邀请咨询师记录
 */
export function inviteInConsultantList(params) {
  return defHttp.get({
    url: '/service_consultant/inviteInConsultantList',
    params,
  });
}
/** 获取咨询师授权绑定列表 */
export function getConsultantSpread(params: { consultant_id: number }) {
  return defHttp.get<{ dy: ConsultantSpreadItem[] }>({
    url: '/service_consultant/getConsultantSpread',
    params,
  });
}

/** 解除咨询师授权绑定 */
export function unbindAuthorization(params: { spread_id: number }) {
  return defHttp.get({
    url: '/service_consultant/UnbindAuthorization',
    params,
  });
}
/** 获取授权绑定二维码 */
export function getConsultantBindAgentSpreadQr(params: { consultant_id: number }) {
  return defHttp.get({
    url: '/service_consultant/getConsultantBindAgentSpreadQr',
    params,
  });
}

/** 保存咨询师资质认证 */
export function sendInviteSms(data: { phone: string }) {
  return defHttp.post({
    url: '/service_consultant/sendInviteSms',
    data,
  });
}

/** 禁用咨询师 */
export function setConsultantStatus(data: { consultant_id: number; status: number }) {
  return defHttp.post({
    url: '/service_consultant/setConsultantStatus',
    data,
  });
}

/** 设置咨询师首页展示 */
export function setConsultantRecommend(data: { consultant_id: number; type: 0 | 1 }) {
  return defHttp.post({
    url: '/service_consultant/setConsultantRecommend',
    data,
  });
}
