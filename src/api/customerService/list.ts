import { defHttp } from '/@/utils/http/axios';
import { GetCustomerListModel, AddOrEditCustomerModel } from './model/listModel';

enum Api {
  getCustomerList = '/customer/getCustomerList',
  addOrEditCustomer = '/customer/addOrEditCustomer',
  DeleteCustomer = '/customer/deleteCustomer',
  GetConsultantCustomerList = '/customer/getConsultantCustomerList',
  GetCustomerBindConsultant = '/customer/getCustomerBindConsultant',
  CustomerBindOrUnBindConsultant = '/customer/customerBindOrUnBindConsultant',
}

/**
 * @description: getCustomerList 客服列表
 */
export function getCustomerList(params) {
  return defHttp.get<GetCustomerListModel>({ url: Api.getCustomerList, params });
}

/**
 * @description: addOrEditCustomer 新增客服
 */
export function addOrEditCustomer(params: AddOrEditCustomerModel) {
  return defHttp.post({ url: Api.addOrEditCustomer, params });
}

/**
 * @description: deleteCustomer 删除客服
 */
export function deleteCustomer(params) {
  return defHttp.post({ url: Api.DeleteCustomer, params });
}

/**
 * @description: getConsultantCustomerList 获取客服跟进咨询师列表
 */
export function getConsultantCustomerList(params) {
  return defHttp.post({ url: Api.GetConsultantCustomerList, params });
}

/**
 * @description: getCustomerBindConsultant 客服绑定咨询师列表
 */
export function getCustomerBindConsultant(params) {
  return defHttp.post({ url: Api.GetCustomerBindConsultant, params });
}

/**
 * @description: customerBindOrUnBindConsultant 客服绑定与解绑咨询师
 */
export function customerBindOrUnBindConsultant(params) {
  return defHttp.post({ url: Api.CustomerBindOrUnBindConsultant, params });
}
