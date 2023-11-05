<template>
  <div>
    <MsgNotice v-if="msg.sender === 'notice'" :create-time="msg.created_at" :notice="msg.notice" />
    <template v-else>
      <div class="flex mt-5 MsgCard" :class="{ 'flex-row-reverse': msgLayout === 'right' }">
        <div :class="[msgLayout === 'right' ? 'ml-3' : 'mr-3']">
          <Avatar :src="SenderInfo.avatar" :role="msg.sender" class="w-8 h-8" />
        </div>
        <div
          class="flex flex-col flex-1 overflow-hidden"
          :class="[msgLayout === 'right' ? 'items-end' : 'items-start']"
        >
          <div
            class="flex items-center w-full text-#8D8FA0 text-xs"
            :class="{ 'flex-row-reverse': msgLayout === 'right' }"
          >
            <div :class="[msgLayout === 'right' ? 'ml-2' : 'mr-2']">{{ SenderInfo.name }}</div>
            <div>{{ msg.created_at }}</div>
          </div>
          <!-- 图片消息 -->
          <MsgImage
            :src="msg.record_content!"
            :sending="msg.sending"
            v-if="msg.record_type === RecordTypeEnum.image"
          />
          <div
            v-else
            class="px-3 py-10px mt-1 relative msgCard"
            :class="[msgLayout === 'right' ? 'rightCard' : 'leftCard']"
          >
            <!-- 系统消息 -->
            <MsgSystem
              :operation="msg.operation"
              :operatorContent="msg.operation_content"
              v-if="msg.sender === SenderEnum.system"
            />
            <!-- 文字消息 -->
            <MsgText v-if="msg.record_type === RecordTypeEnum.text" :text="msg.record_content!" />
            <!-- 语音消息 -->
            <MsgAudio
              v-else-if="msg.record_type === RecordTypeEnum.audio"
              :msg-layout="msgLayout"
              :src="msg.record_content!"
              v-model:playSrc="audioPlayingSrc"
            />
            <!-- 拨号消息 -->
            <MsgDial
              :msg-layout="msgLayout"
              :recordType="msg.record_type"
              :recordContent="msg.record_content!"
              :consultingId="msg.consulting_id"
              :consultingRecordId="msg.consulting_record_id"
              v-else-if="DialTypeEnum[msg.record_type]"
            />
            <Sending
              class="absolute -left-8 top-1/2 transform -translate-y-1/2"
              :sending="msg.sending"
              @retransmission="retransmission"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { PropType, computed, ref } from 'vue';
  import {
    SenderEnum,
    RecordTypeEnum,
    DialTypeEnum,
    SendingStatusEnum,
  } from '/@/api/staging/model/enum';
  import MsgText from './src/Text.vue';
  import MsgAudio from './src/Audio.vue';
  import MsgImage from './src/Image.vue';
  import MsgSystem from './src/System.vue';
  import MsgNotice from './src/Notice.vue';
  import MsgDial from './src/Dial.vue';
  import Sending from './src/Sending.vue';
  import { useWebSocketStore } from '/@/store/modules/webSocket';
  import { useUserStore } from '/@/store/modules/user';
  import { useStagingStore } from '/@/store/modules/staging';
  import { RecordsItem } from '/@/api/staging/model/customerModel';
  import { RoleEnum } from '/@/enums/roleEnum';
  import Avatar from '../../../avatar/Avatar.vue';

  const props = defineProps({
    msg: {
      type: Object as PropType<RecordsItem & { sending?: SendingStatusEnum }>,
      default: () => ({}),
    },
  });
  const WebSocketStore = useWebSocketStore();
  const StagingStore = useStagingStore();
  const UserStore = useUserStore();
  const { sendMsg } = WebSocketStore;
  const audioPlayingSrc = ref('');

  const msgLayout = computed(() => {
    return props.msg.sender === 'system' ||
      !UserStore.getRoleList.includes(props.msg.sender as RoleEnum)
      ? 'left'
      : 'right';
  });

  const SenderInfo = computed(() => {
    let name = '';
    let avatar = '';
    if (props.msg) {
      const { sender } = props.msg;
      const { user_info, customer_detail, consultant_detail } = StagingStore.consulting || {};
      switch (sender) {
        case SenderEnum.user:
          name = user_info?.nickname || '';
          avatar = user_info?.headimg_url || '';
          break;
        case SenderEnum.customer:
          name = customer_detail?.name || '';
          avatar = customer_detail?.avatar || '';
          break;
        case SenderEnum.consultant:
          name = consultant_detail?.name ? `${consultant_detail?.name}咨询师` : '';
          avatar = consultant_detail?.consultant_avatar?.image_url || '';
          break;
        case SenderEnum.system:
          name = '系统提示';
          avatar = 'https://ttmini.yizhiwechat.com/advisory/avatar/system.png';
          break;
      }
    }
    return {
      name,
      avatar,
    };
  });

  function retransmission() {
    const msg = props.msg;
    sendMsg({
      message: msg.record_content,
      message_type: msg.record_type,
      to_consulting_id: msg.consulting_id,
      uid: msg.consulting_record_id,
    });
    msg.sending = SendingStatusEnum.sending;
  }
</script>

<style lang="less">
  .MsgCard {
    .msgCard {
      max-width: 80%;
      box-shadow: 0 2px 20px 0 rgb(0 0 0 / 4%);
    }

    .card-bg {
      background: linear-gradient(180deg, #edf3ff 0%, #fff 23.95%, #fff 100%) !important;
    }

    .leftCard {
      border-radius: 0 12px 12px;
      background: #fff;
      color: #273240;
      font-size: 14px;
      font-weight: 400;
    }

    .rightCard {
      border-radius: 12px 0 12px 12px;
      background: #3683ff;
      color: #fff;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
    }
  }
</style>
