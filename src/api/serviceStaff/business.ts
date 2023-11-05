import { defHttp } from '/@/utils/http/axios';
import { CreatePracticeUnitParams, BusinessItem } from './model/business';

/** 获取省市区 */
export function getAddressList() {
  return defHttp.get(
    {
      url: 'https://ttmini.yizhiwechat.com/address.json',
    },
    {
      apiUrl: '',
    },
  );
}

/** 执业单位列表 */
export function getPracticeUnitList(params: {
  search_key?: string;
  page: number;
  page_size: number;
}) {
  return defHttp.get<{ law_firm_count: number; data: BusinessItem[] }>({
    url: '/practice_unit/getPracticeUnitList',
    params,
  });
}

/** 执业单位列表(不分页) */
export function getPracticeUnitNoPageList() {
  return defHttp.get<BusinessItem[]>({
    url: '/practice_unit/getPracticeUnitNoPageList',
  });
}

/** 删除执业单位 */
export function delPracticeUnit(params: { law_firm_id: number }) {
  return defHttp.get({
    url: '/practice_unit/delPracticeUnit',
    params,
  });
}

/** 执业单位详情 */
export function getPracticeUnitDetail(params: { law_firm_id: number }) {
  return defHttp.get({
    url: '/practice_unit/getPracticeUnitDetail',
    params,
  });
}

/** 执业单位详情 */
export function createPracticeUnit(data: CreatePracticeUnitParams) {
  return defHttp.post({
    url: '/practice_unit/createPracticeUnit',
    data,
  });
}
