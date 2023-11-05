<template>
  <div
    class="absolute left-0 top-0 right-0 bottom-0 z-100 bg-white bg-opacity-80"
    v-if="mask && loading"
  ></div>
  <div
    class="flex flex-col items-center justify-center whitespace-nowrap"
    :class="{
      'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-100': absolute,
    }"
    v-if="loading || empty"
  >
    <template v-if="loading">
      <slot name="loading">
        <Spin size="large" />
        <div class="text-gray-500 mt-2 text-base">{{ loadingText }}</div>
      </slot>
    </template>
    <template v-else-if="empty">
      <slot name="empty">
        <Empty
          :description="emptyText"
          :image="emptyImage"
          :image-style="{
            height: '80px',
            display: 'flex',
            justifyContent: 'center',
          }"
        />
      </slot>
      <slot name="empty-button"></slot>
    </template>
    <slot name="button"></slot>
  </div>
</template>
<script lang="ts" setup>
  // import { ref } from 'vue'
  import { Empty, Spin } from 'ant-design-vue';
  import emptyImage from '/@/assets/icons/empty.svg';

  defineProps({
    absolute: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: '',
    },
    empty: {
      type: Boolean,
      default: false,
    },
    emptyText: {
      type: String,
      default: '暂无相关内容',
    },
    mask: {
      type: Boolean,
      default: false,
    },
  });
  // const emits = defineEmits(['update:loading', 'update:empty']);
</script>
