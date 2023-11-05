<template>
  <div>
    <slot name="rowHead"></slot>
    <div class="flex items-center py-4">
      <div
        v-for="(item, index) in modalTableColumn"
        :key="index"
        :style="item.width ? `width: ${item.width}px` : 'flex: 1'"
        class="overflow-hidden truncate"
      >
        <slot :name="item.slots"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { modalTableColumn } from '../index';
</script>
