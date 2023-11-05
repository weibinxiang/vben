/**消息类型为系统时要做的事情类型  */
export enum OperationEnum {
  /** 填写信息 */
  fill = 'fill',
  /** 完成订单 */
  confirm = 'confirm',
  /** 评价 */
  comment = 'comment',
  /** 未履约 */
  argue = 'argue',
}

/**  用户系统消息 */
export const userNoticeText = {
  paid: '您的订单已提交，请耐心等待咨询师响应',
  wait: '咨询人数较多时，咨询师无法迅速接单，请您提前留言预约耐心等待。若咨询师超过24小时未接单，平台将自动退款',
  begin: '您咨询订单已被咨询师接单，咨询师会即刻开始服务，请留意',
  finish: '本次服务已结束，感谢您的支持',
  urge_order_succeed: '已为您催促咨询师接单，预计在12小时内响应，请您耐心等候',
  urge_order_failed: '已为您催促过咨询师，请耐心等待～',
  urge_reply_succeed: '已为您催促咨询师尽快回复',
  urge_reply_failed: '已为您催促过咨询师，请耐心等待～',
  auto_refund:
    '由于咨询师工作繁忙，超过24小时未接单，平台已自动取消本次咨询服务并退还咨询费用，非常抱歉！',
  user_filled: '已填写信息',
  duration_limit: '您的服务3分钟后结束，完成服务后您仍可以返回咨询室内查看聊天记录',
  apply_refund: '申请退款成功，本次咨询已取消。如有需要可再次下单咨询。',
};

/**  咨询师系统消息 */
export const consultingNoticeText = {
  paid: '客户下单，请尽快开始服务',
  wait: '客户下单，请尽快开始服务', // 咨询师端不需要发送消息
  begin: '您已开始服务，请耐心解答客户疑问，若解答完毕，可以点击【完成服务】结束本次咨询',
  finish: '本次服务已完成，感谢您的答复',
  urge_order_succeed: '客户正在等待您接单，请尽快开始服务',
  urge_order_failed: null, // 咨询师端不需要发送消息
  urge_reply_succeed: '客户正在等待，期望您尽快回复',
  urge_reply_failed: null, // 咨询师端不需要发送消息,
  auto_refund: '由于咨询师超过24小时未接单，平台已自动取消本次咨询服务并退还咨询费用',
  user_filled: '用户已填写信息',
  duration_limit: '提示：本次咨询服务时长还剩余3分钟',
  apply_refund: '用户申请退款成功，本次咨询已取消。',
};

/**  客服系统消息 */
export const customNoticeText = {
  paid: '客户下单，请在咨询师开始服务前，进行咨询引导。',
  wait: '客户下单，请尽快开始服务', // 咨询师端不需要发送消息
  begin: '咨询师已接单开始服务',
  finish: '本次咨询服务已完成',
  urge_order_succeed: '客户催咨询师接单，请协调，必要时请联系咨询师尽快接单',
  urge_order_failed: null, // 咨询师端不需要发送消息
  urge_reply_succeed: '用户催咨询师回复，必要时请联系咨询师',
  urge_reply_failed: null, // 咨询师端不需要发送消息,
  auto_refund: '由于咨询师超过24小时未接单，平台已自动取消本次咨询服务并退还咨询费用',
  user_filled: '用户已填写信息',
  duration_limit: '提示：本次咨询服务时长还剩余3分钟',
  apply_refund: '用户申请退款成功，本次咨询已取消。',
};

/**  系统通知 */
export const systemNotice = {
  [OperationEnum.fill]:
    '在咨询师接单前，请简单描述您想咨询的问题，方便咨询师接单后快速为您解答，节省您宝贵的时间。',
  [OperationEnum.comment]: '本次咨询已结束，诚邀您为本次服务进行评价',
  [OperationEnum.argue]: '请您提供咨询师未服务的证明，平台将在24小时内优先处理',
  [OperationEnum.confirm]: '请确认咨询师是否完成本次咨询服务',
};
