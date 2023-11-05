import { watchEffect, watch } from 'vue';
import { defineStore } from 'pinia';
import { useWebSocket } from '@vueuse/core';
import { store } from '/@/store';
import { useGlobSetting } from '/@/hooks/setting';
import SnowflakeId from 'snowflake-id';
import { useUserStore } from './user';
import { message } from 'ant-design-vue';
import { useStagingStore } from './staging';

enum MessageType {
  /** 登录路由 */
  login = 'login',
  /** 发送心跳 */
  heartBeat = 'HeartBeat',
  /** 发送消息 */
  sendMessage = 'sendMessage',
  /** 接收到新消息 */
  newMessage = 'newMessage',
}

export enum SocketCodeEnum {
  /** 正常 */
  success = 200,
  /** 已在别处登陆 */
  OtherLogin = 507,
}

export const useWebSocketStore = defineStore('webSocket', () => {
  const { webSocketUrl } = useGlobSetting();
  const UserStore = useUserStore();
  const StagingStore = useStagingStore();

  const { status, data, ws, send, close, open } = useWebSocket(webSocketUrl, {
    autoReconnect: {
      retries: 3,
      delay: 8000,
      onFailed() {
        console.log('--------心跳骤停--------');
      },
    },
    heartbeat: {
      message: 'HeartBeat',
      interval: 15000,
      pongTimeout: 5000,
    },
  });

  watch(data, () => {
    if (data.value) {
      try {
        const { code, data: res, msg, message_id, router } = JSON.parse(data.value);
        console.log('data.value', data.value);
        switch (code) {
          case SocketCodeEnum.success:
            if (router === MessageType.sendMessage) {
              StagingStore.refreshSendStatus({ data: res, message_id });
            } else if (router === MessageType.newMessage) {
              StagingStore.receiveMessages({ data: res, message_id });
            }
            break;
          case SocketCodeEnum.OtherLogin:
            UserStore.logout(true);
            message.error(msg);
            break;
          default:
            if (router === MessageType.sendMessage) {
              StagingStore.refreshSendStatus({ data: res, message_id });
            }
            message.error(msg);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  watchEffect(() => {
    if (status.value === 'OPEN' && UserStore.getToken) {
      sendMsg({ token: UserStore.getToken }, MessageType.login);
    }
  });

  /** 接收消息处理 异常，接收几次后断连，暂时放弃 */
  // ws.value!.onmessage = (res) => {
  //   if (res.data) {
  //     try {
  //       const { code, data, msg, message_id, router } = JSON.parse(res.data);
  //       console.log('data.value', data);
  //       switch (code) {
  //         case SocketCodeEnum.success:
  //           if (router === MessageType.sendMessage) {
  //             StagingStore.refreshSendStatus({ data, message_id });
  //           } else if (router === MessageType.newMessage) {
  //             StagingStore.receiveMessages({ data, message_id });
  //           }
  //           break;
  //         default:
  //           message.error(msg);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };

  /** 消息体唯一标识 */
  function buildUid() {
    const id = new SnowflakeId();
    return +id.generate();
  }

  async function sendMsg(params, type: MessageType = MessageType.sendMessage) {
    if (status.value === 'CLOSED') {
      open();
    }
    const uid = params?.uid || buildUid();
    delete params?.uid;
    const msg = JSON.stringify({ params, router: type, message_id: uid });
    send(msg);
    return { uid };
  }

  return { status, data, ws, sendMsg, close, open, MessageType, buildUid };
});

export function useWebSocketStoreWithOut() {
  return useWebSocketStore(store);
}
