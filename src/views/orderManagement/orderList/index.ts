import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import { ref } from 'vue';
import dayjs from 'dayjs';

let dates: any[] = [];
const dateRanges = {
  ['今日']: [dayjs().startOf('day'), dayjs().endOf('day')],
  ['昨日']: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
  ['最近7日']: [dayjs().subtract(6, 'day'), dayjs().subtract(0, 'day')],
  ['最近30日']: [dayjs().subtract(29, 'day'), dayjs().subtract(0, 'day')],
};

interface UseOrderDataOpt {
  consultantId?: number;
}

export function useOrderData(opt?: UseOrderDataOpt) {
  const { consultantId } = opt || {};

  const senior = ref(false);

  const schemas: FormSchema[] = [
    {
      field: 'platform',
      label: '平台',
      component: 'RadioButtonGroup',
      defaultValue: 'miniapp_dy',
      componentProps: {
        options: [
          // { label: '全部', value: 'miniapp_dy' },
          { label: '抖音', value: 'miniapp_dy' },
          // { label: '快手', value: 3 },
          // { label: '微信公众号', value: 4 },
          // { label: '微信小程序', value: 5 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
      colProps: { lg: 24, md: 24 },
    },
    {
      field: 'time',
      label: '订单时间',
      component: 'RangePicker',
      colProps: { sm: 24 },
      defaultValue: [
        dayjs(dayjs(new Date()).format('YYYY-MM-DD') + ' 00:00:00').subtract(30, 'days'),
        dayjs(dayjs(new Date()).format('YYYY-MM-DD') + ' 23:59:59'),
      ],
      componentProps: {
        allowClear: false,
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
    {
      field: 'out_trade_no',
      label: '订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入...',
        style: { minWidth: '240px' },
      },
    },
    {
      field: 'consultant_id',
      label: '咨询师',
      component: 'SelectLawyer',
      defaultValue: consultantId,
      show: () => !consultantId,
    },
    {
      field: 'group_id',
      label: '团队',
      component: 'SelectTeam',
    },
    {
      field: `consulting_status`,
      label: `履约状态`,
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        style: { minWidth: '240px' },
        options: [
          { label: '全部', value: 0 },
          { label: '待接单', value: 1 },
          { label: '服务中', value: 2 },
          { label: '已完成', value: 3 },
          { label: '已关闭', value: 4 },
        ],
      },
      ifShow: () => senior.value,
    },
    // {
    //   field: 'is_end',
    //   label: '结算状态',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择',
    //     style: { minWidth: '240px' },
    //     options: [
    //       { label: '全部', value: -1 },
    //       { label: '已结算', value: 1 },
    //       { label: '未结算', value: 0 },
    //     ],
    //   },
    //   ifShow: () => senior.value,
    // },
    {
      field: 'trade_no',
      label: '支付单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入...',
        style: { minWidth: '240px' },
      },
      ifShow: () => senior.value,
    },
    {
      field: 'phone',
      label: '用户手机号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入...',
        style: { minWidth: '240px' },
      },
      ifShow: () => senior.value,
    },
    // {
    //   field: 'out_trade_no',
    //   label: '推广员',
    //   component: 'SelectPromoter',
    //   ifShow: () => senior.value,
    // },
    {
      field: 'order_status',
      label: '订单状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择',
        style: { minWidth: '240px' },
        options: [
          { label: '全部', value: 0 },
          { label: '已支付', value: 1 },
          { label: '已退款', value: 2 },
        ],
      },
      ifShow: () => senior.value,
    },
    // {
    //   field: 'pay_way',
    //   label: '订单来源',
    //   component: 'Select',
    //   componentProps: {
    //     placeholder: '请选择',
    //     style: { minWidth: '240px' },
    //     options: [
    //       { label: '直播间', value: 1 },
    //       { label: '视频', value: 2 },
    //       { label: '小程序内部转化', value: 3 },
    //       { label: '已关闭', value: 4 },
    //     ],
    //   },
    //   ifShow: () => senior.value,
    // },
  ];

  const orderState = {
    0: '未支付',
    1: '已支付',
    2: '已退款',
  };

  const columns: BasicColumn[] = [
    {
      title: '行',
      dataIndex: 'row',
      slots: { customRender: 'row' },
    },
  ];

  const tableColumn = [
    {
      title: '服务信息',
      dataIndex: 'name',
      width: 220,
      slots: 'name',
    },
    {
      title: '用户信息',
      dataIndex: 'userInfo',
      slots: 'userInfo',
    },
    {
      title: '支付金额（元）',
      dataIndex: 'pay_amount',
      width: 130,
      slots: 'payAmount',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      width: 130,
      slots: 'status',
    },
    // {
    //   title: '结算状态',
    //   dataIndex: 'is_end',
    //   width: 130,
    //   slots: 'isEnd',
    // },
    {
      title: '服务履约状态',
      dataIndex: 'phase_status',
      slots: 'phaseStatus',
      width: 130,
    },
    {
      title: '备注',
      dataIndex: 'notes',
      slots: 'notes',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 120,
      slots: 'action',
    },
  ];

  return {
    senior,
    schemas,
    orderState,
    columns,
    tableColumn,
  };
}
