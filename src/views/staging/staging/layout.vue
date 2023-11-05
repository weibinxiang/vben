<template>
  <div class="flex h-full min-w-280 max-w-500 mx-auto">
    <ServeContainer
      v-if="StagingStore.mode === StagingMode.menu || StagingStore.mode === StagingMode.custom"
    />
    <template v-if="StagingStore.currentServe">
      <ChatContainer class="flex-1" />
      <OrderContainer />
    </template>
    <template v-else>
      <div class="flex-1 flex items-center justify-center bg-white">
        <div class="text-center">
          <SvgIcon name="chat" :size="120" />
          <div class="text-#869090 text-base">点击左侧订单列表任意订单，可进入咨询室</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup name="StagingLayout">
  import { useStagingStore } from '/@/store/modules/staging';
  import ServeContainer from './components/serve/serve.vue';
  import ChatContainer from './components/chat/chat.vue';
  import OrderContainer from './components/order/order.vue';
  import { SvgIcon } from '/@/components/Icon/index';
  import { StagingMode } from '/@/api/staging/model/enum';

  const StagingStore = useStagingStore();
</script>
