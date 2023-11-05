<template>
  <div class="flex flex-col overflow-hidden bg-#f6f6f6">
    <div class="w-full h-14 flex items-center bg-white px-7 justify-between">
      <div class="flex items-center">
        <div class="flex items-center overflow-hidden">
          <Avatar
            :src="StagingStore.currentServe?.user_headimg_url"
            :role="RoleEnum.user"
            alt=""
            class="w-10 h-10"
          />
          <div class="text-base font-bold mx-3 truncate">{{
            StagingStore.currentServe?.user_nickname
          }}</div>
        </div>
        <div
          class="bg-#FFF7E8 rounded text-#FF7D00 px-2 py-2px flex-shrink-0"
          v-if="getServeStatus() === ServeStatus.wait"
          >待接单：等待{{ formatTime(StagingStore.currentServe?.wait_minutes) }}</div
        >
        <div
          class="bg-#E8F3FF rounded text-#165DFF px-2 py-2px flex-shrink-0"
          v-else-if="getServeStatus() === ServeStatus.ongoing"
          >咨询中
          <span
            v-if="
              getServeStatus(StagingStore.currentServe?.phase) === ServeStatus.ongoing &&
              StagingStore.currentServe?.type !== ConsultingType.phone
            "
            >：剩余{{ formatTime(StagingStore.currentServe?.left_minutes) }}</span
          ></div
        >
        <div
          class="bg-#E8FFEA rounded text-#00B42A px-2 py-2px flex-shrink-0"
          v-else-if="getServeStatus() === ServeStatus.success"
          >已完成</div
        >
        <div
          class="bg-#F2F3F5 rounded text-#4E5969 px-2 py-2px flex-shrink-0"
          v-else-if="getServeStatus() === ServeStatus.refund"
          >已取消</div
        >
      </div>
      <div class="flex">
        <a-button :loading="finishLoading" @click="finish" v-if="canFinish" class="mr-3">
          完成服务
        </a-button>
        <a-button v-if="canDial" @click="call"> 发起通话 </a-button>
      </div>
    </div>
    <ChatRoom />
    <Reply v-if="showReply" :class="{ 'reply-ani': showReplyAni }" />
    <a-button
      type="primary"
      class="!h-12 !text-base mx-12 mb-4 start-button"
      :loading="startLoading"
      @click="startServe"
      v-if="
        UserStore.getRoleList.includes(RoleEnum.consultant) && getServeStatus() === ServeStatus.wait
      "
    >
      开始服务
    </a-button>
    <CallPhone @register="register" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import ChatRoom from './src/message/Room.vue';
  import Reply from './src/reply/Reply.vue';
  import { useStagingStore } from '/@/store/modules/staging';
  import { ConsultingType, PhaseEnum, ServeStatus, StagingMode } from '/@/api/staging/model/enum';
  import { formatTime } from '/@/utils';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { finishServe, takeOrder } from '/@/api/staging/staging';
  import CallPhone from './src/CallPhone/CallPhone.vue';
  import { useModal } from '/@/components/Modal';
  import Avatar from '../avatar/Avatar.vue';

  const StagingStore = useStagingStore();
  const UserStore = useUserStore();
  const { getServeStatus } = StagingStore;
  const startLoading = ref(false);
  const finishLoading = ref(false);
  const showReplyAni = ref(false);
  const [register, { openModal }] = useModal();

  const canFinish = computed(() => {
    return (
      UserStore.getRoleList.includes(RoleEnum.consultant) &&
      getServeStatus() === ServeStatus.ongoing &&
      !StagingStore.currentServe?.finish
    );
  });

  const canDial = computed(() => {
    // 咨询师咨询中
    const consultant =
      UserStore.getRoleList.includes(RoleEnum.consultant) &&
      getServeStatus() === ServeStatus.ongoing;
    // 客服待接单
    const customer =
      UserStore.getRoleList.includes(RoleEnum.customer) &&
      [ServeStatus.wait, ServeStatus.ongoing].includes(getServeStatus());
    return (
      (consultant || customer) &&
      !StagingStore.currentServe?.finish &&
      StagingStore.currentServe?.type === ConsultingType.phone
    );
  });

  const showReply = computed(() => {
    // 咨询师咨询中
    const consultant =
      UserStore.getRoleList.includes(RoleEnum.consultant) &&
      getServeStatus() === ServeStatus.ongoing;
    // 客服待接单和咨询中
    const customer =
      UserStore.getRoleList.includes(RoleEnum.customer) &&
      [ServeStatus.ongoing, ServeStatus.wait].includes(getServeStatus());
    return (
      // 在工作台菜单
      StagingStore.mode === StagingMode.menu && (consultant || customer)
    );
  });

  function startServe() {
    startLoading.value = true;
    const consulting_id = StagingStore.currentServe!.consulting_id as number;
    takeOrder({ consulting_id })
      .then(() => {
        const { item } = StagingStore.queryOngoingServeItem(consulting_id);
        item.phase = PhaseEnum.consultant_start;
        item.left_minutes = StagingStore.consulting?.duration || 30;
        showReplyAni.value = true;
        message.success('接单成功');
      })
      .finally(() => {
        startLoading.value = false;
      });
  }

  function finish() {
    Modal.confirm({
      title: '提示',
      content: '是否已完成本次咨询服务,请确保用户需要咨询的问题已经得到答复',
      centered: true,
      okText: '完成服务',
      cancelText: '取消',
      onOk: () => {
        finishLoading.value = true;
        finishServe({ consulting_id: StagingStore.currentServe?.consulting_id as number })
          .then(() => {
            const { item } = StagingStore.queryOngoingServeItem(
              StagingStore.currentServe!.consulting_id!,
            );
            item.finish = true;
            message.success('已完成服务');
          })
          .finally(() => {
            finishLoading.value = false;
          });
      },
    });
  }

  function call() {
    openModal(true, {});
  }
</script>

<style lang="less">
  @keyframes eject {
    0% {
      transform: translateY(400px);
    }

    100% {
      transform: translateY(0);
    }
  }

  .reply-ani {
    animation: eject 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.27);
  }
</style>
