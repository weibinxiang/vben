<template>
  <div class="mt-1 cursor-pointer relative" @click="imgPreview">
    <img class="w-60 max-h-80 object-cover overflow-hidden rounded" :src="src" />
    <div
      class="absolute left-0 top-0 w-full h-full bg-black bg-opacity-40 flex justify-center items-center"
      v-if="sending === SendingStatusEnum.sending || sending === SendingStatusEnum.error"
    >
      <LoadingOutlined class="!text-white text-4xl" v-if="SendingStatusEnum.sending === sending" />
      <div class="text-white font-bold text-base" v-else>发送失败，点击重发</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { createImgPreview } from '/@/components/Preview';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { SendingStatusEnum } from '/@/api/staging/model/enum';

  const props = defineProps({
    src: {
      type: String,
      default: '',
    },
    sending: {
      type: Number as PropType<SendingStatusEnum>,
      default: SendingStatusEnum.success,
    },
  });

  function imgPreview() {
    if (props.sending !== SendingStatusEnum.success) return;
    createImgPreview({ imageList: [props.src] });
  }
</script>
