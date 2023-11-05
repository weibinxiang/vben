import type { BasicTableProps } from '/@/components/Table';
/* 用于表格的默认Props(带表单) */
export const defaultTableProps: Partial<BasicTableProps> = {
  showIndexColumn: false,
  pagination: {
    pageSize: 20,
  },
  scroll: { scrollToFirstRowOnChange: true, x: 1200 },
  // useSearchForm: true,
  // formConfig: createFormProps(),
};
