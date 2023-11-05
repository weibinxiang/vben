<template>
  <div class="text-gray-400 py-4">
    <div class="flex items-center justify-center">
      <LoadingOutlined />
      <span class="ml-2" v-if="loadingText">{{ loadingText }}</span>
    </div>
    <div class="text-center">{{ finishText }}</div>
  </div>
</template>

<script setup lang="ts">
  import { LoadingOutlined } from '@ant-design/icons-vue';

  defineProps({
    loading: {
      type: Boolean,
      default: false,
    },
    loadingText: {
      type: String,
      default: '加载中...',
    },
    finish: {
      type: Boolean,
      default: false,
    },
    finishText: {
      type: String,
      default: '已经到底了',
    },
  });
</script>
