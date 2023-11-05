<template>
  <div class="hidden md:block">
    <Popover trigger="click" :placement="placement">
      <template #content>
        <div class="flex flex-col items-center w-62">
          <div class="text-center text-gray-400 mt-2 mb-1"> 手机快捷查看收益 及时接收订单消息</div>
          <QrCode :value="qrCodeUrl" :width="200" :options="{ margin: 2 }" />
          <div class="text-center text-gray-600 mb-2">
            <ScanOutlined class="mr-2" />打开微信扫一扫</div
          >
        </div>
      </template>
      <a-button
        type="primary"
        pre-icon="ant-design:qrcode-outlined"
        :icon-size="16"
        class="!flex items-center"
      >
        手机查看数据
      </a-button>
    </Popover>
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { Popover } from 'ant-design-vue';
  import type { TooltipPlacement } from 'ant-design-vue/es/tooltip/index';
  import { QrCode } from '/@/components/Qrcode/index';
  import { ScanOutlined } from '@ant-design/icons-vue';

  defineProps({
    placement: {
      type: String as PropType<TooltipPlacement>,
      default: 'bottomLeft',
    },
  });

  const qrCodeUrl = ref(window.location.href);
</script>
