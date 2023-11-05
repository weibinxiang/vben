import { Ref } from 'vue';
import { BasicColumn } from '/@/components/Table';
import { DomainModel } from '/@/api/serviceStaff/model/consultant';

export const tagList = [
  { label: '专业认证', value: '专业认证' },
  { label: '快速响应', value: '快速响应' },
  { label: '粉丝推荐', value: '粉丝推荐' },
  { label: '口碑好评', value: '口碑好评' },
  { label: '耐心沟通', value: '耐心沟通' },
  { label: '敏锐解答', value: '敏锐解答' },
  { label: '细致分析', value: '细致分析' },
  { label: '清晰引导', value: '清晰引导' },
  { label: '优选咨询师', value: '优选咨询师' },
];

export const caseInfo = {
  case_date: '',
  domain_id: '',
  serial: '',
  title: '',
};

interface UseFormDataOpt {
  domainOption: Ref<DomainModel[]>;
}

export function useFormData(opt: UseFormDataOpt) {
  const { domainOption } = opt;
  const columns: BasicColumn[] = [
    {
      title: '案件号',
      dataIndex: 'serial',
      editRow: true,
      editable: true,
      editComponent: 'Input',
      editComponentProps: {
        placeholder: '请输入案件号',
      },
    },
    {
      title: '案件概要',
      dataIndex: 'title',
      editRow: true,
      editable: true,
      editComponent: 'Input',
      editComponentProps: {
        placeholder: '请输入案件概要',
      },
    },
    {
      title: '发布日期',
      dataIndex: 'case_date',
      editRow: true,
      editable: true,
      editComponent: 'DatePicker',
      editComponentProps: {
        placeholder: '请选择发布日期',
        valueFormat: 'YYYY-MM-DD',
      },
    },
    {
      title: '案由',
      dataIndex: 'domain_id',
      editRow: true,
      editable: true,
      editComponent: 'Select',
      editComponentProps: {
        placeholder: '请选择案由',
        options: domainOption,
        fieldNames: {
          value: 'domain_id',
          label: 'domain',
        },
      },
    },
  ];

  return { columns };
}
