<template>
  <Drawer
    title="批量引用评价库"
    width="80%"
    destroyOnClose
    :bodyStyle="{ paddingBottom: '80px' }"
    @close="closeDrawer"
  >
    <div class="px-[36px]">
      <div
        class="w-full h-[40px] bg-[#E6F7FF] px-[16px] border-1 border-[#91D5FF] border-solid flex items-center text-[rgba(0,0,0,85%)] text-[14px]"
        ><InfoCircleFilled
          style="margin-right: 12px; color: #1890ff; font-size: 14px"
        />您可以选择直接上传模版也可在模版内编辑，变更后不会影响原模版库的内容</div
      >
      <BasicTable
        @register="registerTable"
        :scroll-x="true"
        :width="1200"
        :rowSelection="rowSelection"
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'action'">{{ column.customTitle }}</template>
          <template v-else>
            <div class="flex h-6 items-center">
              <div
                v-for="(item, index) in modalTableColumn"
                :key="index"
                :style="item.width ? `width: ${item.width}px` : 'flex: 1'"
                >{{ item.title }}</div
              >
            </div>
          </template>
        </template>
        <template #row="{ record }">
          <TabelColumn>
            <template #content>
              <a-textarea
                v-model:value="record.content"
                allowClear
                showCount
                :autosize="true"
                :maxlength="50"
              />
              <div class="flex items-center mt-5">
                <div v-for="i in record.img" :key="i" class="mr-[10px]">
                  <Image :width="104" :height="104" :src="i" alt="" />
                </div>
              </div>
            </template>
            <template #comment_date>
              <DatePicker
                v-model:value="record.comment_date"
                show-time
                format="YYYY-MM-DD HH:mm:ss"
                valueFormat="YYYY-MM-DD HH:mm:ss"
              />
            </template>
            <template #star_level>
              <RadioGroup v-model:value="record.star_level">
                <RadioButton :value="5">5颗星</RadioButton>
                <RadioButton :value="4">4颗星</RadioButton>
              </RadioGroup>
            </template>
            <template #sku_type>
              <RadioGroup v-model:value="record.sku_type">
                <RadioButton :value="1">电话咨询</RadioButton>
                <RadioButton :value="2">图文咨询</RadioButton>
              </RadioGroup>
            </template>
            <template #is_show>
              <Switch v-model:checked="record.is_show" :checkedValue="1" :unCheckedValue="0" />
            </template>
            <template #is_top>
              <Switch v-model:checked="record.is_top" :checkedValue="1" :unCheckedValue="0" />
            </template>
          </TabelColumn>
        </template>
      </BasicTable>
    </div>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '20px 80px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="emits('cancel')">取消</a-button>
      <a-button type="primary" @click="submit">确认上传</a-button>
    </div>
  </Drawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicTable, useTable, defaultTableProps, TableRowSelection } from '/@/components/Table';
  import { columns, modalTableColumn } from '../index';
  import { InfoCircleFilled } from '@ant-design/icons-vue';
  import TabelColumn from './importTabelColumn.vue';
  import { getOrderCommentModelList, saveOrderCommentBatch } from '/@/api/order/list';
  import {
    Image,
    Switch,
    Drawer,
    RadioGroup,
    RadioButton,
    DatePicker,
    message,
  } from 'ant-design-vue';

  const emits = defineEmits(['cancel', 'success']);
  const props = defineProps({
    consultantId: {
      default: 0,
      type: Number,
    },
  });
  const selectedCommentId = ref<(string | number)[]>([]);
  const selectedRowsData = ref<any[]>([]);
  const [registerTable] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'zx_order_comment_model_id',
    expandRowByClick: true,
    immediate: true,
    api: (params) => {
      return getOrderCommentModelList({
        ...params,
      });
    },
  });
  const rowSelection = ref<Partial<TableRowSelection>>({
    onChange: (selectedRowKeys: (string | number)[], selectedRows) => {
      selectedCommentId.value = selectedRowKeys;
      selectedRowsData.value = selectedRows;
    },
  });
  function submit() {
    if (!selectedCommentId.value.length) {
      message.info('请勾选要导入的评价');
      return;
    }
    // let datasourse = getDataSource();
    selectedRowsData.value.forEach((item) => {
      item.created_at = item.comment_date;
    });
    saveOrderCommentBatch({
      consultant_id: props.consultantId,
      query: selectedRowsData.value,
    }).then(() => {
      emits('success');
    });
  }
  function closeDrawer() {
    console.log('关闭');
  }
</script>
