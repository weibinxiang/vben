<template>
  <BasicModal
    width="395px"
    :canFullscreen="false"
    v-bind="$attrs"
    title="邀请咨询师"
    ok-text="发送短信"
    @ok="send"
    :min-height="100"
    :zIndex="1300"
    @register="registerModal"
  >
    <div class="flex py-2">
      <div class="mr-2"> 咨询师手机号: </div>
      <div>
        <!-- <Input style="width: 260px" disabled value="phone" /> -->
        <div>{{ phone }}</div>
        <div class="mt-2 text-[#000000]">再次邀请将向咨询师发送邀请函的链接</div>
      </div>
    </div>
  </BasicModal>
</template>

<script setup lang="ts">
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { sendInviteSms } from '/@/api/serviceStaff/consultant';
  import { message } from 'ant-design-vue';

  const [registerModal, { closeModal }] = useModalInner();

  const props = defineProps({
    phone: {
      type: String,
      default: '',
    },
  });
  function send() {
    sendInviteSms({ phone: props.phone }).then(() => {
      message.info('发送成功');
      closeModal();
    });
  }
</script>

<style scoped></style>
