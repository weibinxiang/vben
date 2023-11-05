<template>
  <div
    class="p-3 rounded-[4px] mb-6 bg-[#F7F8FA] border-[0.5px] border-[#E5E6EB] text-[14px] font-medium text-black text-opacity-85"
  >
    <div class="h-10 flex items-center justify-between">
      <div class="flex items-center">
        <img class="w-10 h-10 rounded-full" :src="option.user_detail?.headimg_url" alt="" />
        <div class="ml-[10px]">{{ option.user_detail?.nickname }}</div>
        <div
          class="ml-[10px] px-2 py-[2px] leading-[22px] font-semibold"
          :class="status[option.phase]?.style"
          >{{ status[option.phase]?.text }}</div
        >
      </div>
      <div class="flex items-center">
        <div class="text-[12px] text-[#86909C]">{{ option.created_at }}</div>
        <img class="w-[14px] h-[14px] ml-[5px]" src="../../../../assets/images/Right.png" alt="" />
      </div>
    </div>
    <div class="flex items-center mt-3">
      <div class="text-[16px] text-[1D2129] mr-2 font-semibold">{{
        option.order_detail?.sku_type === 1 ? '电话咨询' : '在线咨询'
      }}</div>
      <div class="text=[#4E5969] font-normal"
        >￥{{ option.jq }}/{{ option.order_detail?.sku_duration }}分钟</div
      >
      <div class="ml-4 flex">
        <div
          class="px-2 py-[2px] bg-[#EBEBEC] text-[#4E5969] ml-2 rounded-[4px]"
          v-if="option.domain"
        >
          {{ option.domain }}
        </div>
        <div
          class="px-2 py-[2px] bg-[#EBEBEC] text-[#4E5969] ml-2 rounded-[4px]"
          v-if="option.district"
        >
          {{ option.district }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  defineProps({
    option: {
      type: Object,
      default: {} as Object,
    },
  });
  const status = ref({
    0: {
      text: '已取消',
      style: 'bg-[#F2F3F5] text-[#595959]',
    },
    1: {
      text: '待服务',
      style: 'bg-[#FFF7E8] text-[#FF7D00]',
    },
    2: {
      text: '待服务',
      style: 'bg-[#FFF7E8] text-[#FF7D00]',
    },
    3: {
      text: '服务中',
      style: 'bg-[#E8FFEA] text-[#52C41A]',
    },
    4: {
      text: '服务中',
      style: 'bg-[#E8FFEA] text-[#52C41A]',
    },
    5: {
      text: '已完成',
      style: 'bg-[#E6F7FF] text-[#2F54EB]',
    },
    6: {
      text: '已完成',
      style: 'bg-[#E6F7FF] text-[#2F54EB]',
    },
  });
</script>
