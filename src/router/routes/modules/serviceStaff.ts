import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';
import { RoleEnum } from '/@/enums/roleEnum';

const dashboard: AppRouteModule = {
  path: '/serviceStaff',
  name: 'ServiceStaff',
  component: LAYOUT,
  meta: {
    orderNo: 11,
    icon: 'ion:grid-outline',
    title: t('routes.customerManage.dashboard'),
    roles: [RoleEnum.agent],
  },
  children: [
    {
      path: 'consultant',
      name: 'Consultant',
      component: () => import('/@/views/serviceStaff/consultant/index.vue'),
      meta: {
        // affix: true,
        title: '咨询师管理',
        roles: [RoleEnum.agent],
      },
      children: [
        {
          path: 'details/:id?',
          name: 'ConsultantDetails',
          component: () => import('/@/views/serviceStaff/consultant/details/details.vue'),
          meta: {
            title: '咨询师详情',
            roles: [RoleEnum.agent],
            hideMenu: true,
            currentActiveMenu: '/serviceStaff/consultant',
          },
        },
      ],
    },
    {
      path: 'teamManage',
      name: 'TeamManage',
      component: () => import('/@/views/serviceStaff/teamManage/index.vue'),
      meta: {
        // affix: true,
        title: '团队管理',
        roles: [RoleEnum.lawyer_agent],
      },
      children: [
        {
          path: 'teamEdit/:group_id?',
          name: 'TeamEdit',
          component: () => import('/@/views/serviceStaff/teamManage/teamEdit.vue'),
          meta: {
            title: '团队设置',
            roles: [RoleEnum.lawyer_agent],
            hideMenu: true,
            currentActiveMenu: '/serviceStaff/teamManage',
          },
        },
      ],
    },
    {
      path: 'business',
      name: 'Business',
      component: () => import('/@/views/serviceStaff/business/index.vue'),
      meta: {
        title: '执业单位管理',
        roles: [RoleEnum.lawyer_agent],
      },
      children: [
        {
          path: 'setting/:id?',
          name: 'BusinessSetting',
          component: () => import('/@/views/serviceStaff/business/setting.vue'),
          meta: {
            title: '执业单位设置',
            roles: [RoleEnum.lawyer_agent],
            hideMenu: true,
            currentActiveMenu: '/serviceStaff/business',
          },
        },
      ],
    },
    {
      path: 'customer',
      name: 'Customer',
      component: () => import('/@/views/serviceStaff/customer/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.customerManage.manage'),
        roles: [RoleEnum.agent],
      },
    },
  ],
};

export default dashboard;
