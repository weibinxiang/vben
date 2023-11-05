export enum ConsultantType {
  /** 普通咨询师 */
  ordinary,
  /** 律师咨询师 */
  lawyer,
}
export interface ConsultantItemModel {
  consultant_type: ConsultantType;
  /**
   * 咨询师头像数据
   */
  consultant_avatar?: {
    consultant_id: number;
    /**
     * 头像图片
     */
    image_url?: string;
  };
  consultant_info: {
    introduction: string;
  };
  /**
   * 咨询师id
   */
  consultant_id: number;
  /**
   * 咨询师sku
   */
  dy_sku?: PlatformSkus[];
  ks_sku?: PlatformSkus[];
  wx_sku?: PlatformSkus[];
  /**
   * 咨询师领域
   */
  domain_arr?: string[];
  /**
   * 邀约状态，0邀请中 1已邀约
   */
  invite_status?: number;
  /**
   * 咨询师昵称
   */
  name?: string;
  status: 0 | 1;
  introduction: string;
  is_recommend: 0 | 1;
}

export interface PlatformSkus {
  sku_data: ConsultantSkus[];
  status: number;
}
export interface ConsultantSkus {
  /**
   * 咨询师id
   */
  consultant_id: number;
  consultant_sku_id: number;
  /**
   * 时长，单位分钟
   */
  duration: number;
  /**
   * 定价，单位分
   */
  price: number;
  /**
   * 状态，1正常 0否
   */
  status: number;
  /**
   * 类型，1电话咨询，2在线咨询
   */
  type: SkuType;
  is_recommend: 0 | 1;
}

export enum SkuType {
  /** 电话咨询 */
  phone = 1,
  /** 图文咨询 */
  text,
  /** 一元咨询 */
  dollar,
}

export interface ConsultantDetailModel {
  consultant_type: ConsultantType;
  consultant_avatar: {
    image_url: string;
  };
  /**
   * 办案经历
   */
  consultant_case: ConsultantCase[];
  /**
   * 咨询师id
   */
  consultant_id: number;
  /**
   * 咨询师信息
   */
  consultant_info: ConsultantInfo;
  /**
   * 擅长领域
   */
  domain_arr: { domain: string; domain_id: number }[];
  /**
   * 所在团队数据
   */
  group_consultant: GroupConsultant[];
  /**
   * 执业单位数据
   */
  law_firm: ConsultantLawFirm;
  law_firm_id: number;
  /**
   * 咨询师名称
   */
  name: string;
  /**
   * 咨询师手机号
   */
  phone: string;
  status: 0 | 1;
  is_recommend: 0 | 1;
  consultant_skus: ConsultantSkus[];
}

export interface ConsultantCase {
  case_date: string;
  case_link?: string;
  consultant_case_id: number;
  consultant_id?: number;
  created_at?: string;
  deleted_at?: null;
  domain: ConsultantDomain;
  domain_id: number;
  serial: string;
  title: string;
  updated_at?: string;
}

export interface ConsultantDomain {
  category: string;
  domain: string;
  domain_id: number;
  is_hot: number;
  status: number;
}

/**
 * 咨询师信息
 */
export interface ConsultantInfo {
  case_duration: number | string;
  /**
   * 个案时长
   */
  case_duration_s: number;
  /**
   * 市
   */
  city: string;
  /**
   * 咨询师信息id
   */
  consultant_id: number;
  consultant_info_id: number;
  /**
   * 教育背景
   */
  educational_background: string;
  grade: string;
  honor: string;
  /**
   * 个人简介
   */
  introduction: string;
  /**
   * 省
   */
  province: string;
  /**
   * 服务次数
   */
  service_count: number;
  /**
   * 勋章
   */
  tags: string[];
  /**
   * 从业年限
   */
  term: number;
  virtual_service_count: number;
  good_problems: string;
  licence?: string;
}

export interface GroupConsultant {
  consultant_id?: number;
  group?: {
    agent_id: number;
    consultant_id: number;
    group_id: number;
    /**
     * 团队名称
     */
    name: string;
    status: number;
    principal: string;
    group_image: string;
    group_num: number;
  };
  group_consultant_id?: number;
  group_id?: number;
}

/**
 * 执业单位数据
 */
export interface ConsultantLawFirm {
  law_firm_id: number;
  /**
   * 单位名称
   */
  name: string;
}

export interface SaveConsultantDetailParams {
  /**
   * 个案时长
   */
  case_duration: string | number;
  case_info: ConsultantCaseInfo[];
  /**
   * 咨询师头像
   */
  consultant_avatar: string;
  /**
   * 咨询师id
   */
  consultant_id?: number;
  /**
   * 领域
   */
  domain_arr: number[];
  /**
   * 教育背景
   */
  educational_background: string;
  /**
   * 荣誉
   */
  honor: string;
  /**
   * 个人简介
   */
  introduction: string;
  /**
   * 手机号
   */
  phone: string;
  /**
   * 勋章
   */
  tags: string[];
  /**
   * 虚拟服务次数
   */
  virtual_service_count: string | number;
  consultant_name: string;
}

export interface ConsultantCaseInfo {
  case_date: string;
  consultant_case_id?: number;
  domain_id: number;
  serial: string;
  title: string;
}

export interface DomainModel {
  category: string;
  domain: string;
  domain_id: number;
  is_hot: number;
  status: number;
}

export interface SaveConsultantSkuParams {
  sku_data: {
    consultant_id?: number;
    duration?: number;
    price: number;
    status: number;
    type: number;
    is_recommend: number;
  }[];
}

export interface QualificationModel {
  /**
   * 审核状态，1已认证 0未认证
   */
  auth_status: number;
  /**
   * 咨询师id
   */
  consultant_id: number;
  consultant_info: {
    consultant_id: number;
    consultant_info_id: number;
    /**
     * 执业类型
     */
    grade: string;
    /**
     * 身份证，国徽面
     */
    id_card_back: string;
    /**
     * 身份证，头像面
     */
    id_card_head: string;
    /**
     * 身份证号码
     */
    id_card_number: string;
    /**
     * 执业证号
     */
    licence: string;
  };
  law_firm: {
    /**
     * 执业单位
     */
    law_firm_id: number;
    /**
     * 单位名称
     */
    name: string;
    short_name: string;
  };
  law_firm_id: number;
  licence_image: {
    consultant_id: number;
    /**
     * 执照照片
     */
    image_url: string;
  };
  /**
   * 咨询师名称
   */
  name: string;
}

export interface SaveQualificationParams {
  consultant_id: number;
  consultant_info: {
    id_card_back: string;
    id_card_head: string;
    id_card_number: string;
    licence: string;
    image_url: string;
  };
}

export interface ConsultantSpreadItem {
  /**
   * 头像
   */
  avatar_url?: string;
  /**
   * 咨询师id
   */
  consultant_id?: number;
  /**
   * 授权绑定id
   */
  id?: number;
  /**
   * 授权昵称
   */
  nickname?: string;
}
