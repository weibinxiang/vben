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

export const senior = ref(false);

export const schemas: FormSchema[] = [
  {
    field: 'time',
    label: '评价时间',
    component: 'RangePicker',
    colProps: { sm: 24 },
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
    field: 'is_show',
    label: `是否公开`,
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      style: { minWidth: '240px' },
      options: [
        { label: '全部', value: -1 },
        { label: '公开', value: 1 },
        { label: '不公开', value: 0 },
      ],
    },
  },
  // {
  //   field: `consulting_status`,
  //   label: `来源`,
  //   component: 'Select',
  //   componentProps: {
  //     placeholder: '请选择',
  //     style: { minWidth: '240px' },
  //     options: [
  //       { label: '全部', value: 0 },
  //       { label: '待接单', value: 1 },
  //       { label: '服务中', value: 2 },
  //       { label: '已完成', value: 3 },
  //       { label: '已关闭', value: 4 },
  //     ],
  //   },
  // },
  {
    field: 'status',
    label: `审核状态`,
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      style: { minWidth: '240px' },
      options: [
        { label: '全部', value: -1 },
        { label: '待审核', value: 0 },
        { label: '正常', value: 1 },
        { label: '拒绝', value: 2 },
      ],
    },
  },
];

export const columns: BasicColumn[] = [
  {
    title: '行',
    dataIndex: 'row',
    slots: { customRender: 'row' },
  },
];

export const tableColumn = [
  {
    title: '评价用户',
    dataIndex: 'user',
    width: 220,
    slots: 'user',
  },
  {
    title: '时间',
    dataIndex: 'created_at',
    slots: 'created_at',
    width: 200,
  },
  {
    title: '评价内容',
    dataIndex: 'content',
    slots: 'content',
    width: 400,
  },
  // {
  //   title: '来源',
  //   dataIndex: 'source',
  //   width: 130,
  //   slots: 'source',
  // },
  {
    title: '星级',
    dataIndex: 'star_level',
    slots: 'star_level',
  },
  {
    title: '咨询类型',
    dataIndex: 'sku_type',
    slots: 'sku_type',
  },
  {
    title: '状态',
    dataIndex: 'status',
    slots: 'status',
  },
  {
    title: '是否公开',
    dataIndex: 'is_show',
    slots: 'is_show',
  },
  {
    title: '是否置项',
    dataIndex: 'is_top',
    slots: 'is_top',
  },
];

export const modalTableColumn = [
  {
    title: '评价内容',
    dataIndex: 'content',
    slots: 'content',
    width: 350,
  },
  {
    title: '时间',
    dataIndex: 'comment_date',
    slots: 'comment_date',
  },
  {
    title: '星级',
    dataIndex: 'star_level',
    slots: 'star_level',
  },
  {
    title: '咨询类型',
    dataIndex: 'sku_type',
    slots: 'sku_type',
  },
  {
    title: '是否公开',
    dataIndex: 'is_show',
    slots: 'is_show',
  },
  {
    title: '是否置项',
    dataIndex: 'is_top',
    slots: 'is_top',
  },
];
