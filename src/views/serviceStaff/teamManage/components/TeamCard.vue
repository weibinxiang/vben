<script lang="ts" setup>
  import { computed } from 'vue';

  const props = defineProps({
    formData: {
      type: Object as any,
      default: () => {},
    },
    domainOption: {
      type: Array as any,
      default: () => [],
    },
  });
  const domainList = computed(() => {
    return props.domainOption.filter((item) => {
      if (props.formData.group_domain.includes(item.domain_id)) {
        return item;
      }
    });
  });

  const serviceCount = computed(() => {
    let count = props.formData.virtual_service_count;
    if (count > 10000) {
      count = Math.floor(props.formData.virtual_service_count / 10000) + '万';
    }
    return count;
  });
</script>

<template>
  <div class="bg-white rounded px-2 py-2 num-font z-50 relative">
    <div class="flex">
      <span class="text-[#1D2129] font-semibold text-base mr-6px">
        {{ formData?.group_name }}
      </span>
      <div
        class="rounded text-[#165DFF] border-[#165DFF] border-1px bg-[#E8F3FF] flex items-center text-xs px-3px py-1px"
      >
        <img
          class="flex-shrink-0 mr-6px w-14px h-14px"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/auth_blue.png"
        />
        已认证
      </div>
    </div>
    <div
      class="flex items-center justify-between mt-2 text-center border-b-[2rpx] border-[#f3f3f3] pb-4"
    >
      <div>
        <div class="text-[#002BB8] font-bold text-2xl mb-6px">100%</div>
        <div class="text-[#86909C] text-xs">综合评价率</div>
      </div>
      <div class="bg-[#F3F3F3] w-1px h-16px"></div>
      <div>
        <div class="mb-6px">
          <span class="font-bold text-2xl">{{ formData.group_num }}</span>
          <span class="text-xs">人</span></div
        >
        <div class="text-[#86909C] text-xs">团队成员</div>
      </div>
      <div class="bg-[#F3F3F3] w-1px h-16px"></div>
      <div>
        <div class="mb-6px">
          <span class="font-bold text-2xl">{{ serviceCount }}</span>
          <span class="text-xs">人</span></div
        >
        <div class="text-[#86909C] text-xs">服务人数</div>
      </div>
      <div class="bg-[#F3F3F3] w-1px h-16px"></div>
      <div>
        <div class="mb-6px">
          <span class="font-bold text-2xl">{{ formData.case_duration }}</span>
          <span class="text-xs">例</span>
        </div>
        <div class="text-[#86909C] text-xs">成功案例</div>
      </div>
    </div>
    <div class="flex flex-wrap items-center mt-1 -mr-4">
      <div class="flex items-center pb-2">
        <img
          class="mr-1 w-3 h-3 text-xs"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/like-icon.png"
        />
        招牌领域：
      </div>
      <div
        v-for="(item, index) in domainList"
        :key="index"
        class="bg-[#EFEFEF] rounded py-3px px-3 text-[#273240] mb-2 mr-2 text-xs"
      >
        {{ item.domain }}
      </div>
    </div>
  </div>
</template>
