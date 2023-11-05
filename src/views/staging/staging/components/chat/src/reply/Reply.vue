<template>
  <div class="rounded-t-md bg-white p-4">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-end">
        <Upload
          name="file"
          :show-upload-list="false"
          :accept="accept"
          :before-upload="beforeUpload"
          :customRequest="handleUpload"
          multiple
          :maxCount="9"
        >
          <SvgIcon name="image" :size="20" class="mr-2 cursor-pointer" />
        </Upload>
        <!-- <SvgIcon name="emoticon" :size="20" class="cursor-pointer" /> -->
      </div>
      <EditQuickReply
        v-model:value="message"
        :text-list="replyList"
        @update-data="getRplylist"
        @select-text="isWhatch = false"
      >
        <div class="flex items-center bg-#FFF7E8 rounded px-2 py-1">
          <SvgIcon name="reply" />
          <div class="text-black text-opacity-85 font-bold ml-2px cursor-pointer">快捷回复</div>
        </div>
      </EditQuickReply>
    </div>

    <QuickReply
      v-model:value="message"
      :text-list="replyList"
      :is-whatch="isWhatch"
      @select-text="isWhatch = false"
    >
      <InputTextarea
        :placeholder="'请输入……'"
        :auto-size="{ minRows: 2, maxRows: 5 }"
        :bordered="false"
        :rows="3"
        @focus="isWhatch = true"
        v-model:value="message"
        @press-enter="handleSend"
      />
    </QuickReply>

    <div class="text-right mt-4">
      <a-button
        type="primary"
        @click="handleSend"
        :disabled="!message"
        pre-icon="ant-design:send-outlined"
      >
        发送
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Input, Upload, message as messageModal } from 'ant-design-vue';
  import { SvgIcon } from '/@/components/Icon/index';
  import { useWebSocketStore } from '/@/store/modules/webSocket';
  import { useStagingStore } from '/@/store/modules/staging';
  import { useUserStore } from '/@/store/modules/user';
  import { MessageType, SendingStatusEnum } from '/@/api/staging/model/enum';
  import dayjs from 'dayjs';
  import ossUpload from '/@/components/yzkt/ossUpload';
  import EditQuickReply from './components/EditQuickReply.vue';
  import QuickReply from './components/QuickReply.vue';
  import { getQuickReplys } from '/@/api/staging/staging';
  import { QuickReplyList } from '/@/api/staging/model/customerModel';

  const InputTextarea = Input.TextArea;
  const message = ref('');
  const accept = 'image/png,image/jpg,image/jpeg';
  const replyList = ref<QuickReplyList[]>([]);
  const WebSocketStore = useWebSocketStore();
  const StagingStore = useStagingStore();
  const UserStore = useUserStore();
  const waitUploadList = [] as any; // 兼容多选图片时snowflake-id连续生成的值重复
  const regex = /^[\r\n\s]+$/;
  const { sendMsg, buildUid } = WebSocketStore;
  const isWhatch = ref(true);

  const beforeUpload = (file) => {
    const accepts = accept.split(',').map((v) => {
      return v.trim();
    });
    if (!accepts.includes(file.type as string)) {
      messageModal.warning(`仅支持以下文件类型: ${accepts.map((v) => v.split('/')[1]).join('、')}`);
      return false;
    }

    return true;
  };
  onMounted(() => {
    getRplylist();
  });
  function getRplylist() {
    getQuickReplys().then((res) => {
      replyList.value = res;
    });
  }

  async function handleSend(event) {
    // 回车发送并且禁止换行
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
    }
    // 验证是否只有空格和换行符 shify+回车可以换行但禁止发送
    if (!message.value || regex.test(message.value) || (event.keyCode === 13 && event.shiftKey)) {
      // messageModal.warning('请输入信息后在发送！');
      return;
    }
    const id = StagingStore.currentServe?.consulting_id || 0;
    const { uid } = await sendMsg({
      message: message.value,
      message_type: MessageType.text,
      to_consulting_id: id,
    });
    pushMessage({ id, uid, msg: message.value, type: MessageType.text });
    message.value = '';
    console.log(message.value);
  }

  async function handleUpload(info) {
    const fn = () => {
      if (info.file) {
        const id = StagingStore.currentServe?.consulting_id || 0;
        const tempPath = URL.createObjectURL(info.file);
        const uid = buildUid();
        const msgData = pushMessage({ id, uid, msg: tempPath, type: MessageType.image });
        uploadRequest(info, msgData);
        waitUploadList.splice(0, 1);
        if (waitUploadList.length) {
          setTimeout(() => waitUploadList[0]?.(), 20);
        }
      }
    };
    if (!waitUploadList.length) setTimeout(() => fn(), 20);
    waitUploadList.push(fn);
  }

  /** 发送先推入咨询室的消息列表，成功后根据uid来更新状态 */
  function pushMessage({ id, uid, type, msg }) {
    const serveInfo = StagingStore.serveInfo[id];
    const consulting = serveInfo.consulting;
    const sender = UserStore.getRoleList[0];
    !serveInfo.message && (serveInfo.message = []);
    const data = {
      consulting_id: id,
      consulting_record_id: uid,
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      sender: sender,
      record_type: type,
      record_content: msg,
      sending: SendingStatusEnum.sending,
      receiver: 'all',
    };
    StagingStore.refreshServeNewMessage({
      consulting_id: consulting?.consulting_id,
      sender: sender,
      record_type: type,
      record_content: msg,
    });
    serveInfo.message.push(data);
    StagingStore.sendingQueue.set(uid, id);
    return data;
  }

  function uploadRequest(info, msgData) {
    ossUpload(info.file, {
      fileType: 2,
      dir: 'zixun-uploads/message/',
    })
      .then((url) => {
        sendMsg({
          message: url,
          message_type: MessageType.image,
          to_consulting_id: msgData.consulting_id,
          uid: msgData.consulting_record_id,
        });
      })
      .catch(() => {
        msgData.sending = SendingStatusEnum.error;
        StagingStore.sendingQueue.delete(msgData.consulting_record_id);
      });
  }
</script>

<style lang="less">
  .ant-btn-primary[disabled] {
    .send-icon {
      color: rgb(0 0 0 / 25%) !important;
    }
  }
</style>
