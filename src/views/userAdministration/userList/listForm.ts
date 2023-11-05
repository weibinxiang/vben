import { FormSchema } from '/@/components/Form';
import { BasicColumn } from '/@/components/Table';
import dayjs from 'dayjs';

let dates: any[] = [];
const dateRanges = {
  ['今日']: [dayjs().startOf('day'), dayjs().endOf('day')],
  ['昨日']: [dayjs().subtract(1, 'day').startOf('day'), dayjs().subtract(1, 'day').endOf('day')],
  ['最近7日']: [dayjs().subtract(6, 'day'), dayjs().subtract(0, 'day')],
  ['最近30日']: [dayjs().subtract(29, 'day'), dayjs().subtract(0, 'day')],
};

export const schemas: FormSchema[] = [
  {
    field: 'search_key',
    label: '关键字',
    component: 'Input',
    componentProps: {
      placeholder: '名称、工号或手机号',
    },
  },
  {
    field: 'tag_type',
    label: '标记类型',
    component: 'RadioButtonGroup',
    defaultValue: 1,
    componentProps: {
      options: [
        { label: '全部', value: 0 },
        { label: '已标记', value: 1 },
        { label: '未标记', value: 2 },
      ],
      onChange(target) {
        console.log('value', target);
      },
    },
    colProps: { lg: 24, md: 24 },
  },
  {
    field: 'time',
    label: '最近咨询时间',
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
      },
    },
  },
];

export const tableColumns: BasicColumn[] = [
  {
    title: '客户',
    dataIndex: 'user_id',
    slots: { customRender: 'user' },
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
  },
  {
    title: '是否标记',
    dataIndex: 'is_mark',
    slots: { customRender: 'mark' },
  },
  {
    title: '标签',
    width: '300px',
    dataIndex: 'tag_name',
    slots: { customRender: 'label' },
  },
  // {
  //   title: '来源',
  //   dataIndex: 'source',
  //   // format
  // },
  // {
  //   title: '平台',
  //   dataIndex: 'platform',
  //   // format
  // },
  {
    title: '咨询次数',
    dataIndex: 'user',
    maxWidth: 40,
    // format
    slots: { customRender: 'ConsultationFrequency' },
  },
  {
    title: '最近咨询时间',
    dataIndex: 'consultanting.created_at',
    format: (_, val) => {
      return val.consultanting.created_at;
    },
  },
  {
    title: '标记记录',
    dataIndex: 'consultant_user_count',
    // format
    slots: { customRender: 'MarkRecord' },
  },
];
