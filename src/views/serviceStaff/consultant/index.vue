<template>
  <PageWrapper content-full-height content-background fixed-height>
    <template #headerContent>
      <div class="bg-white p-4 pb-2">
        <div>
          <a-button type="primary" @click="openInviteJoin(true, {})">邀请入驻</a-button>
          <a-button class="ml-3" @click="openInviteRecords">邀请记录</a-button>
        </div>
        <div class="block md:flex items-center justify-between mt-9">
          <BasicForm @register="registerForm" />
        </div>
      </div>
    </template>
    <div class="flex items-start h-full">
      <div class="pl-4 py-4 h-full" v-if="UserStore.getRoleList.includes(RoleEnum.lawyer_agent)">
        <LawFirmList v-model:value="lawFirmId" @change="getList" />
      </div>
      <div class="flex-1 flex flex-wrap ml-4 h-full overflow-y-auto relative content-start py-4">
        <ConsultantItem
          v-for="item in list"
          :key="item.consultant_id"
          :consultant="item"
          @to-details="toDetails"
          @promotion="promotion"
          @refresh="submit"
        />
        <Loading :loading="loading" :empty="!list.length" />
      </div>
    </div>
    <!-- 邀请入驻弹窗 -->
    <InviteJoin @register="registerInviteJoin" />
    <!-- 邀请记录 -->
    <InviteRecords @register="registerInviteRecords" />
    <!-- 推广 -->
    <PromotionModal @register="registerPromotionModal" />
  </PageWrapper>
</template>

<script setup lang="ts" name="Consultant">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm, defaultFormProps, FormSchema } from '/@/components/Form';
  import { getConsultantList } from '/@/api/serviceStaff/consultant';
  import { ConsultantItemModel } from '/@/api/serviceStaff/model/consultant';
  import { useRouter } from 'vue-router';
  import LawFirmList from './components/LawFirmList.vue';
  import ConsultantItem from './components/ConsultantItem.vue';
  import InviteJoin from './components/InviteJoin.vue';
  import { useModal } from '/@/components/Modal';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import InviteRecords from './components/InviteRecords.vue';
  import Loading from '/@/components/yzkt/Loading.vue';
  import PromotionModal from './components/PromotionModal.vue';

  const lawFirmId = ref(0);
  const list = ref<ConsultantItemModel[]>([]);
  const router = useRouter();
  const loading = ref(false);
  const UserStore = useUserStore();

  const schemas: FormSchema[] = [
    {
      field: 'search_key',
      label: '咨询师名称',
      component: 'Input',
      componentProps: {
        placeholder: '输入关键字',
      },
    },
    {
      field: 'status',
      label: '启用状态',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        style: { width: '208px' },
        options: [
          { label: '全部', value: -1 },
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
    },
    {
      field: 'is_recommend',
      label: '首页展示状态',
      component: 'Select',
      defaultValue: -1,
      componentProps: {
        style: { width: '208px' },
        options: [
          { label: '全部', value: -1 },
          { label: '展示', value: 1 },
          { label: '隐藏', value: 0 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
    },
  ];
  const [registerInviteJoin, { openModal: openInviteJoin }] = useModal();
  const [registerInviteRecords, { openModal: openInviteRecords }] = useModal();
  const [registerPromotionModal, { openModal: openPromotionModal }] = useModal();
  const [registerForm, { submit, getFieldsValue }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: async () => {
      getList();
    },
    fieldMapToTime: [['time', ['begin_time', 'end_time'], 'YYYY-MM-DD HH:mm:ss']],
  });

  onMountedOrActivated(() => {
    submit();
  });

  function getList() {
    loading.value = true;
    getConsultantList({
      law_firm_id: lawFirmId.value,
      page: 1,
      page_size: 100,
      ...getFieldsValue(),
    })
      .then((res) => {
        list.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  function toDetails(id) {
    router.push({ name: 'ConsultantDetails', params: { id } });
  }

  function promotion(id) {
    openPromotionModal(true, { consultant_id: id });
  }
</script>
