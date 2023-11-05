import { defHttp } from '/@/utils/http/axios';
import {
  GetOrderConsultingsParams,
  ConsultingDetail,
  ConsultingRecords,
  RecordsItem,
  GetConsultingRecordsParams,
  QuickReplyList,
  OrderConsultings,
  GetUserConsultingsModel,
  UserConsultingsModel,
} from './model/customerModel';

/** 咨询室基础信息 */
export function getDetail(params: { consulting_id: number }) {
  return defHttp.get<{ consulting_detail: ConsultingDetail }>({
    url: '/service_counter/getDetail',
    params,
  });
}

/** 跟进中消息列表 */
export function getConsultingRecords(params: GetConsultingRecordsParams) {
  return defHttp.get<ConsultingRecords[]>({ url: '/service_counter/getConsultingRecords', params });
}

/** 历史订单列表 */
export function getOrderConsultings(params: GetOrderConsultingsParams) {
  return defHttp.get<{ total: number; data: OrderConsultings }>({
    url: '/service_counter/getOrderConsultings',
    params,
  });
}

/** 咨询室消息记录 */
export function getRecords(params: {
  consulting_id: number;
  count: number;
  latest_record_id?: number;
  newest_record_id?: number;
}) {
  return defHttp.get<RecordsItem[]>({ url: '/service_counter/getRecords', params });
}

/** 咨询师接单 */
export function takeOrder(data: { consulting_id: number }) {
  return defHttp.post({
    url: '/service_counter/takeOrder',
    data,
  });
}

/** 标记用户 */
export function markUser(data: { user_id: number; remark: string; tags: string }) {
  return defHttp.post({
    url: '/service_counter/markUser',
    data,
  });
}

/** 获取虚拟号码 */
export function getXPhone(data: {
  consulting_id: number;
  consultant_phone?: string;
  customer_phone?: string;
}) {
  return defHttp.post({
    url: '/service_counter/getXPhone',
    data,
  });
}
/** 完成服务 */
export function finishServe(data: { consulting_id: number }) {
  return defHttp.post({
    url: '/service_counter/finish',
    data,
  });
}

/** 删除标记 */
export function removeConsultantUser(data: { consultant_user_id: number }) {
  return defHttp.post({
    url: '/service_counter/removeConsultantUser',
    data,
  });
}

/** 获取快捷回复 */
export function getQuickReplys() {
  return defHttp.get<QuickReplyList[]>({
    url: '/service_counter/getQuickReplys',
  });
}

/** 保存快捷回复 */
export function saveQuickReply(data: { reply_content: string; quick_reply_id?: number }) {
  return defHttp.post({
    url: '/service_counter/saveQuickReply',
    data,
  });
}

/** 删除快捷回复 */
export function deleteQuickReply(data: { quick_reply_id: number }) {
  return defHttp.post({
    url: '/service_counter/deleteQuickReply',
    data,
  });
}

/** 用户咨询室列表 */
export function getUserConsultings(params: GetUserConsultingsModel) {
  return defHttp.get<{ data: UserConsultingsModel[]; total: number }>({
    url: '/service_counter/getUserConsultings',
    params,
  });
}

/** 清空未读消息数量 */
export function clearUnreadCount(data: { consulting_id: number }) {
  return defHttp.post({
    url: '/service_counter/clearUnreadCount',
    data,
  });
}

/** 咨询室消息详细内容 */
export function getRecordDetail(data: { consulting_id: number; consulting_record_id: number }) {
  return defHttp.post({
    url: '/service_counter/getRecordDetail',
    data,
  });
}
