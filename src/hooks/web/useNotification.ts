import logo from '/@/assets/images/logo2.png';
import { useStagingStore } from '/@/store/modules/staging';
import { useRouter } from 'vue-router';

interface SendNoticeParams {
  consulting_id?: number;
  title?: string;
  text?: string;
}

/** 使用web Notification通知权限 */
export function useNotification() {
  const StagingStore = useStagingStore();
  const router = useRouter();

  /** 获取是否拥有web发送通知权限 */
  function getPermission() {
    //@ts-ignore
    const Notification = window.Notification || window.mozNotification || window.webkitNotification;
    return Notification.permission === 'granted';
  }

  function initNotification() {
    if (!getPermission()) {
      window.Notification.requestPermission().then(function (permission) {
        console.log(permission);
      });
    }
  }
  initNotification();

  function sendNotice(info: SendNoticeParams) {
    const notice = new Notification(info.title || '豆角咨询', {
      body: info.text,
      icon: logo,
      tag: String(info.consulting_id),
      renotify: true,
    });

    notice.onclick = function () {
      if (document.visibilityState !== 'visible') {
        window.focus();
      }
      if (router.currentRoute.value.name !== 'StagingLayout') {
        router.push({ name: 'StagingLayout' });
      }
      // StagingStore.currentServe =
      console.log(StagingStore);
    };

    notice.close = function () {
      console.log('notice close');
    };
  }

  return {
    getPermission,
    initNotification,
    sendNotice,
  };
}
