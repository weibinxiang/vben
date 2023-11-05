<template>
  <PageWrapper content-full-height content-background fixedHeight>
    <template #headerContent>
      <div class="bg-white p-4 pb-2 block md:flex items-center justify-between">
        <BasicForm @register="registerForm" />
      </div>
    </template>
    <div class="bg-light-50 block h-full">
      <div class="pt-3 h-full">
        <div class="flex justify-between p-2">
          <div>客服人员可以在客服工作台查看到其跟进咨询师的咨询订单</div>
          <a-button
            type="primary"
            @click="
              () => {
                openSettingModal(true, {});
              }
            "
            >新增客服人员</a-button
          >
        </div>
        <BasicTable @register="registerTable">
          <template #spread="{ record }">
            <div class="flex flex-col items-center justify-center">
              <img
                v-if="record.avatar"
                :src="record.avatar"
                class="w-[22px] h-[22px] rounded-full flex-shrink-0"
              />
              <span class="mt-1">{{ record.name }}</span>
            </div>
          </template>
          <!-- 跟进咨询师 -->
          <template #AdvancedLawyer="{ record }">
            <a
              @click="
                () => {
                  openFollowUpModal(true, {
                    customer_id: record.customer_id,
                  });
                }
              "
              >{{ record.customer_consultant_count }}</a
            >
          </template>
          <template #ServiceOrders="{ record }">
            <a
              @click="
                () => {
                  openFollowUpModal(true, record);
                }
              "
              >查看</a
            >
          </template>
          <template #action="{ record }">
            <a @click="openSettingModal(true, { record })" class="ml-2">编辑</a>
            <!-- <a-button
              type="link"
              :disabled="record.customer_consultant_count"
              @click="del(record)"
              class="ml-2"
              >删除</a-button
            > -->
          </template>
        </BasicTable>
      </div>
    </div>
    <addCustomerModal @register="registerDetalis" @on-edit="onEdit" />
    <followUpLawyer @register="registerFollowUp" @on-edit="onEdit" />
  </PageWrapper>
</template>

<script lang="ts" setup name="manage">
  import { ref } from 'vue';
  import { useModal } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema, defaultFormProps } from '/@/components/Form';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { BasicTable, useTable, BasicColumn, defaultTableProps } from '/@/components/Table';
  import { useDebounceFn } from '@vueuse/core';
  import { PageWrapper } from '/@/components/Page';
  import addCustomerModal from './components/addCustomerModal.vue';
  import followUpLawyer from './components/followUpLawyer.vue';
  import { getCustomerList } from '/@/api/customerService/list';
  // import { message } from 'ant-design-vue';

  const [registerDetalis, { openModal: openSettingModal }] = useModal();
  const [registerFollowUp, { openModal: openFollowUpModal }] = useModal();
  const formModel = ref();

  function onEdit() {
    reload();
  }
  // function del(record) {
  //   console.log('删除', record);
  //   deleteCustomer({ customer_id: record.customer_id }).then(() => {
  //     reload();
  //     message.success('删除成功');
  //   });
  // }

  const schemas: FormSchema[] = [
    {
      field: 'search_key',
      label: '关键字',
      component: 'Input',
      componentProps: {
        placeholder: '输入名称或手机号',
      },
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      defaultValue: 1,
      componentProps: {
        options: [
          { label: '全部', value: 0 },
          { label: '启用', value: 1 },
          { label: '禁用', value: 2 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
      colProps: { lg: 24, md: 24 },
    },
  ];

  const submitFn = useDebounceFn(() => {
    formModel.value = getFieldsValue();
    reload();
  }, 300);

  const [registerForm, { submit, getFieldsValue }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: submitFn,
  });

  const columns: BasicColumn[] = [
    {
      title: '客服人员',
      dataIndex: 'name',
      slots: { customRender: 'spread' },
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    {
      title: '跟进咨询师',
      dataIndex: 'customer_consultant_count',
      slots: { customRender: 'AdvancedLawyer' },
    },
    // {
    //   title: '服务订单',
    //   dataIndex: 'consultant_role_id',
    //   slots: { customRender: 'ServiceOrders' },
    // },
    {
      title: '状态',
      dataIndex: 'status',
      format: (_, val) => {
        return val.status ? '启用' : '禁用';
      },
    },
  ];

  // const dataSource = ref([
  //   // {
  //   //   user: {
  //   //     headimg_url: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/animeFace/tpmwc3ewsjd.jpg',
  //   //     nickname: '李思思',
  //   //   },
  //   //   phone: '17652452356',
  //   //   bz: '这是一条备注，用来备注内容的。如果你有什么需要留言的，请填写这一条备注！',
  //   //   text: 1,
  //   //   label: ['仅咨询', '成案几率低'],
  //   //   source: '咨询订单',
  //   //   platform: '快手',
  //   //   num: 5,
  //   //   time: '2023-9-7 17:21',
  //   //   record: 3,
  //   // },
  // ]);

  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'id',
    expandRowByClick: true,
    scroll: { x: 800 },
    immediate: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 240,
      slots: { customRender: 'action' },
    },
    api: () => {
      return getCustomerList({
        ...(formModel.value || {}),
      });
    },
  });

  onMountedOrActivated(() => {
    submit();
  });
</script>
