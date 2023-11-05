<template>
  <div class="w-77 h-full border border-solid border-#F0F0F0 relative pb-19 flex flex-col">
    <div class="h-14 px-4 leading-14 text-15px font-bold border-b border-gray-100 cursor-pointer"
      >公司/单位筛选</div
    >
    <div class="flex-1 overflow-y-auto">
      <div
        class="flex items-center py-3 cursor-pointer px-4 relative"
        :class="{ 'bg-#EBF3FF': !value }"
        @click="selectLawFirm(0)"
      >
        <img src="/src/assets/images/law-firm-all.png" class="w-10 h-10 rounded-full" />
        <div class="flex-1 ml-3">全部公司/单位</div>
        <div class="border-b border-gray-100 absolute bottom-0 w-68"></div>
      </div>
      <div
        class="flex items-center py-3 cursor-pointer px-4 relative"
        :class="{ 'bg-#EBF3FF': value === item.law_firm_id }"
        v-for="item in lawFirmList"
        :key="item.law_firm_id"
        @click="selectLawFirm(item.law_firm_id)"
      >
        <img :src="item.logo" class="w-10 h-10 rounded-full" />
        <div class="flex-1 ml-3">{{ item.name }}</div>
        <div class="border-b border-gray-100 absolute bottom-0 w-68"></div>
      </div>
    </div>
    <div class="absolute bottom-0 left-0 p-4 w-full">
      <div class="text-center text-xs text-gray-400 mb-2">目前仅法律咨询师需要设置单位 </div>
      <a-button
        pre-icon="ant-design:plus-outlined"
        type="dashed"
        class="w-full !border-#1890FF !text-#1890FF"
        @click="router.push({ name: 'BusinessSetting' })"
        >添加单位</a-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getPracticeUnitNoPageList } from '/@/api/serviceStaff/business';
  import { useRouter } from 'vue-router';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';

  defineProps({
    value: {
      type: Number,
      default: 0,
    },
  });

  const emits = defineEmits({
    'update:value': (id: number) => id,
    change: (id: number) => id,
  });

  const router = useRouter();
  const lawFirmList = ref<{ law_firm_id: number; logo: string; name: string }[]>([]);
  const loading = ref(false);

  function getLawFirmList() {
    loading.value = true;
    getPracticeUnitNoPageList()
      .then((res) => {
        lawFirmList.value = res;
        // if (res.length) {
        //   const id = res[0].law_firm_id;
        //   emits('update:value', id);
        //   emits('change', id);
        // }
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function selectLawFirm(id) {
    emits('update:value', id);
    emits('change', id);
  }
  onMountedOrActivated(() => {
    getLawFirmList();
  });
</script>
