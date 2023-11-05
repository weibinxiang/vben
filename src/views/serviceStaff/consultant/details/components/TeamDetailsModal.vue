<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="所在团队详情"
    :width="900"
    :min-height="500"
    :footer="null"
  >
    <div class="flex flex-wrap">
      <div class="w-68 rounded overflow-hidden mr-4 mb-4" v-for="item in list" :key="item.group_id">
        <img :src="item.group?.group_image" class="w-full h-42.5 object-cover" />
        <div class="p-4 border border-#f0f0f0 border-t-0">
          <div class="truncate text-base">{{ item.group?.name }}</div>
          <div class="flex text-gray-400 mt-1">
            <div class="mr-4">团队人数：{{ item.group?.group_num }}人</div>
            <div>负责人：{{ item.group?.principal }}</div>
          </div>
        </div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { GroupConsultant } from '/@/api/serviceStaff/model/consultant';

  const list = ref<GroupConsultant[]>([]);

  const [registerModal] = useModalInner((data) => {
    list.value = data;
  });
</script>
