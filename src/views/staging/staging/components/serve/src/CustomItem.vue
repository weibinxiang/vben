<template>
  <div
    class="p-4 pb-0 serve-item cursor-pointer"
    @click="selectServe(item)"
    :class="{
      'bg-#EBF3FF': item.consulting_id === StagingStore.currentServe?.consulting_id,
      '!bg-#f5f5f5': item.type === ConsultingType.dollar,
    }"
    :style="item.type === ConsultingType.dollar ? 'filter: grayscale(1)' : ''"
  >
    <div class="flex">
      <Avatar
        :src="item.consultant_avatar"
        :role="RoleEnum.consultant"
        alt=""
        class="w-10 h-10 flex-shrink-0"
      />
      <div class="flex-1 overflow-hidden pl-3">
        <div class="flex justify-between items-center">
          <div class="truncate pr-2"
            >【{{ ['未知', '电话', '图文', '一元'][item.type || 0] }}】{{
              `${item.consultant_name}咨询师` || '未设置'
            }}
          </div>
          <div class="flex-shrink-0 text-xs">
            <div class="text-#F53F3F" v-if="getServeStatus(item.phase) === ServeStatus.wait"
              >待接单</div
            >
            <div class="text-#165DFF" v-else-if="getServeStatus(item.phase) === ServeStatus.ongoing"
              >咨询中</div
            >
            <div class="text-#00B42A" v-else-if="getServeStatus(item.phase) === ServeStatus.success"
              >已完成</div
            >
            <div class="text-#4E5969" v-else-if="getServeStatus(item.phase) === ServeStatus.refund"
              >已取消</div
            >
          </div>
        </div>
        <div class="truncate text-#4E5969 text-xs font-medium mt-1 text-gray-400"
          >下单时间：{{ item.created_at }}</div
        >
      </div>
    </div>
    <div class="mx-2 h-1px bg-#eee mt-4"></div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { useStagingStore } from '/@/store/modules/staging';
  import { ConsultingType, ServeStatus } from '/@/api/staging/model/enum';
  import { UserConsultingsModel } from '/@/api/staging/model/customerModel';
  import Avatar from '../../avatar/Avatar.vue';
  import { RoleEnum } from '/@/enums/roleEnum';

  defineProps({
    item: {
      type: Object as PropType<UserConsultingsModel>,
      default: () => ({}),
    },
  });

  const StagingStore = useStagingStore();
  const { getServeStatus } = StagingStore;

  function selectServe(item) {
    if (item.type === ConsultingType.dollar) {
      return;
    }
    StagingStore.changeCurrentServe(item);
  }
</script>
