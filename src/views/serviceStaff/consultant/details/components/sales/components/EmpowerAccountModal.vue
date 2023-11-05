<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="授权绑定"
    :width="700"
    :min-height="500"
    :footer="null"
  >
    <Collapse v-model:activeKey="activeKey">
      <CollapsePanel key="dy" header="抖音">
        <template #extra>
          <a-button type="link" class="!p-0 !h-0" @click.stop="addSpread">添加新的推广号</a-button>
        </template>
        <div>
          <div
            class="flex items-center justify-between border-b border-gray-100 py-2"
            v-for="(item, index) in spreadList"
            :key="item.consultant_id"
          >
            <div class="flex items-center">
              <img :src="item.avatar_url" class="w-8 h-8 object-cover rounded-full" />
              <div class="ml-4 font-bold">{{ item.nickname }}</div>
            </div>
            <Popconfirm
              title="确定解绑该推广号吗?"
              placement="left"
              :okButtonProps="{ loading: item.loading }"
              @confirm="unbinding(item, index)"
            >
              <a-button type="link" danger>解绑</a-button>
            </Popconfirm>
          </div>
        </div>
      </CollapsePanel>
    </Collapse>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Collapse, CollapsePanel, Popconfirm, message } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { unbindAuthorization } from '/@/api/serviceStaff/consultant';
  import { ConsultantSpreadItem } from '/@/api/serviceStaff/model/consultant';

  const emits = defineEmits({
    addSpread: () => true,
  });

  const activeKey = ref(['dy']);
  const spreadList = ref<(ConsultantSpreadItem & { loading?: boolean })[]>([]);

  const [registerModal] = useModalInner((data) => {
    spreadList.value = data.spreadList;
  });

  function addSpread() {
    emits('addSpread');
  }

  function unbinding(item, index) {
    item.loading = true;
    unbindAuthorization({ spread_id: item.id })
      .then(() => {
        message.success('解绑成功');
        spreadList.value.splice(index, 1);
      })
      .finally(() => {
        item.loading = false;
      });
  }
</script>
