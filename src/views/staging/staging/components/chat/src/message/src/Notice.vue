<template>
  <div class="flex flex-col items-center justify-center mt-5">
    <div class="text-#8D8FA0 text-xs">{{ createTime }}</div>
    <div
      v-if="notice === NoticeEnum.begin || notice === NoticeEnum.finish"
      class="flex items-center max-w-7/10 bg-#E58121 bg-opacity-10 rounded-lg px-3.5 py-3 text-#FF7500 text-13px mt-1"
    >
      <img
        class="flex-shrink-0 mr-2 w-8 h-8"
        :src="`https://ttmini.yizhiwechat.com/advisory/iconfont/${
          StagingStore.currentServe?.type === ConsultingType.phone
            ? 'icon-type-phone'
            : 'icon-type-imageText'
        }.png`"
        mode="scaleToFill"
      />
      <span>
        {{ getNotice() }}
      </span>
    </div>
    <div
      class="px-3.5 py-10px rounded-lg bg-#EDEDED text-#4E5969 text-opacity-90 w-fit max-w-7/10 text-13px mt-1"
      v-else
    >
      <span>
        {{ getNotice() }}
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useUserStore } from '/@/store/modules/user';
  import { NoticeEnum, ConsultingType } from '/@/api/staging/model/enum';
  import { consultingNoticeText, customNoticeText } from '../hooks/useMssageNotice';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { useStagingStore } from '/@/store/modules/staging';

  const props = defineProps({
    notice: {
      type: String,
      default: '',
    },
    createTime: {
      type: String,
      default: '',
    },
  });
  const UserStore = useUserStore();
  const StagingStore = useStagingStore();

  function getNotice() {
    const data = UserStore.getRoleList.includes(RoleEnum.customer)
      ? customNoticeText
      : consultingNoticeText;
    return data[props.notice];
  }
</script>

<style lang="scss"></style>
