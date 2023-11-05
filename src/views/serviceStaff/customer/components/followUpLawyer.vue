<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="600"
    :min-height="400"
    title="跟进咨询师管理"
    destroyOnClose
    :showCancelBtn="false"
    :showOkBtn="false"
  >
    <div>
      <div>配置跟进咨询师后，客服人员可以在工作台跟进咨询师的咨询订单</div>
      <div class="flex justify-between">
        <div class="flex items-center">
          <div>客服人员：</div>
          <img class="w-10 h-10" v-if="user?.avatar" :src="user.avatar" alt="" />
          <div>{{ user?.name || '暂无' }}</div>
        </div>
        <a-button
          type="primary"
          @click="
            () => {
              openAddFollowUpModal(true, { customer_id: user?.customer_id });
            }
          "
          >添加</a-button
        >
      </div>
      <BasicTable @register="registerTable">
        <template #lawyer="{ record }">
          <div class="flex items-center justify-center text-left">
            <img
              :src="record.consultant_avatar?.image_url"
              class="w-9 h-9 rounded-full flex-shrink-0"
            />
            <span class="pl-2">{{ record.name }}</span>
          </div>
        </template>
        <template #action="{ record }">
          <Popconfirm ok-text="确认" @confirm="hasGroupChange(record.consultant_id)">
            <template #title>
              <div>{{ user.name }} 不再跟进 {{ record.name }} 咨询师？</div>
            </template>
            <a href="">删除</a>
          </Popconfirm>
        </template>
      </BasicTable>
    </div>
    <addFollowUpLawyer @register="registerAdd" @on-edit="onEditFun" />
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
  import { BasicTable, useTable, BasicColumn, defaultTableProps } from '/@/components/Table';
  import { Popconfirm, message } from 'ant-design-vue';
  import addFollowUpLawyer from './addFollowUpLawyer.vue';
  import {
    getConsultantCustomerList,
    customerBindOrUnBindConsultant,
  } from '/@/api/customerService/list';

  const emits = defineEmits(['onEdit']);

  const [registerAdd, { openModal: openAddFollowUpModal }] = useModal();

  const dataSource = ref([]);
  const customer_id = ref();
  const user = ref({
    avatar: '',
    name: '',
    customer_id: '',
  });

  function onEditFun() {
    console.log('触发11111');

    consultantClientList();
    emits('onEdit');
  }

  function consultantClientList() {
    getConsultantCustomerList({
      customer_id: customer_id.value,
    }).then((res) => {
      console.log('res', res);
      dataSource.value = res?.consultant_list || [];
      user.value = res?.customer_info;
      console.log('dataSource', dataSource.value);
    });
  }

  const [register] = useModalInner((data) => {
    console.log('data', data);
    customer_id.value = data.customer_id;
    consultantClientList();
    // isEdit.value = !!data.isEdit;
  });

  const columns: BasicColumn[] = [
    {
      title: '咨询师',
      dataIndex: 'name',
      width: 120,
      slots: { customRender: 'lawyer' },
    },
  ];

  const [registerTable] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'id',
    pagination: false,
    expandRowByClick: true,
    scroll: { x: 200 },
    maxHeight: 300,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      slots: { customRender: 'action' },
    },
    dataSource: dataSource,
  });

  function hasGroupChange(consultant_id) {
    console.log('确认');
    customerBindOrUnBindConsultant({
      consultant_id: [consultant_id],
      customer_id: user.value.customer_id,
      is_delete: 1,
    }).then(() => {
      consultantClientList();
      message.success('删除成功');
      emits('onEdit');
    });
  }
</script>
