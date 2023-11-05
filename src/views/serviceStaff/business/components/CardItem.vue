<template>
  <div class="flex p-3 border border-solid border-#F0F0F0 w-88 rounded-sm mr-4 mb-4">
    <div class="w-22 h-22 flex-shrink-0">
      <img :src="item.logo" alt="" class="w-full h-full block" />
    </div>
    <div class="pl-3 flex flex-col justify-between flex-1 overflow-hidden">
      <div>
        <div class="text-base font-bold truncate">{{ item.name }}</div>
        <div class="flex text-#8c8c8c mt-1">
          <div>{{ item.province }} | {{ item.city }}</div>
          <div class="ml-10">共{{ item.consultant_count }}人</div>
        </div>
      </div>
      <div class="flex justify-between items-center">
        <div
          >状态：
          <Badge
            :color="status[item.status]?.color"
            :text="status[item.status]?.text"
            :style="{ color: status[item.status]?.color }"
        /></div>
        <div>
          <a-button
            type="link"
            class="!px-0 mr-2"
            @click="router.push({ name: 'BusinessSetting', params: { id: item.law_firm_id } })"
            >编辑</a-button
          >
          <!-- <a-button type="link" class="!px-0">详情</a-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Badge } from 'ant-design-vue';
  import { PropType } from 'vue';
  import { BusinessItem } from '/@/api/serviceStaff/model/business';
  import { useRouter } from 'vue-router';

  defineProps({
    item: {
      type: Object as PropType<BusinessItem>,
      default: () => ({}),
    },
  });

  const router = useRouter();

  const status = [
    { text: '禁用', color: '#8c8c8c' },
    { text: '正常', color: '#52C41A' },
    { text: '审核中', color: '#1890FF' },
    { text: '审核失败', color: '#FF5500' },
  ];
</script>
