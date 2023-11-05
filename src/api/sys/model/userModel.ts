import { RoleEnum } from '/@/enums/roleEnum';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  phone: string;
  login_role: string;
  code?: string;
  key?: string;
  type?: string;
  password?: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  agent_id: number;
  avatar: string;
  consultant_id: number;
  customer_id: number;
  name: string;
  role: RoleEnum;
  token: string;
  phone: string;
  is_register: 0 | 1;
  homePath?: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  /**
   * 代理商ID
   */
  agent_id: number;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 咨询师ID
   */
  consultant_id: number;
  /**
   * 客服ID
   */
  customer_id: number;
  /**
   * 昵称
   */
  name: string;
  roles: RoleEnum;
  phone: string;
  /**
   * 角色，代理商：agent，客服：customer，咨询师：consultant
   */
  role: RoleEnum.agent | RoleEnum.customer | RoleEnum.consultant;
  token: string;
  homePath?: string;
  is_register: 0 | 1;
}
