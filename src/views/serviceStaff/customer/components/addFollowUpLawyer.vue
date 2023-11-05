<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="700"
    :min-height="400"
    title="添加跟进咨询师"
    destroyOnClose
  >
    <div>
      <div>
        <Checkbox class="!ml-[13px]" v-model:checked="checkValue" @change="changeHandler" />
        <span class="ml-2">仅查看无客服跟进咨询师</span></div
      >
      <BasicTable @register="registerTable">
        <template #lawyer="{ record }">
          <div class="flex items-center justify-center text-left">
            <img
              v-if="record.consultant_avatar?.image_url"
              :src="record.consultant_avatar?.image_url"
              class="rounded-full flex-shrink-0 w-5 h-5"
            />
            <span class="pl-2">{{ record.name }}</span>
          </div>
        </template>
        <template #fw="{ record }">
          <div
            >{{ record.is_phone ? '电话咨询' : ''
            }}{{ record.is_phone && record.is_online_consultant ? '、' : ''
            }}{{ record.is_online_consultant ? '图文咨询' : '' }}</div
          >
        </template>
      </BasicTable>
    </div>
    <template #footer>
      <div class="flex justify-center">
        <a-button @click="closeModal">取消</a-button>
        <a-button class="ml-8" type="primary" @click="addSbwy">确定</a-button>
      </div>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Checkbox, message } from 'ant-design-vue';
  import { BasicTable, useTable, BasicColumn, defaultTableProps } from '/@/components/Table';
  import {
    getCustomerBindConsultant,
    customerBindOrUnBindConsultant,
  } from '/@/api/customerService/list';

  const emits = defineEmits(['onEdit']);

  const checkValue = ref(false);
  const customer_id = ref(0);
  const dataSource = ref();
  const [register, { closeModal }] = useModalInner((data) => {
    customerBindConsultant();
    customer_id.value = data.customer_id;
    console.log('data', data);
  });

  watch(
    () => checkValue.value,
    () => {
      customerBindConsultant();
    },
  );

  function customerBindConsultant() {
    getCustomerBindConsultant({
      type: +checkValue.value,
    }).then((res) => {
      console.log('res', res);
      dataSource.value = res;
      console.log('dataSource', dataSource.value);
    });
  }

  function addSbwy() {
    customerBindOrUnBindConsultant({
      consultant_id: selectedRowKeys.value,
      customer_id: customer_id.value,
      is_delete: 0,
    }).then(() => {
      closeModal();
      message.success('绑定成功');
      emits('onEdit');
    });
  }

  const columns: BasicColumn[] = [
    {
      title: '咨询师',
      dataIndex: 'name',
      slots: { customRender: 'lawyer' },
    },
    {
      title: '咨询服务',
      dataIndex: 'fw',
      slots: { customRender: 'fw' },
    },
    {
      title: '更进客服',
      dataIndex: 'customer_name',
    },
  ];
  const selectedRowKeys = ref<number[]>();
  function disableCheckd(record) {
    return {
      disabled: record.customer_name !== '',
    };
  }
  // };
  const [registerTable] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'consultant_id',
    pagination: false,
    expandRowByClick: true,
    immediate: false,
    maxHeight: 420,
    scroll: { x: 200 },
    // disabled: ,
    rowSelection: {
      // @ts-ignore
      onChange(keys: number[]) {
        selectedRowKeys.value = keys;
      },
      getCheckboxProps: disableCheckd,
    },
    dataSource: dataSource,
  });

  function changeHandler(e) {
    console.log('触发', e);
  }
</script>
