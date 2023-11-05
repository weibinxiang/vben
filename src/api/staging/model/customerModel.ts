import { ConsultingType, OngoingServeSort, OngoingType, HistoryType } from './enum';

export interface GetOrderConsultingsParams {
  begin_date?: string;
  end_date?: string;
  status: HistoryType;
  page: number;
  page_size: number;
  keyword?: string;
}

export interface ConsultingDetail {
  /**
   * 虚拟电话
   */
  axb_phone: string | null;
  /**
   * 开始服务时间
   */
  begin_time: string;
  /**
   * 咨询师详情
   */
  consultant_detail: ConsultantDetail;
  consultant_id: number;
  /**
   * 咨询师手机
   */
  consultant_phone: string | null;
  /**
   * 标记用户信息
   */
  consultant_user?: ConsultantUser;
  /**
   * 用户填写信息
   */
  consulting_brief: ConsultingBrief;
  /**
   * 咨询室id，主键id
   */
  consulting_id: number;
  /**
   * 客服详情
   */
  customer_detail: CustomerDetail;
  customer_id: number;
  /**
   * 时长，单位分钟
   */
  duration: number;
  /**
   * 完成服务时间
   */
  finish_time: string | null;
  group_id: number;
  /**
   * 支付状态：0未支付，1已支付，2已取消，3已退款
   */
  is_pay: number;
  order_id: number;
  /**
   * 履约状态，0已关闭，1未开始，2用户填写信息，3咨询师开始，4用户开始，5咨询师完成，6用户完成
   */
  phase: number;
  /**
   * 定价，单位分
   */
  price: number;
  /**
   * 用户剩余发送次数
   */
  remain_send_count?: number;
  /**
   * 类型，1电话咨询，2在线咨询
   */
  type: ConsultingType;
  /**
   * 用户详情
   */
  user_info: UserDetail;
  user_id: number;
  user_phone: string | null;
  created_at: string;
}

/**
 * 咨询师详情
 */
export interface ConsultantDetail {
  consultant_avatar: ConsultantAvatar;
  consultant_id: number;
  consultant_info: ConsultantInfo;
  /**
   * 名字
   */
  name: string;
  openid: string;
  phone: string;
  status: number;
}

export interface ConsultantAvatar {
  consultant_id: number;
  /**
   * 头像链接
   */
  image_url: string;
}

export interface ConsultantInfo {
  /**
   * 市
   */
  city: string;
  consultant_id: number;
  consultant_info_id: number;
  /**
   * 教育背景
   */
  educational_background: string;
  /**
   * 律所
   */
  firm: string;
  /**
   * 律所坐标
   */
  firm_locations: string;
  /**
   * 职级
   */
  grade: string;
  /**
   * 荣誉
   */
  honor: string;
  id_card_back: null;
  id_card_head: null;
  /**
   * 个人简介
   */
  introduction: string;
  /**
   * 执照认证
   */
  licence: string;
  /**
   * 省
   */
  province: string;
  /**
   * 自定义标签，逗号分割
   */
  tags: string;
  /**
   * 从业年限，单位年
   */
  term: number;
}

/**
 * 标记用户信息
 */
export interface ConsultantUser {
  consultant_user_id: number;
  consulting_id: number;
  /**
   * 标签
   */
  remark: string;
  /**
   * 用户标签数组
   */
  tag_name: { consultant_user_tag_id: string; tag_name: string }[];
}

/**
 * 用户填写信息
 */
export interface ConsultingBrief {
  /**
   * 涉案金额
   */
  amount: string;
  /**
   * 信息文本
   */
  brief: string;
  consulting_brief_id: number;
  consulting_id: number;
  /**
   * 地区
   */
  district: string;
  domain_detail: DomainDetail;
  domain_id: number;
}

export interface DomainDetail {
  /**
   * 领域
   */
  domain: string;
  domain_id: number;
}

/**
 * 客服详情
 */
export interface CustomerDetail {
  customer_id: number;
  /**
   * 客服名称
   */
  name: string;
  openid: string;
  phone: string;
  status: number;
  avatar: string;
}

/**
 * 用户详情
 */
export interface UserDetail {
  /**
   * 用户头像
   */
  headimg_url: string;
  miniapp_id: number;
  /**
   * 用户昵称
   */
  nickname: string;
  openid: string;
  phone: string;
  platform: string;
  status: number;
  user_id: number;
}

export interface ConsultingRecords {
  /**
   * 咨询师名字
   */
  consultant_name: string;
  /**
   * 咨询室id
   */
  consulting_id: number;
  /**
   * 消息主键id
   */
  consulting_record_id: number;
  /**
   * 客服名称
   */
  customer_name: string;
  /**
   * 是否在线
   */
  is_online: boolean;
  /**
   * 咨询中剩余分钟
   */
  left_minutes: number;
  /**
   * 提醒类型
   */
  notice: string;
  /**
   * 系统操作类型
   */
  operation: string;
  /**
   * 系统操作内容
   */
  operation_content: string;
  /**
   * 订单id
   */
  order_id: number;
  /**
   * 服务阶段，1/2待接单、3/4咨询中
   */
  phase: number;
  /**
   * 消息内容
   */
  record_content: string;
  /**
   * 消息发送时间
   */
  record_time: string;
  /**
   * 消息类型
   */
  record_type: string;
  /**
   * 发送者
   */
  sender: string;
  /**
   * 发送者名称
   */
  sender_name: string;
  /**
   * 咨询类型，1电话、2图文
   */
  type: ConsultingType;
  /**
   * 未读消息数
   */
  unread_records: number;
  /**
   * 用户头像
   */
  user_headimg_url?: string;
  /**
   * 用户昵称
   */
  user_nickname?: string;
  /**
   * 待服务已等待分钟
   */
  wait_minutes: number;
  /** 自定义属性，完成订单后执行动画 */
  finish: boolean;
}

