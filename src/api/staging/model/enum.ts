/** 消息类型 */
export enum MessageType {
  /** 文本 */
  text = 'text',
  /** 图片 */
  image = 'image',
  /** 音频 */
  audio = 'audio',
}

/** 消息类型 */
export enum SendingStatusEnum {
  /** 成功 */
  success,
  /** 发送中 */
  sending,
  /** 失败 */
  error,
}

/** 咨询类型 */
export enum ConsultingType {
  /** 电话 */
  phone = 1,
  /** 图文 */
  imgOrText,
  /** 一元 */
  dollar,
}

/** 提醒类型 */
export enum RoleEnum {
  /** 用户 */
  user = 'user',
  /** 咨询师 */
  consultant = 'consultant',
  /** 客服 */
  customer = 'customer',
}

// 消息发送者
export enum SenderEnum {
  /** 系统 */
  system = 'system',
  /** 提醒 */
  notice = 'notice',
  /** 用户 */
  user = 'user',
  /** 咨询师 */
  consultant = 'consultant',
  /** 客服 */
  customer = 'customer',
}

/** 提醒类型 */
export enum NoticeEnum {
  /** 无 */
  none = 'none',
  /** 下单 */
  paid = 'paid',
  /** 等待 */
  wait = 'wait',
  /** 接单 */
  begin = 'begin',
  /** 完成 */
  finish = 'finish',
  /** 催单成功 */
  urge_order_succeed = 'urge_order_succeed',
  /** 催单冷却 */
  urge_order_failed = 'urge_order_failed',
  /** 催回复成功 */
  urge_reply_succeed = 'urge_reply_succeed',
  /** 催回复冷却 */
  urge_reply_failed = 'urge_reply_failed',
  /** 已填写信息 */
  user_filled = 'user_filled',
  /** 订单快结束 */
  duration_limit = 'duration_limit',
  /** 申请退款 */
  apply_refund = 'apply_refund',
}

/** 拨号消息类型 */
export enum DialTypeEnum {
  /** 未接听 */
  dial_no_answer = 'dial_no_answer',
  /** 已拒绝 */
  dial_refuse = 'dial_refuse',
  /** 已取消 */
  dial_cancel = 'dial_cancel',
  /** 咨询师挂断 */
  dial_caller_cut = 'dial_caller_cut',
  /** 用户挂断 */
  dial_callee_cut = 'dial_callee_cut',
  /** 服务超时 */
  dial_service_timeout = 'dial_service_timeout',
}

/** 履约状态 */
export enum PhaseEnum {
  /** 已关闭 */
  close,
  /** 未开始 */
  not_started,
  /** 用户填写信息 */
  fill_info,
  /** 咨询师开始 */
  consultant_start,
  /** 用户开始 */
  user_start,
  /** 咨询师完成 */
  consultant_finish,
  /** 用户完成 */
  user_finish,
  /** 用户未完成， 咨询师已经完成 */
  user_un_finish,
}

export enum RecordTypeEnum {
  /** 文本 */
  text = 'text',
  /** 图片 */
  image = 'image',
  /** 音频 */
  audio = 'audio',
  /** 未接听 */
  dial_no_answer = 'dial_no_answer',
  /** 已拒绝 */
  dial_refuse = 'dial_refuse',
  /** 已取消 */
  dial_cancel = 'dial_cancel',
  /** 咨询师挂断 */
  dial_caller_cut = 'dial_caller_cut',
  /** 用户挂断 */
  dial_callee_cut = 'dial_callee_cut',
  /** 服务超时 */
  dial_service_timeout = 'dial_service_timeout',
}

export enum OngoingServeSort {
  /** 按下单时间排序 */
  time = 'consulting_id',
  /** 按最后发送的消息时间 */
  last = 'consulting_record_id',
}

/** 工作台服务类型 */
export enum ServeTypeEnum {
  /** 跟进中 */
  ongoing,
  /** 历史订单 */
  history,
  /** 客户记录（该客户的跟进中历史订单） */
  custom,
}

/** 跟进中类型 */
export enum OngoingType {
  /** 全部 */
  all,
  /** 待服务 */
  wait,
  /** 咨询中 */
  serveing,
}

/** 历史订单类型 */
export enum HistoryType {
  /** 全部 */
  all,
  /** 已完成 */
  success = 3,
  /** 已取消 */
  cancel = 4,
}

/** 当前服务状态 */
export enum ServeStatus {
  /** 未知 */
  unknown = 0,
  /** 待接单 */
  wait,
  /** 咨询中 */
  ongoing,
  /** 已完成 */
  success,
  /** 已退款 */
  refund,
}

/** 进入工作台场景 */
export enum StagingMode {
  /** 正常菜单点击进入 */
  menu,
  /** 订单列表查看记录弹窗 */
  order,
  /** 客户列表查看记录弹窗 */
  custom,
}
