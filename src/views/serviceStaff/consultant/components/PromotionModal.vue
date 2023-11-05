<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="推广"
    :width="500"
    :min-height="320"
    :footer="null"
  >
    <div v-loading="loading" class="relative w-50 h-50 mx-auto mt-8">
      <img :src="qrCode" class="w-full h-ful" />
    </div>
    <div class="flex items-center py-1 justify-center mt-12">
      <div class="flex items-center border-solid border-1 border-gray-300 px-2 w-55 h-8">
        <div
          class="leading-none whitespace-nowrap overflow-x-auto overflow-y-hidden promote-qrcode-link"
        >
          {{ link }}
        </div>
      </div>
      <a-button type="primary" class="!w-30" @click="copyUrl(link)" v-if="link">复制链接</a-button>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getConsultantDyQrcode, getConsultantDyLink } from '/@/api/serviceStaff/consultant';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';

  const qrCode = ref();
  const link = ref('');
  const { clipboardRef } = useCopyToClipboard();
  const loading = ref(false);

  const [registerModal] = useModalInner(({ consultant_id }) => {
    loading.value = true;
    getConsultantDyQrcode({ consultant_id })
      .then((res) => {
        qrCode.value = `data:image/png;base64,${res}`;
      })
      .finally(() => {
        loading.value = false;
      });
    getConsultantDyLink({ consultant_id }).then((res) => {
      link.value = res.url_link;
    });
  });

  function copyUrl(path?: string) {
    clipboardRef.value = path || '';
    message.success('已复制至粘贴板');
  }
</script>
