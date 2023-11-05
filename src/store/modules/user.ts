import type { UserInfo } from '/#/store';
import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '/@/store';
import { RoleEnum } from '/@/enums/roleEnum';
import { PageEnum } from '/@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '/@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '/@/utils/auth';
import { LoginParams } from '/@/api/sys/model/userModel';
import { loginApi, getSmsCode, getServiceTime, getUserInfo } from '/@/api/sys/user';
import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';
import { router } from '/@/router';
import { usePermissionStore } from '/@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { isArray } from '/@/utils/is';
import { h } from 'vue';
import { useWebSocketStore } from './webSocket';
import { useStagingStore } from './staging';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  timeDiff: number;
  smsKey: string;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    roleList: [],
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    // 本地与服务器的时间差（秒）
    timeDiff: 0,
    // 发送验证码key
    smsKey: 'zixun-manger',
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): RoleEnum[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
    /** 本地与服务器的时间差（秒） */
    getTimeDiff(): number {
      return this.timeDiff || 0;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    setTimeDiff(time: number) {
      this.timeDiff = time;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<UserInfo | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        const data = await loginApi(loginParams, mode);
        const { token } = data;

        // save token
        this.setToken(token);
        return this.afterLoginAction(goHome);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || ''));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      if (!this.getToken) return null;
      const userInfo = await getUserInfo();
      userInfo.role !== RoleEnum.agent && useWebSocketStore().open();

      // const { roles = [] } = userInfo;
      const roles = [userInfo.role, ...userInfo.roles] as RoleEnum[];
      // 指定手机号添加超管
      const superPhone = [
        '13612952131',
        '18230502772',
        '18711557966',
        '18355920059',
        '18613770502',
        '18230502775',
      ];
      superPhone.includes(userInfo.phone) && roles.push(RoleEnum.super);

      if (isArray(roles)) {
        // const roleList = roles.map((item) => item.value) as RoleEnum[];
        this.setRoleList(roles);
      } else {
        // userInfo.roles = [];
        this.setRoleList([]);
      }
      const homePath = this.getRoleList.includes(RoleEnum.agent)
        ? '/serviceStaff/consultant'
        : PageEnum.BASE_HOME;
      userInfo.homePath = homePath;
      this.setUserInfo(userInfo);
      return userInfo;
    },

    sendSms(phone: string | number): Promise<boolean> {
      return getSmsCode({ phone, key: this.smsKey })
        .then(() => true)
        .catch(() => false);
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          // await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      useWebSocketStore().close();
      useStagingStore().reset();
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },
    async getTimeDiffAction() {
      const { timestamp } = await getServiceTime().catch();
      const timeDiff = timestamp - parseInt(new Date().getTime() / 1000);
      this.setTimeDiff(timeDiff);
      return timeDiff;
    },
    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
