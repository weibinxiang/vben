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
    title: '评价内容',
    dataIndex: 'content',
    slots: 'content',
  },
  {
    title: '星级',
    dataIndex: 'star_level',
    slots: 'star_level',
  },
  {
    title: '时间',
    dataIndex: 'comment_date',
    slots: 'comment_date',
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: 'action',
  },
];
