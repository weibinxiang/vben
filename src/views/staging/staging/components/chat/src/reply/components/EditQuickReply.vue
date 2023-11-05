<template>
  <Popover
    v-model:visible="contentVisible"
    trigger="click"
    placement="topRight"
    overlayClassName="quick-reply-popover"
  >
    <template #content>
      <div class="w-546px">
        <div
          class="flex justify-between items-center quick-title-bg px-4 h-34px border-[#f3f5f6] border-b-1"
        >
          <div class="text-base text-[#333333] font-medium"
            >快捷回复 <span class="text-xs">（{{ replyList.length }}条）</span></div
          >
          <div class="text-sm text-[#1890FF] cursor-pointer" @click="addRply">添加</div>
        </div>
      </div>
      <div class="px-4 pt-4 h-50 overflow-auto">
        <div class="flex items-center pb-4" v-for="item in replyList" :key="item.quick_reply_id">
          <div class="w-2 h-2 rounded-full bg-[#D9D9D9] mr-2"></div>
          <div class="flex-1 text-ellipsis cursor-pointer" @click="selectQuick(item)">
            {{ item.reply_content }}
          </div>
          <Popover
            trigger="hover"
            overlayClassName="staging-order-mark-popover"
            v-if="!item.agent_id"
            class="cursor-pointer"
          >
            <template #content>
              <div class="w-30">
                <div
                  class="flex items-center justify-center text-black text-opacity-85 h-8 cursor-pointer"
                  @click="editRply(item)"
                >
                  <Icon icon="ant-design:edit-outlined" class="mr-2" />
                  编辑
                </div>
                <div
                  class="flex items-center justify-center text-#F5222D h-8 cursor-pointer"
                  @click="delRply(item.quick_reply_id)"
                >
                  <Icon icon="ant-design:delete-outlined" class="mr-2" />
                  删除
                </div>
              </div>
            </template>
            <Icon
              icon="ant-design:ellipsis-outlined"
              :size="20"
              class="!text-#4080FF cursor-pointer"
            />
          </Popover>
        </div>
        <Empty :image="simpleImage" v-if="!replyList.length" />
      </div>
    </template>
    <slot> </slot>
  </Popover>
  <BasicModal
    @register="register"
    :title="quick_reply_id ? '编辑快捷回复模版' : '添加快捷回复模板'"
    width="512"
    :min-height="0"
    @ok="confirm"
  >
    <Form :model="formData" ref="FormRef">
      <FormItem name="reply_content" :rules="[{ required: true, message: '快捷回复不能为空！' }]">
        <InputTextarea
          :placeholder="'请填写快捷回复……'"
          :maxlength="50"
          showCount
          :rows="3"
          v-model:value="formData.reply_content"
        />
      </FormItem>
    </Form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, watch, PropType } from 'vue';
  import { Popover, Input, Form, FormItem, Empty, message } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { saveQuickReply, deleteQuickReply } from '/@/api/staging/staging';
  import { QuickReplyList } from '/@/api/staging/model/customerModel';
  import { useModal, BasicModal } from '/@/components/Modal';

  const simpleImage = Empty.PRESENTED_IMAGE_SIMPLE;
  const contentVisible = ref(false);
  const InputTextarea = Input.TextArea;
  const [register, { openModal, closeModal }] = useModal();
  const replyList = ref<QuickReplyList[]>([]);
  const formData = ref({
    reply_content: '',
  });
  const FormRef = ref();
  const quick_reply_id = ref(0);

  const props = defineProps({
    value: {
      type: String,
      default: '',
    },
    textList: {
      type: Array as PropType<QuickReplyList[]>,
      default: () => [],
    },
  });
  watch(
    () => props.textList,
    (v) => {
      if (v.length) {
        replyList.value = v;
      }
    },
  );
  const emits = defineEmits(['update:value', 'updateData', 'selectText']);

  function selectQuick(item) {
    emits('update:value', item.reply_content);
    emits('selectText');
    contentVisible.value = false;
  }

  function editRply(item) {
    quick_reply_id.value = item.quick_reply_id;
    formData.value.reply_content = item.reply_content;
    contentVisible.value = false;
    openModal();
  }
  function addRply() {
    if (replyList.value.length >= 30) {
      message.warning('快捷评论最多预设30条');
      return;
    }
    quick_reply_id.value = 0;
    formData.value.reply_content = '';
    contentVisible.value = false;
    openModal();
  }
  function confirm() {
    FormRef.value.validate().then(() => {
      const param = quick_reply_id.value
        ? { reply_content: formData.value.reply_content, quick_reply_id: quick_reply_id.value }
        : { reply_content: formData.value.reply_content };
      saveQuickReply(param).then(() => {
        emits('updateData');
        closeModal();
      });
    });
  }
  function delRply(id) {
    deleteQuickReply({ quick_reply_id: id }).then(() => {
      replyList.value = replyList.value.filter((item) => {
        return item.quick_reply_id !== id;
      });
      emits('updateData');
    });
  }
</script>
<style lang="less">
  .quick-reply-popover {
    .ant-popover-inner-content {
      padding: 0 !important;
    }
  }

  .quick-title-bg {
    background: linear-gradient(90deg, rgb(233 246 255 / 57%) -0.11%, rgb(229 244 255 / 0%) 99.84%);
  }
</style>
