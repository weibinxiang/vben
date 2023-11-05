<template>
  <BasicModal
    @register="register"
    title="发起加密通话"
    :canFullscreen="false"
    :showCancelBtn="false"
    :showOkBtn="false"
    :draggable="false"
    :height="300"
    :footer="null"
  >
    <Tabs v-model:activeKey="activeKey" animated :tabBarStyle="{ display: 'none' }">
      <TabPane key="1">
        <div class="flex flex-col items-center">
          <div class="text-sm font-semibold mt-6 text-#1D2129"
            >若您当前使用的手机号码非下方号码，请修改为当前使用手机号</div
          >
          <div class="flex items-center mt-8">
            <div class="whitespace-nowrap mr-3 text-base text-#000">播出号码:</div>
            <InputNumber v-model:value="inputPhone" type="number" :controls="false" />
          </div>
          <div class="mt-1 text-sm text-#1890FF">隐私保护：咨询者看不到您的真实号码</div>
          <a-button
            type="primary"
            :loading="loading"
            @click="getPhone"
            class="mt-8 w-64.5 !h-10 !text-base"
            :disabled="!validatePhone"
            >生成加密通话</a-button
          >
        </div>
      </TabPane>
      <TabPane key="2"
        ><div class="flex flex-col items-center">
          <div class="text-sm font-semibold mt-6 text-#1D2129"
            >请拨打下方虚拟号码，向咨询客户【{{
              StagingStore.currentServe?.user_nickname
            }}】发起电话</div
          >
          <div class="mt-8 font-bold text-#1D2129 text-4xl">{{ phone }}</div>
          <div class="mt-8 text-sm text-#1890FF">为保证服务质量，通话将会被录音</div>
        </div>
      </TabPane>
    </Tabs>
  </BasicModal>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useStagingStoreWithOut } from '/@/store/modules/staging';
  import { Tabs, TabPane, InputNumber } from 'ant-design-vue';
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { getXPhone } from '/@/api/staging/staging';
  import { RoleEnum } from '/@/enums/roleEnum';

  defineProps({
    consultingId: {
      default: '',
      type: String,
    },
  });

  const StagingStore = useStagingStoreWithOut();
  const UserStore = useUserStoreWithOut();
  const activeKey = ref('1');
  const inputPhone = ref(UserStore.getUserInfo.phone || '');
  const phone = ref();
  const loading = ref(false);
  const validatePhone = computed(() => {
    return /^1[1-9][0-9]{9}$/.test(inputPhone.value);
  });

  const [register] = useModalInner(() => {
    activeKey.value = '1';
  });

  function getPhone() {
    loading.value = true;
    getXPhone({
      consulting_id: StagingStore.currentServe?.consulting_id as number,
      consultant_phone: UserStore.getRoleList.includes(RoleEnum.consultant) ? inputPhone.value : '',
      customer_phone: UserStore.getRoleList.includes(RoleEnum.customer) ? inputPhone.value : '',
    })
      .then((res) => {
        phone.value = res.axb_phone
          .replace(/\+86/, '')
          .replace(/^(\d{3})(\d{4})(\d{4})$/, '$1-$2-$3');
        activeKey.value = '2';
      })
      .finally(() => {
        loading.value = false;
      });
  }
</script>

<style scoped></style>
