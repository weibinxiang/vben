<template>
  <BasicModal
    :width="680"
    :canFullscreen="false"
    v-bind="$attrs"
    title="创建咨询师"
    ok-text="生成邀请函"
    :min-height="400"
    @ok="invite"
    @register="registerModal"
    destroyOnClose
  >
    <div class="">
      <div class="flex justify-center items-start rounded-lg bg-#F4F4F4 py-2">
        <div class="flex items-center group" v-for="(item, index) in procedure" :key="index">
          <img
            src="/src/assets/images/createConsiltant/icon-arrow.png"
            class="w-18px h-18px flex-shrink-0 group-first:hidden mx-5"
          />
          <div class="text-center">
            <img :src="item.icon" class="w-7 h-7" />
            <div>{{ item.title }}</div>
            <div class="text-gray-400">{{ item.text }}</div>
          </div>
        </div>
      </div>
      <div class="mt-6">
        <BasicForm @register="registerForm">
          <template #type="{ model, field }">
            <div class="mt-1 text-red mb-2 max-w-100"
              >咨询师注册时，根据行业的不同需要提交行业相关资质与证明。保存后无法修改，请谨慎选择</div
            >
            <RadioGroup v-model:value="model[field]" button-style="solid">
              <RadioButton :value="0" v-if="UserStore.getRoleList.includes(RoleEnum.general_agent)"
                >普通咨询师</RadioButton
              >
              <RadioButton :value="1" v-if="UserStore.getRoleList.includes(RoleEnum.lawyer_agent)"
                >法律咨询师</RadioButton
              >
            </RadioGroup>
          </template>
          <template #phone="{ model }">
            <Input
              style="width: 400px"
              type="tel"
              :maxlength="11"
              v-model:value="model.phone"
              placeholder="请输入手机号"
              allowClear
            />
            <div class="mt-2 text-gray-400">手机号将作为工作台登陆账号，请认真填写</div>
          </template>
        </BasicForm>
      </div>
    </div>
  </BasicModal>
  <!-- 邀请函弹窗 -->
  <InviteJoinLetter @register="registerInviteJoinLetter" />
</template>

<script setup lang="ts">
  import { BasicModal, useModal, useModalInner } from '/@/components/Modal';
  import { Input, message, RadioGroup, RadioButton } from 'ant-design-vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import InviteJoinLetter from './InviteJoinLetter.vue';
  import { getPracticeUnitNoPageList, inviteInConsultant } from '/@/api/serviceStaff/consultant';
  import { ref } from 'vue';
  import { regTel } from '/@/utils/index';
  import { useUserStore } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';
  import Icon1 from '/@/assets/images/createConsiltant/icon1.png';
  import Icon2 from '/@/assets/images/createConsiltant/icon2.png';
  import Icon3 from '/@/assets/images/createConsiltant/icon3.png';
  import Icon4 from '/@/assets/images/createConsiltant/icon4.png';

  const [registerInviteJoinLetter, { openModal: openInviteJoinLetter }] = useModal();
  const [registerModal, { closeModal }] = useModalInner(() => {
    resetFields();
  });
  const procedure = [
    {
      icon: Icon1,
      title: '创建咨询师',
    },
    {
      icon: Icon2,
      title: '发起邀请',
      text: '二维码邀请函/短信',
    },
    {
      icon: Icon3,
      title: '咨询师接受邀请',
      text: '扫码完成注册',
    },
    {
      icon: Icon4,
      title: '咨询师成功入驻',
      text: '可上架咨询服务',
    },
  ];
  const inviteInfo = ref();
  const label = ref('');
  const UserStore = useUserStore();
  const schemas: FormSchema[] = [
    {
      field: 'consultant_type',
      label: '咨询师类型',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      slot: 'type',
    },
    {
      field: 'consultant_name',
      label: '咨询师姓名',
      component: 'Input',
      required: true,
      componentProps: {
        style: { width: '400px' },
        placeholder: '请输入咨询师姓名',
        showCount: true,
        maxlength: 12,
      },
    },
    {
      field: 'phone',
      label: '手机号',
      component: 'Input',
      required: true,
      slot: 'phone',
    },
    {
      field: 'law_firm_id',
      label: '所属执业单位',
      component: 'ApiSelect',
      required: true,
      ifShow: ({ values }) => !!values.consultant_type,
      componentProps: {
        style: { width: '400px' },
        api: getPracticeUnitNoPageList,
        resultField: 'list',
        labelField: 'name',
        valueField: 'law_firm_id',
        immediate: true,
        onChange: (_, v) => {
          label.value = v.label;
        },
      },
    },
  ];
  const [registerForm, { getFieldsValue, validate, resetFields }] = useForm({
    schemas,
    showActionButtonGroup: false,
    submitFunc: async () => {},
    labelWidth: '120px',
    colon: true,
    autoSetPlaceHolder: true,
  });
  function invite() {
    validate().then(() => {
      const params = getFieldsValue();
      if (!regTel(params.phone)) {
        message.error('请检查您输入的手机号');
        return;
      }
      inviteInfo.value = { ...params, label: label.value };
      inviteInConsultant(params).then(() => {
        openInviteJoinLetter(true, { inviteInfo: inviteInfo.value });
        closeModal();
      });
    });
  }
</script>

<style scoped></style>
