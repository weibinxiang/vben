import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const dashboard: AppRouteModule = {
  path: '/userAdministration',
  name: 'UserAdministration',
  component: LAYOUT,
  meta: {
    orderNo: 11,
    icon: 'ion:grid-outline',
    title: t('routes.userAdministration.dashboard'),
    roles: [RoleEnum.agent],
  },
  children: [
    {
      path: 'userList',
      name: 'UserList',
      component: () => import('/@/views/userAdministration/userList/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.userAdministration.userList'),
        roles: [RoleEnum.agent],
      },
    },
    {
      path: 'userLabel',
      name: 'UserLabel',
      component: () => import('/@/views/userAdministration/userLabel/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.userAdministration.label'),
        roles: [RoleEnum.agent],
      },
    },
  ],
};

export default dashboard;
