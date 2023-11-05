import { defHttp } from '/@/utils/http/axios';
import { GroupList, GroupDetail } from './model/team';

/** 获取团队列表 */
export function getGroupList(params: {
  status: number;
  search_key: string;
  page_size: number;
  page: number;
}) {
  return defHttp.get<{ data: GroupList[] }>({
    url: '/service_group/getGroupList',
    params,
  });
}
/** 编辑团队 */
export function saveGroupInfo(data: any) {
  return defHttp.post({
    url: '/service_group/saveGroupInfo',
    data,
  });
}
/** 或取团队详情 */
export function getGroupDetail(params: { group_id: number | string }) {
  return defHttp.get<GroupDetail>({
    url: '/service_group/getGroupDetail',
    params,
  });
}
