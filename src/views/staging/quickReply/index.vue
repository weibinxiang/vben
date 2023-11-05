<template>
  <PageWrapper contentFullHeight contentBackground>
    <BasicTable @register="registerTable">
      <template #form-advanceBefore>
        <a-button pre-icon="ant-design:plus-outlined" type="primary">新增快捷回复</a-button>
      </template>
      <template #label="{ record }">
        <div class="flex justify-center" v-if="record.tag_name">
          <div
            class="px-2 py-[2px] border-1 border-[#ADC6FF] bg-[#F0F5FF] text-[#2F54EB] leading-5 text-[12px] mr-2 rounded-[2px]"
          >
            {{ record.tag_name }}
          </div>
        </div>
      </template>
      <template #type="{ text }">
        <a-tag v-if="text === 1" color="success"> 支付订单 </a-tag>
        <a-tag v-else-if="text === 2" color="error"> 退款订单 </a-tag>
        <a-tag v-else-if="text === 4" color="error"> 抖音退款审核 </a-tag>
        <a-tag v-else color="processing"> 发货订单 </a-tag>
      </template>

      <template #status="{ record }">
        <a-button type="link" color="processing">禁用</a-button>
        <a-button type="link" color="processing">编辑</a-button>
        <a-button type="link" @click="delLabel(record)" :disabled="record.tag_user_num">
          删除
        </a-button>
      </template>
    </BasicTable>
    <!-- <addUserLabelModal @register="registerDetalis" @on-edit="onEditFun" /> -->
  </PageWrapper>
</template>

<script lang="ts" setup name="ExportRecord">
  // import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  // import { useModal } from '/@/components/Modal';
  // import { getExportListApi, retryExportApi } from '/@/api/order/order';
  import { BasicTable, useTable, BasicColumn, defaultTableProps } from '/@/components/Table';
  import { defaultFormProps } from '/@/components/Form';
  import { getConsultantUserTagList, delConsultantUserTag } from '/@/api/customer/list';
  import { message } from 'ant-design-vue';

  // const [registerDetalis, { openModal: openSettingModal }] = useModal();

  function delLabel(record) {
    delConsultantUserTag({ tag_id: record.consultant_user_tag_id }).then(() => {
      reload();
      message.success('删除成功');
    });
  }

  // function onEditFun() {
  //   reload();
  // }

  const tableColumns: BasicColumn[] = [
    {
      title: '回复内容',
      dataIndex: 'id',
      slots: { customRender: 'label' },
    },
    {
      title: '状态',
      width: 100,
      dataIndex: 'tag_user_num',
    },
    {
      title: '更新时间',
      width: 180,
      dataIndex: 'updated_at',
    },
    {
      title: '操作',
      dataIndex: 'status',
      width: 250,
      slots: { customRender: 'status' },
    },
  ];

  // const dataSource = ref([
  //   {
  //     user: {
  //       headimg_url: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/animeFace/tpmwc3ewsjd.jpg',
  //       nickname: '李思思',
  //     },
  //     phone: '17652452356',
  //     spread_name: 1,
  //     label: ['成案几率低'],
  //     source: '咨询订单',
  //     platform: '快手',
  //     num: 5,
  //     time: '2023-9-7 17:21',
  //     record: 3,
  //     bz: '好好好',
  //   },
  // ]);

  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    rowKey: 'id',
    columns: tableColumns,
    api: getConsultantUserTagList,
    useSearchForm: true,
    // dataSource: dataSource.value,
    formConfig: {
      ...defaultFormProps,
      schemas: [
        {
          field: `key`,
          label: `关键字`,
          component: 'Input',
          defaultValue: '',
          componentProps: {
            placeholder: '请输入关键词',
          },
        },
        {
          field: 'type',
          label: '状态',
          component: 'RadioButtonGroup',
          defaultValue: 0,
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
      ],
    },
  });

  // function retryCreate(record) {
  //   record.loading = true;
  //   retryExportApi(record.id)
  //     .then(() => {
  //       record.status = 1;
  //     })
  //     .finally(() => {
  //       record.loading = false;
  //     });
  // }
</script>