export interface OrderConsultings {
  begin_time: null;
  /**
   * 用户填写问题
   */
  brief: string;
  /**
   * 用户填写分类
   */
  brief_domain: string;
  /**
   * 咨询师名字
   */
  consultant_name: string;
  /**
   * 主键id
   */
  consulting_id: number;
  /**
   * 下单时间
   */
  created_at: string;
  /**
   * 客服名称
   */
  customer_name: string;
  /**
   * 服务时长，单位分钟
   */
  duration: number;
  finish_time: null;
  /**
   * 服务中剩余时长，单位分钟
   */
  left_minutes: number;
  /**
   * 订单id
   */
  order_id: number;
  /**
   * 订单号
   */
  out_trade_no: string;
  /**
   * 金额，单位分
   */
  price: number;
  /**
   * 服务阶段，1待接单、2咨询中、3已完成、4已退款
   */
  status: number;
  /**
   * 咨询类型，1电话、2图文
   */
  type: number;
  /**
   * 未读消息数量
   */
  unread_records: number;
  /**
   * 用户头像
   */
  user_headimg_url: string;
  /**
   * 用户昵称
   */
  user_nickname: string;
  /**
   * 待接单等待时长，单位分钟
   */
  wait_minutes: number;
  /**
   * 履约状态，0已关闭，1未开始，2用户填写信息，3咨询师开始，4用户开始，5咨询师完成，6用户完成
   */
  phase: number;
}

export interface RecordsItem {
  /**
   * 咨询师id，匹配基础信息里的咨询师
   */
  consultant_id?: number;
  consulting_id: number;
  /**
   * 主键id
   */
  consulting_record_id: number;
  /**
   * 发送时间
   */
  created_at: string;
  /**
   * 客服id，匹配基础信息里的客服
   */
  customer_id?: number;
  is_received?: number;
  /**
   *
   * 提醒类型，空'none',下单成功'paid',请等待'wait',已接单'begin',已完成'finish',催单成功'urge_order_succeed',催单冷却'urge_order_failed',催回复成功'urge_reply_succeed',催回复冷却'urge_reply_failed'
   */
  notice?: string;
  /**
   * 系统操作，fill填写信息、confirm完成订单、comment评价、argue未履约
   */
  operation?: string;
  operation_content?: string;
  /**
   * 接收者，所有人all、用户user、咨询师consultant、客服customer
   */
  receiver: string;
  /**
   * 消息详情
   */
  record_content: string;
  /**
   *
   * 消息类型，空、文本text、图片image、音频audio、未接听dial_no_answer、已拒绝dial_refuse、已取消dial_cancel、咨询师挂断dial_caller_cut、用户挂断dial_callee_cut、服务超时dial_service_timeout、文件file
   */
  record_type: string;
  /**
   * 当前剩余次数
   */
  remain_send_count?: number;
  /**
   * 发送者，系统system、提醒notice、用户user、咨询师consultant、客服customer
   */
  sender: string;
  sent_serial?: number;
  /**
   * 用户id，匹配基础信息里的用户
   */
  user_id?: number;
}

export interface GetConsultingRecordsParams {
  status: OngoingType;
  order_by?: OngoingServeSort;
  /** 4最早的在前，3最新的在前 */
  sort_direction?: 4 | 3;
}

export interface QuickReplyList {
  /**
   * 代理商id，有值的时候这一行在工作台不能删改
   */
  agent_id: number;
  /**
   * 咨询师id
   */
  consultant_id: number;
  /**
   * 客服id
   */
  customer_id: number;
  /**
   * 主键id
   */
  quick_reply_id: number;
  /**
   * 文本内容
   */
  reply_content: string;
}

export interface GetUserConsultingsModel {
  user_id: number;
  page: number;
  page_size: number;
}

export interface UserConsultingsModel {
  /**
   * 咨询师头像
   */
  consultant_avatar?: string;
  /**
   * 咨询师名字
   */
  consultant_name?: string;
  /**
   * 咨询室主键id
   */
  consulting_id?: number;
  /**
   * 下单时间
   */
  created_at?: string;
  /**
   * 阶段
   */
  phase?: number;
  /**
   * 服务状态，1待接单、2服务中、3已完成、4已取消
   */
  status?: number;
  /**
   * 咨询类型，1电话、2图文
   */
  type?: number;
  /**
   * 用户头像
   */
  user_headimg_url?: string;
  /**
   * 用户昵称
   */
  user_nickname?: string;
}
