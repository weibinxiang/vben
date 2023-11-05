import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
// import { useWebSocket } from '@vueuse/core';
import { store } from '/@/store';
// import { useGlobSetting } from '/@/hooks/setting';
import {
  ConsultingDetail,
  ConsultingRecords,
  GetConsultingRecordsParams,
  GetOrderConsultingsParams,
  RecordsItem,
  OrderConsultings,
  GetUserConsultingsModel,
  UserConsultingsModel,
} from '/@/api/staging/model/customerModel';
import {
  getConsultingRecords,
  getOrderConsultings,
  getRecords,
  getDetail,
  getUserConsultings,
  clearUnreadCount,
} from '/@/api/staging/staging';
import {
  ServeTypeEnum,
  SendingStatusEnum,
  PhaseEnum,
  ServeStatus,
  SenderEnum,
  NoticeEnum,
  StagingMode,
} from '/@/api/staging/model/enum';
import dayjs from 'dayjs';
import { assign } from 'lodash-es';
import { isNumber } from '/@/utils/is';
import { useDebounceFn } from '@vueuse/core';
import { useUserStore } from './user';
import { RoleEnum } from '/@/enums/roleEnum';
// import { useNotification } from '/@/hooks/web/useNotification';

type ServeInfoModel = Record<
  number,
  {
    consulting?: ConsultingDetail;
    message?: (RecordsItem & { sending?: SendingStatusEnum })[];
    msgFinished?: boolean;
  }
>;

interface ServeListModel {
  [ServeTypeEnum.ongoing]: Partial<ConsultingRecords>[];
  [ServeTypeEnum.history]: Partial<OrderConsultings>[];
  [ServeTypeEnum.custom]: UserConsultingsModel[];
}

type ServeItemModel = Partial<ConsultingRecords> &
  Partial<OrderConsultings> &
  Partial<UserConsultingsModel>;

type GetServeListOpt = {
  type: ServeTypeEnum;
  recordsParams?: GetConsultingRecordsParams;
  consultingsParams?: GetOrderConsultingsParams;
};

