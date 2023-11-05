<template>
  <div
    class="text-[14px] bg-[#F7F8FA] border-[0.5px] border-[#E5E6EB] font-medium text-black text-opacity-85 rounded-[4px] p-3 mt-6"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <img class="w-10 h-10 rounded-full" :src="option.user?.headimg_url" alt="" />
        <div class="ml-[10px] font-medium"
          >{{ option.user?.nickname }}（{{ option.role === 'customer' ? '客服' : '咨询师' }}）</div
        >
      </div>
      <div class="flex items-center">
        <div class="text-[12px] text-[#86909C]">{{ option.created_at }}</div>
      </div>
    </div>
    <div class="flex items-center mt-3">
      <div class="font-normal text-[#86909C] leading-[22px]">标记标签：</div>
      <div
        class="px-2 py-[1px] bg-[#F0F5FF] border-1 border-[#ADC6FF] text-[#2F54EB] ml-2 rounded-[2px] leading-[20px]"
        v-for="item in option.tag_name_arr"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
    <div class="flex items-start mt-3">
      <div class="font-normal text-[#86909C] leading-[22px] whitespace-nowrap">标记备注：</div>
      <div class="ml-2">{{ option.remark }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps({
    option: {
      type: Object,
      default: {} as Object,
    },
  });
</script>
