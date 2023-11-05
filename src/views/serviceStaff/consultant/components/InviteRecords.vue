<template>
  <div>
    <BasicModal
      width="1200px"
      :canFullscreen="false"
      v-bind="$attrs"
      title="邀请记录"
      :min-height="400"
      destroyOnClose
      @register="registerModal"
      :footer="null"
    >
      <div>
        <Alert
          message="入驻流程：机构邀请->短信提示->咨询师扫码注册->填写资料->进入工作台"
          type="info"
          show-icon
        />
        <div class="mt-4">
          <BasicForm @register="registerForm" />
          <BasicTable @register="registerTable">
            <template #action="{ record }">
              <a class="ml-2" @click="sea(record)">查看邀请函</a>
              <a class="ml-2" @click="toDetails(record.consultant_id)">完善资料</a>
            </template>
            <template #law_firm="{ record }">
              {{ record.law_firm?.name }}
            </template>
            <template #invite_status="{ record }">
              <Tag v-if="record.invite_status === 0" color="orange">待接受</Tag>
              <Tag v-else color="green">已接受</Tag>
              <Popconfirm
                @confirm="send(record.phone)"
                title="确认再次邀约吗?"
                ok-text="确认"
                cancel-text="取消"
              >
                <div
                  class="flex items-center justify-center text-[#1890ff] mt-1 cursor-pointer"
                  v-if="record.invite_status === 0 && record.is_invite === 1"
                  ><SyncOutlined style="color: #1890ff" />再次邀约</div
                >
              </Popconfirm>
            </template>
            <template #dy="{ record }">
              <div class="flex items-center justify-center">
                <img
                  src="../../../../assets/images/dy_icon.png"
                  class="w-[12px] h-[12px] align-middle mr-1"
                  alt=""
                />
                <span class="text-[14px]">抖音：</span>
                <span class="text-[14px] text-[#86909C]">{{
                  record.dy === 0 ? '未授权' : '已授权'
                }}</span>
              </div>
            </template>
          </BasicTable>
        </div>
      </div>
    </BasicModal>
    <!-- 邀请函弹窗 -->
    <InviteJoinLetter @register="registerInviteJoinLetter" />
  </div>
</template>

<script setup lang="ts">
  import { Alert, Tag, Popconfirm, message } from 'ant-design-vue';
  import { BasicForm, useForm, defaultFormProps, FormSchema } from '/@/components/Form';
  import { BasicTable, useTable, BasicColumn, defaultTableProps } from '/@/components/Table';
  import {
    inviteInConsultantList,
    getPracticeUnitNoPageList,
    sendInviteSms,
  } from '/@/api/serviceStaff/consultant';
  import dayjs from 'dayjs';
  import InviteJoinLetter from './InviteJoinLetter.vue';

  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { useDebounceFn } from '@vueuse/core';
  import { ref } from 'vue';
  import { SyncOutlined } from '@ant-design/icons-vue';
  import { router } from '/@/router';

  const [registerModal, { closeModal }] = useModalInner();

  const [registerInviteJoinLetter, { openModal: openInviteJoinLetter }] = useModal();
  const inviteInfo = ref();
  let dates: any[] = [];
  const dateRanges = {
    ['今日']: [dayjs().startOf('day'), dayjs().endOf('day')],
    ['昨日']: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
    ['最近7日']: [dayjs().subtract(6, 'day'), dayjs().subtract(0, 'day')],
    ['最近30日']: [dayjs().subtract(29, 'day'), dayjs().subtract(0, 'day')],
  };
  const schemas: FormSchema[] = [
    {
      field: 'consultant_name',
      label: '咨询师名称',
      component: 'Input',
      componentProps: {
        placeholder: '输入关键字',
      },
    },
    {
      field: 'practice_unit',
      label: '所属单位',
      component: 'ApiSelect',
      componentProps: {
        style: { width: '208px' },
        // more details see /src/components/Form/src/components/ApiSelect.vue
        api: getPracticeUnitNoPageList,
        resultField: 'list',
        // use name as label
        labelField: 'name',
        // use id as value
        valueField: 'law_firm_id',
        // not request untill to select
        immediate: true,
        onChange: (e, v) => {
          console.log('ApiSelect====>:', e, v);
        },
        // atfer request callback
        onOptionsChange: (options) => {
          console.log('get options', options.length, options);
        },
      },
    },
    {
      field: 'invite_status',
      label: '邀约状态',
      component: 'Select',
      defaultValue: -1,
      componentProps: {
        style: { width: '208px' },
        options: [
          { label: '全部', value: -1 },
          { label: '待接受', value: 0 },
          { label: '已接收', value: 1 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
    },
    {
      field: 'time',
      label: '日期时间',
      component: 'RangePicker',
      componentProps: {
        allowClear: true,
        format: 'YYYY-MM-DD HH:mm:ss',
        showTime: true,
        style: { width: '100%' },
        ranges: dateRanges,
        disabledDate: (current) => {
          if (!dates || dates.length === 0) {
            return false;
          }
          const diffDate = current.diff(dates[0], 'days');
          return Math.abs(diffDate) > 30;
        },
        onOpenChange: (open: boolean) => {
          if (open) {
            dates = [];
          }
        },
        onCalendarChange: (val) => {
          dates = val;
          console.log('dates', dates);
        },
      },
    },
  ];
  const submitFn = useDebounceFn(() => {
    reload();
  }, 300);

  const [registerForm, { getFieldsValue }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: submitFn,
    fieldMapToTime: [['time', ['begin_time', 'end_time'], 'YYYY-MM-DD HH:mm:ss']],
    labelWidth: '100px',
  });
  const columns: BasicColumn[] = [
    {
      title: '咨询师名称',
      dataIndex: 'name',
    },
    {
      title: '咨询师手机号',
      dataIndex: 'phone',
      width: 100,
      ellipsis: false,
    },
    {
      title: '所属单位',
      dataIndex: 'law_firm',
      slots: { customRender: 'law_firm' },
      width: 200,
    },
    {
      title: '邀约状态',
      dataIndex: 'invite_status',
      slots: { customRender: 'invite_status' },
    },
    {
      title: '授权状态',
      dataIndex: 'dy',
      slots: { customRender: 'dy' },
      width: 150,
    },
    {
      title: '邀约时间',
      dataIndex: 'invite_time',
      width: 150,
      ellipsis: false,
    },
  ];
  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'consultant_id',
    expandRowByClick: true,
    scroll: { x: 1000 },
    immediate: true,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 240,
      slots: { customRender: 'action' },
    },
    api: async (params) => {
      const query = {
        ...params,
        ...getFieldsValue(),
      };
      return inviteInConsultantList(query);
    },
  });
  function sea(record) {
    inviteInfo.value = {
      consultant_type: record.consultant_type,
      consultant_name: record.name,
      label: record.law_firm?.name,
      phone: record.phone,
      consultant_id: record.consultant_id,
    };
    openInviteJoinLetter(true, { inviteInfo: inviteInfo });
  }
  function send(phone) {
    sendInviteSms({ phone }).then(() => {
      message.success('邀约成功');
    });
  }
  function toDetails(id) {
    closeModal();
    router.push({ name: 'ConsultantDetails', params: { id } });
  }
</script>

<style scoped></style>
