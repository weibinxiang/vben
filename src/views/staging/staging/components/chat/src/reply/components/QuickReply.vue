<template>
  <Popover :visible="contentVisible" placement="topLeft" overlayClassName="quick-reply-popover">
    <template #content>
      <div class="w-546px">
        <div
          class="flex justify-between items-center quick-title-bg px-4 h-34px border-[#f3f5f6] border-b-1"
        >
          <div class="text-base text-[#333333] font-medium">快捷回复</div>
        </div>
      </div>
      <div class="px-4 pt-4">
        <div class="flex items-center pb-4" v-for="item in filterList" :key="item.quick_reply_id">
          <div class="w-2 h-2 rounded-full bg-[#D9D9D9] mr-2"></div>
          <div class="flex-1 text-ellipsis cursor-pointer" @click="selectQuick(item)">
            {{ item.reply_content }}
          </div>
        </div>
      </div>
    </template>
    <slot> </slot>
  </Popover>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Popover } from 'ant-design-vue';
  import { QuickReplyList } from '/@/api/staging/model/customerModel';
  import type { PropType } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  const contentVisible = ref(false);
  const filterList = ref<QuickReplyList[]>([]);
  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    textList: {
      type: Array as PropType<QuickReplyList[]>,
      default: () => [],
    },
    isWhatch: {
      type: Boolean,
      default: true,
    },
  });
  const emits = defineEmits(['update:value', 'selectText']);
  watch(
    () => props.value,
    (keyWord) => {
      if (props.isWhatch) {
        watchInput(keyWord);
      }
    },
  );
  const watchInput = useDebounceFn((keyWord) => {
    if (keyWord) {
      contentVisible.value = true;
      filterList.value = props.textList
        .filter((item) => {
          if (item.reply_content.indexOf(keyWord) !== -1) {
            return item;
          }
        })
        .slice(0, 3);
      if (!filterList.value.length) {
        contentVisible.value = false;
      }
    } else {
      contentVisible.value = false;
    }
  }, 200);
  function selectQuick(item) {
    emits('update:value', item.reply_content);
    emits('selectText');
    contentVisible.value = false;
  }
</script>
<style lang="less">
  .quick-reply-popover {
    .ant-popover-inner-content {
      padding: 0 !important;
    }
  }

  .quick-title-bg {
    background: linear-gradient(90deg, rgb(233 246 255 / 57%) -0.11%, rgb(229 244 255 / 0%) 99.84%);
  }
</style>
