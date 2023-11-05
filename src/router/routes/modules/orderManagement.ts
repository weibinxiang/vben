import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const dashboard: AppRouteModule = {
  path: '/orderManagement',
  name: 'OrderManagement',
  component: LAYOUT,
  meta: {
    orderNo: 12,
    icon: 'ion:grid-outline',
    title: t('routes.orderManagement.dashboard'),
    roles: [RoleEnum.agent],
  },
  children: [
    {
      path: 'orderList',
      name: 'OrderList',
      component: () => import('/@/views/orderManagement/orderList/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.orderManagement.orderList'),
        roles: [RoleEnum.agent],
      },
    },
    {
      path: 'commentManage',
      name: 'CommentManage',
      component: () => import('/@/views/orderManagement/commentManage/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.orderManagement.commentManage'),
        roles: [RoleEnum.agent],
      },
    },
    {
      path: 'commentLibrary',
      name: 'CommentLibrary',
      component: () => import('/@/views/orderManagement/commentLibrary/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.orderManagement.commentLibrary'),
        roles: [RoleEnum.agent],
      },
    },
  ],
};

export default dashboard;
