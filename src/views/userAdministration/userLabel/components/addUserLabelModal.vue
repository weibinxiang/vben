<template>
  <BasicModal
    @register="register"
    v-bind="$attrs"
    :title="`${!isEmpty(markList) ? '编辑' : '新增'}记录`"
    showFooter
    :footer="null"
  >
    <div class="p-4 w-full">
      <BasicForm @register="registerForm" />
      <div class="mt-10 flex justify-center">
        <a-button @click="closeModal">取消</a-button>
        <a-button type="primary" class="ml-6" @click="submitFn">保存</a-button>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useDebounceFn } from '@vueuse/core';
  import { isEmpty } from '/@/utils/is';
  import { BasicForm, useForm, FormSchema, defaultFormProps } from '/@/components/Form';
  import { addConsultantUserTag } from '/@/api/customer/list';
  import { message } from 'ant-design-vue';
  import { RoleEnum } from '/@/enums/roleEnum';
  import { useUserStore } from '/@/store/modules/user';

  const markList = ref();
  const emits = defineEmits(['onEdit']);
  const UserStore = useUserStore();
  let tag_id;

  const [register, { closeModal }] = useModalInner((task) => {
    resetFields();
    markList.value = task;
    tag_id = task?.record?.consultant_user_tag_id;
    setFieldsValue({
      tag_name: task?.record?.tag_name || '',
      remark: task?.record?.remark || '',
      category: task?.record?.category || 'all',
    });
  });

  const schemas: FormSchema[] = [
    {
      field: 'tag_name',
      label: '标签名称',
      required: true,
      component: 'Input',
      componentProps: {
        placeholder: '输入标签名称',
        showCount: true,
        maxlength: 10,
        style: { width: '328px' },
      },
    },
    // {
    //   field: 'remark',
    //   label: '标签备注',
    //   required: true,
    //   component: 'Input',
    //   componentProps: {
    //     showCount: true,
    //     maxlength: 10,
    //     placeholder: '输入标签备注',
    //     style: { width: '328px' },
    //   },
    // },
    {
      field: 'category',
      label: '使用范围',
      required: true,
      component: 'Select',
      defaultValue: 'all',
      componentProps: () => {
        const options = [{ label: '不限', value: 'all' }];
        if (UserStore.getRoleList.includes(RoleEnum.general_agent)) {
          options.push({ label: '普通咨询师', value: 'general' });
        }
        if (UserStore.getRoleList.includes(RoleEnum.lawyer_agent)) {
          options.push({ label: '法律咨询师', value: 'law' });
        }
        return {
          style: { width: '328px' },
          placeholder: '请选择使用范围',
          options: options,
        };
      },
    },
  ];

  const submitFn = useDebounceFn(() => {
    validate().then(() => {
      const prm = getFieldsValue();
      addConsultantUserTag({ ...prm, tag_id }).then(() => {
        message.success(`${tag_id ? '编辑' : '添加'}成功`);
        emits('onEdit');
        closeModal();
      });
    });
  }, 300);

  const [registerForm, { getFieldsValue, validate, setFieldsValue, resetFields }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: false,
  });
</script>
