<template>
  <PageWrapper contentFullHeight fixedHeight contentClass="overflow-x-auto">
    <Guide
      v-if="
        UserStore.getRoleList.includes(RoleEnum.consultant) &&
        !UserStore.getUserInfo.is_register &&
        UserStore.getToken
      "
    />
    <StagingLayout
      v-else-if="
        UserStore.getRoleList.includes(RoleEnum.customer) ||
        (UserStore.getRoleList.includes(RoleEnum.consultant) && UserStore.getUserInfo.is_register)
      "
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="StagingLayout">
  import { onActivated } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import StagingLayout from './layout.vue';
  import { useStagingStore } from '/@/store/modules/staging';
  import { useUserStore } from '/@/store/modules/user';
  import { StagingMode } from '/@/api/staging/model/enum';
  import Guide from './components/guide/guide.vue';
  import { RoleEnum } from '/@/enums/roleEnum';

  const StagingStore = useStagingStore();
  const UserStore = useUserStore();

  StagingStore.mode = StagingMode.menu;
  onActivated(() => {
    StagingStore.mode = StagingMode.menu;
  });
</script>
