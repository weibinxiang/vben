import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login/agentLogin',
  // Login = '/login/getCustomerToken',
  Logout = '/logout',
  GetUserInfo = '/login/getAgentUserInfo',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  GetServiceTime = '/common/getServiceTime',
  GetConsultantTagList = '/consultant/getConsultantTagList',
  //修改管理员密码
  LoginupdateAgentPw = '/login/updateAgentPw',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
export function loginTestApi(params) {
  return defHttp.get({
    url: '/login/getCustomerToken',
    params,
  });
}

/** 发送验证码 */
export function getSmsCode(params: { phone: string | number; key: string }) {
  return defHttp.get({
    url: '/common/sendSms',
    params,
  });
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

export function getServiceTime() {
  return defHttp.get({ url: Api.GetServiceTime });
}

export function getConsultantTagList() {
  return defHttp.get({ url: Api.GetConsultantTagList });
}

export function loginupdateAgentPw(params) {
  return defHttp.get({
    url: Api.LoginupdateAgentPw,
    params,
  });
}