export const useStagingStore = defineStore('staging', () => {
  const UserStore = useUserStore();
  // const { sendNotice } = useNotification();

  const currentServe = ref<ServeItemModel>(); // 当前选择的咨询室
  const serveInfo = ref<ServeInfoModel>({}); // 所有查询过的咨询室消息和基础信息内容
  const getMsgLoading = ref(false); // 获取咨询室消息列表loading
  const sendingQueue = new Map(); // 消息发送中队列 消息message_id对应的咨询室id
  /** 服务列表 */
  const serveList = ref<ServeListModel>({
    [ServeTypeEnum.ongoing]: [],
    [ServeTypeEnum.history]: [],
    [ServeTypeEnum.custom]: [],
  });
  const serveUpdateTime = ref<dayjs.Dayjs>(); // 咨询室等待时间和服务时间更新时的时间
  const mode = ref<StagingMode>(StagingMode.menu);
  const timer = ref<IntervalHandle>(); // 更新等待时间和服务时间的定时器
  const getServeListOpt = {} as GetServeListOpt;

  /** 当前选择的咨询室详情 */
  const consulting = computed<ConsultingDetail | undefined>(() => {
    const key = currentServe.value?.consulting_id || 0;
    return serveInfo.value[key]?.consulting;
  });

  /** 咨询室消息列表 */
  const message = computed(() => {
    const key = currentServe.value?.consulting_id || 0;
    return serveInfo.value[key]?.message || [];
  });

  /** 获取工作台咨询室服务列表 */
  function getServeList(opt?: {
    type: ServeTypeEnum;
    recordsParams?: GetConsultingRecordsParams;
    consultingsParams?: GetOrderConsultingsParams;
  }) {
    // 为了能让接收到消息时也能刷新列表，保存一下上次请求的参数
    if (opt) {
      assign(getServeListOpt, opt);
    }
    if (!getServeListOpt) return Promise.reject();
    const params = getServeListOpt;
    const { type, recordsParams, consultingsParams } = params || {};

    return (
      type === ServeTypeEnum.ongoing
        ? getConsultingRecords(recordsParams!)
        : getOrderConsultings(consultingsParams!)
    ).then((res) => {
      if (type === ServeTypeEnum.history) {
        serveList.value[type!] =
          consultingsParams?.page === 1 ? res.data : serveList.value[type!].concat(res.data);
      } else {
        serveList.value[type!] = res;
      }
      return res;
    });
  }

  /** 获取客户的跟进中和历史记录 */
  function getCustomServeList(params: GetUserConsultingsModel) {
    return getUserConsultings(params).then((res) => {
      serveList.value[ServeTypeEnum.custom] = res.data;
      return res.data;
    });
  }

  /** 获取咨询室服务列表 */
  function changeCurrentServe(item?: ServeItemModel) {
    if (!item || !item?.consulting_id) {
      currentServe.value = undefined;
      return;
    }
    // 重置未读消息数量
    if (item.unread_records) {
      item.unread_records = 0;
      clearUnreadCount({ consulting_id: item.consulting_id });
    }
    currentServe.value = item;

    // 没有聊天室数据，先定义一个
    !serveInfo.value[item.consulting_id] && (serveInfo.value[item.consulting_id] = {});
    const info = serveInfo.value[item.consulting_id];
    if (!info?.consulting) queryDetail();
    if (!info?.message) {
      getMsgLoading.value = true;
      queryRecords().finally(() => (getMsgLoading.value = false));
    }
  }

  /** 咨询室消息记录 */
  function queryRecords(latest_record_id?: number) {
    const consulting_id = currentServe.value!.consulting_id!;
    const data = serveInfo.value[consulting_id];
    return getRecords({ latest_record_id, consulting_id, count: 20 }).then((res) => {
      data.message ? data.message.unshift(...res) : (data.message = res);
      if (!res?.length) data.msgFinished = true;
    });
  }

  /** 咨询室详情信息 */
  function queryDetail(consultingId?: number) {
    const consulting_id = consultingId || currentServe.value!.consulting_id!;
    getDetail({ consulting_id }).then((res) => {
      serveInfo.value[consulting_id].consulting = res.consulting_detail;
    });
  }

  /** 刷新服务列表中最新消息 */
  function refreshServeNewMessage(data: Partial<ConsultingRecords>) {
    const { list, index } = queryOngoingServeItem(data.consulting_id!);
    if (index > -1) {
      assign(list[index], data);
    }
  }

  /** 刷新消息发送状态 */
  function refreshSendStatus({ message_id, data }) {
    // 最后一条消息开始向前遍历
    const consulting_id = sendingQueue.get(message_id);
    const message = serveInfo.value[consulting_id].message || [];
    for (let i = message.length - 1; i >= 0; i--) {
      if (message[i].consulting_record_id === message_id) {
        // 暂时不知道返回的状态类型是什么意思
        message[i].sending =
          data?.status === 1 ? SendingStatusEnum.success : SendingStatusEnum.error;
        if (data?.status === 1) sendingQueue.delete(message[i].consulting_record_id);
        break;
      }
    }
  }

  /** 接收消息 */
  function receiveMessages({ data }: { data: RecordsItem; message_id: number }) {
    const consulting = serveInfo.value[data.consulting_id] || {};
    if (consulting?.message?.length) {
      consulting.message.push(data);
    }
    const { list, index, item } = queryOngoingServeItem(data.consulting_id);
    if (index > -1) {
      // 不在当前咨询室增加一条未读消息记录
      if (currentServe.value?.consulting_id !== data.consulting_id) {
        ++item.unread_records!;
        // sendNotice({
        //   consulting_id: item.consulting_id,
        //   title: item.user_nickname,
        //   text: data.record_content,
        // });
      } else {
        // 在当前咨询室清空后台记录的未读消息
        debounceClearUnreadCount(item.consulting_id!);
      }
      assign(list[index], data);
    }
    if (data.sender === SenderEnum.notice) {
      switch (data.notice) {
        // 用户已填写信息，刷新详情
        case NoticeEnum.user_filled:
          queryDetail(data.consulting_id);
          break;
        // 新订单刷新列表
        case NoticeEnum.paid:
          getServeList({ type: ServeTypeEnum.ongoing });
          break;
        // 有退款刷新状态
        case NoticeEnum.apply_refund:
          getServeList({ type: ServeTypeEnum.ongoing });
          item && (item.phase = PhaseEnum.close);
          consulting.consulting && (consulting.consulting.phase = PhaseEnum.close);
          break;
        // 非咨询师收到开始服务刷新状态
        case NoticeEnum.begin:
          if (!UserStore.getRoleList.includes(RoleEnum.consultant) && item) {
            item.phase = PhaseEnum.consultant_start;
            item.left_minutes = consulting.consulting?.duration || 30;
          }
          consulting.consulting && (consulting.consulting.phase = PhaseEnum.consultant_start);
          break;
        // 完成服务刷新状态
        case NoticeEnum.finish:
          if (!UserStore.getRoleList.includes(RoleEnum.consultant) && item) {
            item.phase = PhaseEnum.consultant_finish;
            item.finish = true;
          }
          consulting.consulting && (consulting.consulting.phase = PhaseEnum.consultant_finish);
          break;
      }
    }
  }

  /** 清除未读消息 */
  const debounceClearUnreadCount = useDebounceFn((consulting_id: number) => {
    clearUnreadCount({ consulting_id });
  }, 3000);

  /** 获取跟进服务列表中指定数据 */
  function queryOngoingServeItem(consulting_id: number) {
    const list = serveList.value[ServeTypeEnum.ongoing];
    const index = list.findIndex((item) => consulting_id === item.consulting_id);
    return { list, index, item: list[index] };
  }

  /** 开启服务时间更新定时器 */
  function listenInServeTime() {
    clearInterval(timer.value);
    if (!serveList.value[ServeTypeEnum.ongoing]?.length) return;
    serveUpdateTime.value = dayjs();
    timer.value = setInterval(() => {
      updateServeTime();
    }, 60000);
  }

  /** 获取当前服务状态 */
  function getServeStatus(phase?: PhaseEnum): ServeStatus {
    const value = isNumber(phase) ? phase : currentServe.value?.phase;
    let status = ServeStatus.unknown;
    switch (value) {
      case PhaseEnum.close:
        status = ServeStatus.refund;
        break;
      // 待服务
      case PhaseEnum.not_started:
      case PhaseEnum.fill_info:
        status = ServeStatus.wait;
        break;
      // 咨询中
      case PhaseEnum.consultant_start:
      case PhaseEnum.user_start:
        status = ServeStatus.ongoing;
        break;
      // 已完成
      case PhaseEnum.consultant_finish:
      case PhaseEnum.user_finish:
      case PhaseEnum.user_un_finish:
        status = ServeStatus.success;
        break;
    }
    return status;
  }

  /** 更新服务时间 */
  function updateServeTime() {
    const list = serveList.value[ServeTypeEnum.ongoing] || [];
    const diffMinute = Math.round(dayjs().diff(serveUpdateTime.value) / 1000 / 60);
    list.forEach((item) => {
      if (getServeStatus(item.phase) === ServeStatus.wait) {
        item.wait_minutes! += diffMinute;
      } else {
        const m = item.left_minutes! - diffMinute;
        item.left_minutes = m < 0 ? 0 : m;
      }
    });
    serveUpdateTime.value = dayjs();
  }

  function reset() {
    currentServe.value = undefined;
    serveInfo.value = {};
    sendingQueue.clear();
    serveList.value = {
      [ServeTypeEnum.ongoing]: [],
      [ServeTypeEnum.history]: [],
      [ServeTypeEnum.custom]: [],
    };
    serveUpdateTime.value = undefined;
    if (timer.value) clearInterval(timer.value);
  }

  return {
    mode,
    consulting,
    currentServe,
    message,
    serveInfo,
    serveList,
    getMsgLoading,
    sendingQueue,
    timer,
    reset,
    getServeList,
    changeCurrentServe,
    refreshSendStatus,
    refreshServeNewMessage,
    receiveMessages,
    listenInServeTime,
    updateServeTime,
    getServeStatus,
    queryOngoingServeItem,
    queryRecords,
    getCustomServeList,
  };
});

export function useStagingStoreWithOut() {
  return useStagingStore(store);
}
