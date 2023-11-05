<template>
  <div v-if="UserStore.getRoleList.includes(RoleEnum.customer)"
    >本单咨询服务已完成，感谢您的答复。</div
  >
  <div v-else>本次咨询服务已完成</div>
</template>

<script lang="ts" setup>
  import { RoleEnum } from '/@/enums/roleEnum';
  import { useUserStore } from '/@/store/modules/user';

  const UserStore = useUserStore();
</script>
