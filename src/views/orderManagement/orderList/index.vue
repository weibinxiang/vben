<template>
  <PageWrapper
    :content-full-height="!consultantId"
    content-background
    fixedHeight
    :content-class="consultantId ? 'min-h-140' : ''"
  >
    <template #headerContent>
      <div class="bg-white p-4 pb-2 block md:flex items-center justify-between">
        <BasicForm @register="registerForm">
          <template #submitBefore>
            <a-button @click="exportClick" class="mr-2">导出查询结果</a-button>
          </template>
          <template #formFooter>
            <a-button
              type="link"
              class="flex justify-center items-center text-#1890FF !pl-0"
              @click="senior = !senior"
              >高级筛选项<img
                class="w-4 h-4 origin-center duration-300 ml-1"
                :class="senior ? 'rotate-180' : 'rotate-0'"
                src="../../../assets/images/Icon-Wrapper.png"
                alt=""
            /></a-button>
          </template>
        </BasicForm>
      </div>
    </template>
    <div class="bg-light-50 block h-full md:flex">
      <div class="pt-3 h-full overflow-y-auto">
        <BasicTable @register="registerTable" class="order-table" :striped="false">
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'action'">{{ column.customTitle }}</template>
            <template v-else>
              <div class="flex h-14 items-center">
                <div
                  v-for="(item, index) in tableColumn"
                  :key="index"
                  :style="item.width ? `width: ${item.width}px` : 'flex: 1'"
                  >{{ item.title }}</div
                >
              </div>
            </template>
          </template>
          <template #row="{ record }">
            <TabelColumn :tableColumn="tableColumn">
              <template #rowHead>
                <div class="w-full bg-gray-100 h-10 flex items-center px-2">
                  <div>订单编号：{{ record.out_trade_no }}</div>
                  <div class="ml-4">支付时间：{{ record.pay_time }}</div>
                  <div class="ml-20">平台：抖音</div>
                </div>
              </template>
              <template #name>
                <div class="flex pl-1">
                  <img
                    class="w-15 h-15 mr-2 rounded-10px flex-shrink-0 object-cover"
                    :src="record.consultant_info?.consultant_avatar?.image_url"
                    alt=""
                  />
                  <div class="flex-1 text-left">
                    <div class="font-bold text-black text-opacity-85 leading-[22px]">{{
                      record.consultant_info?.name
                    }}</div>
                    <div class="font-medium text-#4080ff leading-22px">{{
                      ['', '电话咨询', '在线咨询', '一元咨询'][record.sku_type]
                    }}</div>
                    <div class="font-medium text-#4080ff leading-22px"
                      >{{ Number(record.pay_amount / 100).toFixed(2) }}元/{{
                        record.sku_duration
                      }}分钟</div
                    >
                  </div>
                </div>
              </template>
              <template #userInfo>
                <div class="flex justify-center">
                  <img
                    class="w-15 h-15 mr-2 rounded-full object-cover"
                    :src="record.user_info.headimg_url || UserAvatar"
                    alt=""
                  />
                  <div class="text-sm flex flex-col justify-center">
                    <div class="font-bold text-black text-opacity-85 leading-22px">{{
                      record.user_info.nickname
                    }}</div>
                    <div class="font-medium text-#4080ff leading-22px">{{
                      record.order_phone?.phone
                    }}</div>
                  </div>
                </div>
              </template>
              <template #payAmount>{{ Number(record.pay_amount / 100).toFixed(2) }} </template>
              <template #status>{{ orderState[record.status] }} </template>
              <template #isEnd>{{ record.is_end ? '已结算' : '未结算' }} </template>
              <template #phaseStatus>
                <Tag
                  v-if="ServeStatus.wait === getServeStatus(record.consulting_info.phase)"
                  color="warning"
                  >待接单</Tag
                >
                <Tag
                  v-else-if="ServeStatus.ongoing === getServeStatus(record.consulting_info.phase)"
                  color="processing"
                  >咨询中</Tag
                >
                <Tag
                  v-else-if="ServeStatus.success === getServeStatus(record.consulting_info.phase)"
                  color="success"
                  >已完成</Tag
                >
                <Tag v-else-if="ServeStatus.refund === getServeStatus(record.consulting_info.phase)"
                  >已取消</Tag
                >
              </template>
              <template #notes>
                <template v-if="record.order_remark?.remark">
                  <div class="text-sm font-normal leading-22px truncate">{{
                    record.order_remark?.remark
                  }}</div>
                  <a-button
                    type="link"
                    @click="
                      openRemarksModal(true, {
                        order_id: record.id,
                        content: record.order_remark?.remark,
                      })
                    "
                    >查看/编辑</a-button
                  >
                </template>
                <template v-else>
                  <a-button
                    type="link"
                    @click="
                      openRemarksModal(true, {
                        order_id: record.id,
                        content: record.order_remark?.remark,
                      })
                    "
                    >添加备注</a-button
                  >
                </template>
              </template>
              <template #action>
                <a-button
                  type="link"
                  @click="openRecord(record)"
                  :disabled="record.sku_type === ConsultingType.dollar"
                  >查看记录</a-button
                >
              </template>
            </TabelColumn>
          </template>
        </BasicTable>
      </div>
    </div>
    <RemarksModal @register="registerRemarks" @on-del="reload" />
    <RecordDrawer v-model:visible="visible" @update:visible="resetStaging" />
  </PageWrapper>
