import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { RoleEnum } from '/@/enums/roleEnum';

const dashboard: AppRouteModule = {
  path: '/staging',
  name: 'Staging',
  component: LAYOUT,
  meta: {
    orderNo: 4000,
    icon: 'ri:mini-program-line',
    title: '服务工作台',
    roles: [RoleEnum.consultant, RoleEnum.customer],
  },
  children: [
    {
      path: 'staging',
      name: 'StagingLayout',
      component: () => import('/@/views/staging/staging/index.vue'),
      meta: {
        title: '我的工作台',
        roles: [RoleEnum.consultant, RoleEnum.customer],
      },
    },
    // {
    //   path: 'staging/guide',
    //   name: 'guide',
    //   component: () => import('/@/views/staging/staging/components/guide/guide.vue'),
    //   meta: {
    //     title: '注册引导',
    //   },
    // },
    {
      path: 'quickReply',
      name: 'QuickReply',
      component: () => import('/@/views/staging/quickReply/index.vue'),
      meta: {
        title: '快捷回复管理',
        roles: [RoleEnum.super],
      },
    },
  ],
};

export default dashboard;
