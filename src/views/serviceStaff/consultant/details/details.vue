<template>
  <PageWrapper content-full-height fixed-height>
    <template #headerContent>
      <div class="bg-white px-4 pt-4">
        <div class="flex justify-between items-center">
          <div class="text-xl font-bold flex items-center">
            <Icon
              icon="ant-design:arrow-left-outlined"
              class="!text-lg !text-#262626 mr-2 cursor-pointer"
              @click="router.back()"
            />
            <span>{{ consultant?.name }}</span>
            <div class="ml-2">
              <Tag color="red" v-if="consultant?.consultant_type === ConsultantType.lawyer"
                >法律咨询师</Tag
              >
              <Tag color="blue" v-else>普通咨询师</Tag>
            </div>
          </div>
          <div>
            <Popconfirm
              :title="
                consultant?.status
                  ? '禁用后该咨询师无法正常售卖服务，以及无法正常登陆服务端工作台'
                  : '是否启用该咨询师？'
              "
              placement="left"
              :okButtonProps="{ loading: statusLoading }"
              @confirm="changeStatus"
            >
              <a-button type="danger" v-if="consultant?.status">禁用咨询师</a-button>
              <a-button type="primary" v-else>启用咨询师</a-button>
            </Popconfirm>
          </div>
        </div>
        <div class="flex items-center flex-wrap py-4">
          <div>
            <span class="text-gray-400">状态：</span>
            <Badge color="green" text="正常" v-if="consultant?.status" />
            <Badge color="red" text="禁用" v-else />
          </div>
          <template v-if="consultant?.consultant_type === ConsultantType.lawyer">
            <div
              ><span class="text-gray-400 ml-8">执业单位：</span
              >{{ consultant?.law_firm?.name || '暂无' }}</div
            >
            <div class="ml-8"
              ><span class="text-gray-400">所在团队：</span>
              <span v-if="!consultant?.group_consultant?.length">暂未加入</span>
              <span v-else-if="consultant?.group_consultant?.length === 1">{{
                consultant?.group_consultant[0]?.group?.name
              }}</span>
              <span v-else-if="consultant?.group_consultant?.length > 1"
                >共加入{{ consultant?.group_consultant?.length }}个咨询师团队
                <span
                  class="text-#1890FF cursor-pointer"
                  @click="openTeamDetailsModal(true, consultant?.group_consultant)"
                  >详情</span
                ></span
              >
            </div>
          </template>
          <div class="ml-8 flex items-center text-gray-400"
            >首页展示<Tooltip
              ><template #title>首页展示开启时，咨询师信息才会在小程序首页展示</template
              ><Icon
                icon="ant-design:question-circle-outlined"
                :size="14"
                class="ml-1 !text-gray-400" /></Tooltip
            >：<Switch
              v-model:checked="pageisShow"
              :checkedValue="1"
              :unCheckedValue="0"
              :loading="changeShowLoading"
              @click="changeShowStatus"
          /></div>
        </div>
        <Tabs v-model:activeKey="activeKey" :tabBarStyle="{ margin: '0' }">
          <TabPane :key="TabEnum.consultant" tab="咨询师信息" />
          <TabPane :key="TabEnum.sales" tab="售卖管理" />
          <TabPane :key="TabEnum.qualification" tab="资质/实名认证" />
          <TabPane :key="TabEnum.order" tab="订单列表" />
          <TabPane :key="TabEnum.custom" tab="客户列表" />
        </Tabs>
      </div>
    </template>
    <div class="h-full overflow-auto">
      <ConsultantForm
        :consultant="consultant"
        v-if="activeKey === TabEnum.consultant"
        @submit="getDetails"
      />
      <SalesForm :consultant="consultant" v-else-if="activeKey === TabEnum.sales" />
      <QualificationForm
        :consultantType="consultant?.consultant_type"
        v-else-if="activeKey === TabEnum.qualification"
      />
      <OrderContent
        :consultantId="+route.params.id"
        v-else-if="activeKey === TabEnum.order"
        class="consultant-content-page-wrapper"
      />
      <UserList
        :consultantId="+route.params.id"
        v-else-if="activeKey === TabEnum.custom"
        class="consultant-content-page-wrapper"
      />
    </div>

    <TeamDetailsModal @register="registerTeamDetailsModal" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs, TabPane, Popconfirm, message, Tag, Badge, Switch, Tooltip } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    getConsultantDetail,
    setConsultantStatus,
    setConsultantRecommend,
  } from '/@/api/serviceStaff/consultant';
  import { useRoute, useRouter } from 'vue-router';
  import { TabEnum } from './typing';
  import { ConsultantDetailModel, ConsultantType } from '/@/api/serviceStaff/model/consultant';
  import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
  import { useModal } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import ConsultantForm from './components/consultant/Consultant.vue';
  import TeamDetailsModal from './components/TeamDetailsModal.vue';

  const SalesForm = createAsyncComponent(() => import('./components/sales/Sales.vue'), {
    loading: true,
  });
  const QualificationForm = createAsyncComponent(
    () => import('./components/qualification/Qualification.vue'),
    {
      loading: true,
    },
  );
  const OrderContent = createAsyncComponent(
    () => import('/@/views/orderManagement/orderList/index.vue'),
    {
      loading: true,
    },
  );
  const UserList = createAsyncComponent(
    () => import('/@/views/userAdministration/userList/index.vue'),
    {
      loading: true,
    },
  );

  const activeKey = ref(TabEnum.consultant);
  const route = useRoute();
  const router = useRouter();
  const consultant = ref<ConsultantDetailModel>();
  const statusLoading = ref(false);
  const pageisShow = ref(0);
  const changeShowLoading = ref(false);
  const [registerTeamDetailsModal, { openModal: openTeamDetailsModal }] = useModal();

  function getDetails() {
    getConsultantDetail({ consultant_id: +route.params.id }).then((res) => {
      pageisShow.value = res.is_recommend;
      consultant.value = res;
    });
  }

  getDetails();

  function changeStatus() {
    statusLoading.value = true;
    const status = +!consultant.value?.status as 0 | 1;
    setConsultantStatus({ consultant_id: +route.params.id, status: status })
      .then(() => {
        consultant.value!.status = status;
        message.success(`${consultant.value?.status ? '启用' : '禁用'}成功`);
      })
      .finally(() => {
        statusLoading.value = false;
      });
  }

  function changeShowStatus() {
    changeShowLoading.value = true;
    const status = +!consultant.value?.is_recommend as 0 | 1;
    setConsultantRecommend({ consultant_id: +route.params.id, type: status })
      .then(() => {
        consultant.value!.is_recommend = status;
        message.success(`${consultant.value?.is_recommend ? '启用' : '关闭'}成功`);
      })
      .finally(() => {
        changeShowLoading.value = false;
      });
  }
</script>

<style lang="less">
  .consultant-content-page-wrapper {
    .ant-page-header {
      padding: 0;
    }

    .vben-page-wrapper-content {
      margin: 16px 0 0;
    }
  }
</style>
