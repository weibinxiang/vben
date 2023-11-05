<template>
  <Drawer
    :visible="visible"
    title="订单咨询记录"
    :width="1200"
    @close="close"
    :bodyStyle="{ background: '#f2f3f5' }"
  >
    <stagingLayout class="w-full !max-w-initial !min-w-initial" />
  </Drawer>
</template>

<script lang="ts" setup>
  import { Drawer } from 'ant-design-vue';
  import stagingLayout from '/@/views/staging/staging/layout.vue';

  defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits({
    'update:visible': (val: boolean) => val,
  });

  function close() {
    emits('update:visible', false);
  }
</script>