</template>

<script lang="ts" setup name="OrderList">
  import { ref } from 'vue';
  import { Tag } from 'ant-design-vue';
  import { BasicForm, useForm, defaultFormProps } from '/@/components/Form';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { BasicTable, useTable, defaultTableProps } from '/@/components/Table';
  import { useDebounceFn } from '@vueuse/core';
  import { PageWrapper } from '/@/components/Page';
  import { useOrderData } from './index';
  import { useModal } from '/@/components/Modal';
  import RemarksModal from './components/RemarksModal.vue';
  import { getOrderList } from '/@/api/order/list';
  import { ServeStatus, StagingMode, ConsultingType } from '/@/api/staging/model/enum';
  import { useStagingStore } from '/@/store/modules/staging';
  import { downloadByUrl } from '/@/utils/file/download';
  import TabelColumn from './components/TabelColumn.vue';
  import RecordDrawer from './components/RecordDrawer.vue';
  import UserAvatar from '/@/assets/images/avatar/user.jpg';

  const props = defineProps({
    consultantId: {
      type: Number,
    },
  });

  const [registerRemarks, { openModal: openRemarksModal }] = useModal();
  const formModel = ref();
  const StagingStore = useStagingStore();
  const { getServeStatus, changeCurrentServe } = StagingStore;
  const visible = ref(false);
  const exportLoading = ref(false);
  let queryParams: any = {};
  const { schemas, senior, columns, tableColumn, orderState } = useOrderData({
    consultantId: props.consultantId,
  });

  function openRecord(record) {
    console.log('record', record);
    StagingStore.mode = StagingMode.order;
    changeCurrentServe({
      consulting_id: record.consulting_info?.consulting_id,
      user_headimg_url: record.user_info.headimg_url,
      user_nickname: record.user_info.nickname,
    });
    visible.value = true;
  }

  function resetStaging(val) {
    if (!val) {
      changeCurrentServe(undefined);
    }
  }

  const submitFn = useDebounceFn(() => {
    formModel.value = getFieldsValue();
    reload();
  }, 300);

  const [registerForm, { submit, getFieldsValue }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: submitFn,
    fieldMapToTime: [['time', ['start_time', 'end_time'], 'YYYY-MM-DD HH:mm:ss']],
  });
  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'id',
    expandRowByClick: true,
    immediate: false,
    api: (params) => {
      queryParams = { ...params, ...formModel.value };
      return getOrderList(queryParams);
    },
  });

  function exportClick() {
    exportLoading.value = true;
    getOrderList({ ...queryParams, is_export: 1 })
      .then((res) => {
        downloadByUrl({ url: res });
      })
      .finally(() => {
        exportLoading.value = false;
      });
  }

  onMountedOrActivated(() => {
    submit();
  });
</script>

<style lang="less">
  .order-table {
    .ant-table-cell {
      padding: 0 !important;
    }
  }
</style>
