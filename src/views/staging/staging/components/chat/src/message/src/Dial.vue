<template>
  <div
    class="flex items-center cursor-pointer"
    :class="{ 'flex-row-reverse': msgLayout === 'left' }"
    @click="openCall"
  >
    <img
      class="w-5 h-5"
      :class="[msgLayout === 'right' ? 'ml-2' : 'mr-2']"
      :src="`https://ttmini.yizhiwechat.com/advisory/iconfont/icon-phone-${
        msgLayout === 'left' ? 'black' : 'white'
      }.png`"
    />
    <div
      :class="[
        msgLayout === 'left'
          ? 'text-[#273240] text-opacity-90'
          : 'text-[#fff] flex flex-row-reverse',
      ]"
    >
      <span class="mx-1" v-if="time">
        {{ time }}
      </span>
      <span class="mx-1">
        {{ dilaText[recordType] }}
      </span>
    </div>
    <CallRecording @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { DialTypeEnum } from '/@/api/staging/model/enum';
  import CallRecording from './components/CallRecording.vue';

  const [registerModal, { openModal: openCallRecordingModal }] = useModal();

  const props = defineProps({
    msgLayout: {
      default: 'left',
      type: String,
    },
    recordType: {
      default: '',
      type: String,
    },
    recordContent: {
      default: '',
      type: String,
    },
    consultingId: { default: 0, type: Number },
    consultingRecordId: { default: 0, type: Number },
  });

  const dilaText = {
    [DialTypeEnum.dial_no_answer]: '未接听',
    [DialTypeEnum.dial_refuse]: '已拒绝',
    [DialTypeEnum.dial_cancel]: '已取消',
    [DialTypeEnum.dial_caller_cut]: '已挂断',
    [DialTypeEnum.dial_callee_cut]: '已挂断',
    [DialTypeEnum.dial_service_timeout]: '服务超时',
  };

  const time = computed(() => {
    if (props.recordContent) {
      const t = Number(props.recordContent);
      const m = String(Math.floor((t / 60) % 60)).padStart(2, '0') || '00';
      const s = String(Math.floor(t % 60)).padStart(2, '0') || '00';
      return `${m || 0}:${s || 0}`;
    } else {
      return '';
    }
  });

  function openCall() {
    openCallRecordingModal(true, {
      consulting_id: props.consultingId,
      consulting_record_id: props.consultingRecordId,
    });
  }
</script>
