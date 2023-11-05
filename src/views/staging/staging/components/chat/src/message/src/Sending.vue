<template>
  <div>
    <loading-outlined
      class="!text-#4686ee text-xl mt-2px"
      v-if="SendingStatusEnum.sending === sending"
    />
    <Popconfirm
      title="确定重发此条消息？"
      ok-text="确定"
      cancel-text="取消"
      @confirm="confirm"
      v-else-if="SendingStatusEnum.error === sending"
    >
      <ExclamationCircleFilled class="!text-#f43f3f text-base mt-1 cursor-pointer" />
    </Popconfirm>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { Popconfirm } from 'ant-design-vue';
  import { SendingStatusEnum } from '/@/api/staging/model/enum';
  import { LoadingOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';

  defineProps({
    sending: {
      type: Number as PropType<SendingStatusEnum>,
      default: SendingStatusEnum.success,
    },
  });

  const emits = defineEmits(['retransmission']);

  function confirm() {
    emits('retransmission');
  }
</script>
