<template>
  <img :src="src || baseAvatar" class="rounded-full object-cover" />
</template>

<script setup lang="ts">
  import { computed } from 'vue';
  import { RoleEnum } from '/@/enums/roleEnum';
  import ConsultantAvatar from '/@/assets/images/avatar/consultant.jpg';
  import CustomerAvatar from '/@/assets/images/avatar/customer.jpg';
  import UserAvatar from '/@/assets/images/avatar/user.jpg';

  const props = defineProps({
    role: {
      type: String,
      default: RoleEnum.consultant,
    },
    src: {
      type: String,
      default: '',
    },
  });

  const baseAvatar = computed(() => {
    let url = UserAvatar;
    switch (props.role) {
      case RoleEnum.consultant:
        url = ConsultantAvatar;
        break;
      case RoleEnum.customer:
        url = CustomerAvatar;
        break;
      case RoleEnum.user:
        url = UserAvatar;
        break;
    }
    return url;
  });
</script>
