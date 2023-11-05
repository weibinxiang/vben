import type { FormProps } from './src/types/form';
/* 用于表格的默认Props(带表单) */
export const defaultFormProps: FormProps = {
  labelWidth: 'auto',
  style: { marginBottom: 0 },
  baseColProps: { style: { flex: '0 0 auto', width: 'auto' } },
  baseRowStyle: { width: '100%' },
  compact: true,
  colon: true,
  layout: 'inline',
  autoSetPlaceHolder: true,
  showAdvancedButton: false,
  actionColOptions: {
    style: { flex: '0 0 auto', width: 'auto', whiteSpace: 'nowrap', maxWidth: 'none' },
  },
  // showActionButtonGroup: false,
  // fieldMapToTime: [['datetime', ['start_time', 'end_time'], 'YYYY-MM-DD']],
};
// export {};
