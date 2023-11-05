<template>
  <div class="phone-bg w-375px h-750px pt-25 rounded-60px">
    <div class="px-21px min-h-50 -z-999">
      <img
        :src="formData.group_image"
        alt=""
        class="h-50 w-full object-cover"
        v-if="formData.group_image"
      />
      <div v-else class="flex items-center pt-15 justify-center text-3xl text-[#86909C]">
        请上传团队图片
      </div>
    </div>
    <div class="px-8 -mt-10 z-50 overflow-auto h-115 relative">
      <div class="bg-#f6f6f6 rounded">
        <TeamCard :formData="formData" :domainOption="domainOption" />
        <LawyerList
          v-if="lawyerList.length"
          :formData="formData"
          :lawyerList="lawyerList"
          :positionName="positionName"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import TeamCard from './TeamCard.vue';
  import LawyerList from './LawyerList.vue';
  import type { PropType } from 'vue';
  import { ConsultantItemModel } from '/@/api/serviceStaff/model/consultant';

  defineProps({
    formData: {
      type: Object as any,
      default: () => {},
    },
    domainOption: {
      type: Array as any,
      default: () => [],
    },
    lawyerList: {
      type: Array as PropType<ConsultantItemModel[]>,
      default: () => [],
    },
    positionName: {
      type: String,
      default: '主任咨询师',
    },
  });
</script>
<style lang="scss" scoped>
  .phone-bg {
    background:
      url('/src/assets/images/iPhone-bg.png') no-repeat 0 0 / 100%,
      #f6f6f6;
  }
</style>
