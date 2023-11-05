<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="扫码授权"
    :width="450"
    :min-height="320"
    :can-fullscreen="false"
    :footer="null"
  >
    <div class="text-lg font-bold flex items-center justify-center">
      <SvgIcon size="20" name="scan" class="mt-1px" />
      <span class="ml-2">抖音APP扫码授权</span>
    </div>
    <div class="text-#86909C px-10 mt-4"
      >请使用抖音APP扫码完成授权，当前设备操作可截图/保存二维码到抖音app完成扫码</div
    >
    <div class="w-50 h-50 mx-auto my-6" v-loading="loading">
      <img :src="qrCode" class="w-full h-full" v-if="qrCode" />
    </div>

    <div class="text-center">
      <a-button
        type="primary"
        pre-icon="ant-design:vertical-align-bottom-outlined"
        @click="download"
        >保存</a-button
      >
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  import { downloadByBase64 } from '/@/utils/file/download';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getConsultantBindAgentSpreadQr } from '/@/api/serviceStaff/consultant';

  const qrCode = ref('');
  const loading = ref(false);
  const [registerModal] = useModalInner(({ consultant_id }) => {
    loading.value = true;
    getConsultantBindAgentSpreadQr({ consultant_id })
      .then((res) => {
        qrCode.value = `data:image/png;base64,${res}`;
      })
      .finally(() => {
        loading.value = false;
      });
  });

  function download() {
    downloadByBase64(qrCode.value, 'empower.jpg');
  }
</script>
