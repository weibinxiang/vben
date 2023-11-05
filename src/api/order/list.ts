import { defHttp } from '/@/utils/http/axios';

enum Api {
  GetOrderList = '/order/getOrderList',
  GetConsultants = '/consultant/getConsultants',
  GetGroups = '/consultant/getGroups',
  SaveOrderRemark = '/order/saveOrderRemark',
  GetLawFirmConsultant = '/service_consultant/getLawFirmConsultant',
  GetOrderCommentList = '/service_consultant/getOrderCommentList',
  SaveOrderComment = '/service_consultant/saveOrderComment',
  DeleteOrderComment = '/service_consultant/deleteOrderComment',
  GetOrderCommentModelList = '/service_consultant/getOrderCommentModelList',
  SaveOrderCommentModel = '/service_consultant/saveOrderCommentModel',
  DeleteOrderCommentModel = '/service_consultant/deleteOrderCommentModel',
  SaveOrderCommentBatch = '/service_consultant/saveOrderCommentBatch',
}

export function getOrderList(params) {
  return defHttp.get({ url: Api.GetOrderList, params });
}

export function getConsultants(params) {
  return defHttp.get({ url: Api.GetConsultants, params });
}

export function getGroups(params) {
  return defHttp.get({ url: Api.GetGroups, params });
}

export function saveOrderRemark(params) {
  return defHttp.post({ url: Api.SaveOrderRemark, params });
}

export function getLawFirmConsultant() {
  return defHttp.get({ url: Api.GetLawFirmConsultant });
}

export function getOrderCommentList(params) {
  return defHttp.get({ url: Api.GetOrderCommentList, params });
}

export function saveOrderComment(params) {
  return defHttp.post({ url: Api.SaveOrderComment, params });
}

export function deleteOrderComment(params) {
  return defHttp.post({ url: Api.DeleteOrderComment, params });
}

export function getOrderCommentModelList(params) {
  return defHttp.get({ url: Api.GetOrderCommentModelList, params });
}

export function saveOrderCommentModel(params) {
  return defHttp.post({ url: Api.SaveOrderCommentModel, params });
}

export function deleteOrderCommentModel(params) {
  return defHttp.post({ url: Api.DeleteOrderCommentModel, params });
}

export function saveOrderCommentBatch(params) {
  return defHttp.post({ url: Api.SaveOrderCommentBatch, params });
}
