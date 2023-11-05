<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="572"
    :min-height="400"
    title="该客户进行过多次咨询，请选择"
    :canFullscreen="true"
    destroyOnClose
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div class="h-[50vh]">
      <template v-if="listData.length">
        <LawyerList v-for="item in listData" :key="item?.user_id" :option="item" />
      </template>
    </div>
    <template #footer>
      <div class="text-right">
        <Pagination
          v-model:current="pageParams.page"
          :total="pageParams.total"
          :pageSize="pageParams.page_size"
          @change="onPageChange"
        />
      </div>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Pagination } from 'ant-design-vue';
  import LawyerList from './LawyerList.vue';
  import { getUserConsultingList } from '/@/api/customer/list';

  const listData = ref<any>([]);
  const user_id = ref();
  const pageParams = ref({
    page: 1,
    total: 0,
    page_size: 10,
  });

  function onPageChange(e: number) {
    pageParams.value.page = e;
    consultantClientList();
  }

  function consultantClientList() {
    getUserConsultingList({
      user_id: user_id.value,
      page: pageParams.value.page,
      page_size: pageParams.value.page_size,
    }).then((res) => {
      pageParams.value.total = res.total;
      listData.value = res.data;
    });
  }

  const [register] = useModalInner((data) => {
    user_id.value = data.user_id;
    consultantClientList();
  });
</script>
