import { ConsultantType } from './consultant';

export interface GroupList {
  /**
   * 代理商id
   */
  agent_id?: number;
  consultant_id?: number;
  /**
   * 团队id
   */
  group_id?: number;
  group_info?: GroupInfo;
  /**
   * 团队名称
   */
  name?: string;
  principal?: Principal;
  group_image?: GroupImage;
  /**
   * 状态，状态，0关闭，1正常
   */
  status?: number;
}

export interface GroupInfo {
  group_id: number;
  group_info_id: number;
  /**
   * 团队人数
   */
  group_num: number;
}

export interface Principal {
  consultant_type: ConsultantType;
  consultant_id: number;
  /**
   * 团队负责人
   */
  name: string;
}

export interface GroupImage {
  group_id: number;
  group_image_id: number;
  /**
   * 团队图片
   */
  image_url: string;
}

export interface GroupDetail {
  agent_id: number;
  consultant_id: number;
  /**
   * 团队咨询师
   */
  group_consultant: GroupConsultant[];
  /**
   * 团队招牌领域
   */
  group_domain: GroupDomain[];
  /**
   * 团队id
   */
  group_id: number;
  /**
   * 团队照片信息
   */
  group_image: GroupImage;
  /**
   * 团队营销信息
   */
  group_info: GroupInfo;
  /**
   * 团队名称
   */
  name: string;
  /**
   * 团队负责人信息
   */
  principal: Principal;
  status: number;
}

export interface GroupConsultant {
  consultant_type: ConsultantType;
  /**
   * 咨询师头像信息
   */
  consultant_avatar: GroupConsultantConsultantAvatar;
  /**
   * 咨询师id
   */
  consultant_id: number;
  /**
   * 咨询师信息->职称
   */
  consultant_info: ConsultantInfo;
  /**
   * 咨询师名称
   */
  name: string;
  /**
   * 咨询师手机号
   */
  phone: string;
}

/**
 * 咨询师头像信息
 */
export interface GroupConsultantConsultantAvatar {
  /**
   * 咨询师id
   */
  consultant_id: number;
  /**
   * 咨询师头像
   */
  image_url: string;
}

/**
 * 咨询师信息->职称
 */
export interface ConsultantInfo {
  consultant_id: number;
  consultant_info_id: number;
  /**
   * 职称
   */
  grade: string;
}

export interface GroupDomain {
  /**
   * 领域名称
   */
  domain?: string;
  /**
   * 领域id
   */
  domain_id: number;
}

/**
 * 团队照片信息
 */
export interface GroupImage {
  /**
   * 团队id
   */
  group_id: number;
  /**
   * 照片id
   */
  group_image_id: number;
  /**
   * 照片url
   */
  image_url: string;
}

/**
 * 团队营销信息
 */
export interface GroupInfo {
  /**
   * 个案时长
   */
  case_duration: number;
  /**
   * 团队id
   */
  group_id: number;
  group_info_id: number;
  /**
   * 团队人数
   */
  group_num: number;
  /**
   * 服务人数
   */
  virtual_service_count: number;
}

/**
 * 团队负责人信息
 */
export interface Principal {
  /**
   * 负责人头像信息
   */
  consultant_avatar: PrincipalConsultantAvatar;
  /**
   * 负责人id
   */
  consultant_id: number;
  /**
   * 负责人名称
   */
  name: string;
}

/**
 * 负责人头像信息
 */
export interface PrincipalConsultantAvatar {
  /**
   * 负责人id
   */
  consultant_id: number;
  /**
   * 负责人头像
   */
  image_url: string;
}
