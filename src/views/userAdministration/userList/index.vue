<template>
  <PageWrapper
    :content-full-height="!consultantId"
    contentBackground
    :content-class="consultantId ? 'min-h-140' : ''"
  >
    <template #headerContent>
      <div class="bg-white p-4 pb-2 block md:flex items-center justify-between">
        <BasicForm @register="registerForm" />
      </div>
    </template>
    <BasicTable @register="registerTable">
      <template #user="{ record }">
        <div class="flex flex-col items-center justify-center">
          <img :src="record.headimg_url" class="w-[22px] h-[22px] rounded-1/2 bg-gray-300" />
          <span class="text-[14px] mt-1">{{ record.nickname }}</span>
        </div>
      </template>
      <template #mark="{ record }">
        <div v-if="record.is_mark === 1">
          <Badge status="success" />
          <span class="text-[14px]">已标记</span>
        </div>
        <div v-else>
          <Badge status="error" />
          <span class="text-[14px]">未标记</span>
        </div>
      </template>
      <template #label="{ record }">
        <div class="flex justify-center" v-if="record.tag_name && record.tag_name.length">
          <div
            v-for="item in record.tag_name.slice(0, 2)"
            :key="item"
            class="px-2 py-[2px] border-1 border-[#ADC6FF] bg-[#F0F5FF] text-[#2F54EB] leading-5 text-[12px] mr-2 rounded-[2px] whitespace-nowrap"
          >
            {{ item }}
          </div>
          <Popover placement="top">
            <template #content>
              <div class="flex">
                <div
                  v-for="item in record.tag_name"
                  :key="item"
                  class="px-2 py-[2px] border-1 border-[#ADC6FF] bg-[#F0F5FF] text-[#2F54EB] leading-5 text-[12px] mr-2 rounded-[2px]"
                >
                  {{ item }}
                </div>
              </div>
            </template>
            <div class="whitespace-nowrap" v-if="record.tag_name.length > 2"
              >共{{ record.tag_name.length }}个</div
            >
          </Popover>
        </div>
        <div class="text-[14px] text-black text-opacity-85" v-else>-</div>
      </template>
      <!-- 咨询次数 -->
      <template #ConsultationFrequency="{ record }">
        <span v-if="record" class="text-black text-[14px]">{{ record.consultings_count }}</span>
        <span class="text-[14px] text-black text-opacity-85" v-else>-</span>
      </template>
      <!-- 标记记录 -->
      <template #MarkRecord="{ record }">
        <a
          v-if="record.consultant_user_count"
          class="text-[#1890FF] text-[14px]"
          @click="MarkRecordFun(record)"
          >{{ record.consultant_user_count }}</a
        >
        <span class="text-[14px] text-black text-opacity-85" v-else>-</span>
      </template>
      <template #action="{ record }">
        <div class="flex justify-center text-[#1890FF] text-[14px]">
          <a @click="viewRecords(record)">查看记录</a>
        </div>
      </template>
    </BasicTable>
    <MarkRecord
      :MarkRecordData="MarkRecordData"
      @register="register"
      :curriculumId="curriculumId"
      width="600px"
    />
    <!-- <ConsultationRecordsModel @register="registerRecords" /> -->
    <RecordDrawer v-model:visible="visible" @update:visible="resetStaging" />
  </PageWrapper>
</template>

<script lang="ts" setup name="TodayOrder">
  import { ref } from 'vue';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { PageWrapper } from '/@/components/Page';
  import { Badge, Popover } from 'ant-design-vue';
  import { schemas, tableColumns } from './listForm';
  import { BasicForm, useForm, defaultFormProps } from '/@/components/Form';
  import MarkRecord from './components/MarkRecord.vue';
  import { useDebounceFn } from '@vueuse/core';
  import { useModal } from '/@/components/Modal';
  // import ConsultationRecordsModel from './components/ConsultationRecordsModel.vue';
  import { BasicTable, useTable, defaultTableProps } from '/@/components/Table';
  import { getConsultantClientList } from '/@/api/customer/list';
  import { StagingMode } from '/@/api/staging/model/enum';
  import { useStagingStore } from '/@/store/modules/staging';
  import RecordDrawer from './components/RecordDrawer.vue';

  const props = defineProps({
    consultantId: {
      type: Number,
    },
  });

  const [register, { openModal: openMarkModal }] = useModal();
  // const [registerRecords, { openModal: openAddFollowUpModal }] = useModal();

  const formModel = ref();
  const MarkRecordData = ref();
  const curriculumId = ref();
  const StagingStore = useStagingStore();
  const visible = ref(false);

  const submitFn = useDebounceFn(() => {
    console.log('getFieldsValue', getFieldsValue());
    formModel.value = getFieldsValue();
    reload();
  }, 300);

  const [registerForm, { submit, getFieldsValue }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: submitFn,
    fieldMapToTime: [['time', ['begin_time', 'end_time'], 'YYYY-MM-DD HH:mm:ss']],
  });

  async function viewRecords(record) {
    console.log('record', record);
    StagingStore.mode = StagingMode.custom;
    await StagingStore.getCustomServeList({
      user_id: record.consultanting.user_id,
      page: 1,
      page_size: 100,
    });
    // StagingStore.changeCurrentServe(data[0]);
    visible.value = true;
  }

  function resetStaging(val) {
    if (!val) {
      StagingStore.changeCurrentServe(undefined);
    }
  }
  // function ConsultationFrequencyFun(record) {
  //   openAddFollowUpModal(true, {
  //     user_id: record.user_id,
  //   });
  // }
  function MarkRecordFun(record) {
    console.log('record', record);

    openMarkModal(true, {
      user_id: record.user_id,
    });
  }

  // const dataSource = ref([]);

  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    rowKey: 'id',
    columns: tableColumns,
    // dataSource: dataSource.value,
    immediate: false,
    api: () => {
      return getConsultantClientList({ ...formModel.value, consultant_id: props.consultantId });
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  onMountedOrActivated(() => {
    submit();
  });
</script>
