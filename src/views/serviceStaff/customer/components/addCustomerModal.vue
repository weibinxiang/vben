<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="520"
    :min-height="400"
    :title="`${isEdit ? '编辑' : '新增'}客服人员`"
    okText="确定"
    :canFullscreen="false"
    :cancelText="isEdit ? '修改' : '取消'"
    destroyOnClose
  >
    <div class="addCustomer-details">
      <BasicForm @register="registerForm">
        <template #author="{ model }">
          <RadioGroup v-model:value="codeType" button-style="solid" class="w-300px !mb-10px">
            <RadioButton :value="0">自定义</RadioButton>
            <RadioButton :value="1">系统默认头像</RadioButton>
          </RadioGroup>
          <Upload
            v-if="!codeType"
            v-model:value="model.avatar"
            :width="160"
            :height="160"
            :need-cropper="true"
            :cropper="{ options: { aspectRatio: 3 / 3 }, showCircle: true, showRect: false }"
            @update:value="afterUpload"
          />
          <img
            class="w-40 h-40"
            src="https://ttmini.oss-cn-shenzhen.aliyuncs.com/yzStarMap/20230914-182747.png"
            v-else
            alt=""
          />
        </template>
      </BasicForm>
    </div>
    <template #footer>
      <a-button @click="handleCancel" v-if="isEdit">修改</a-button>
      <a-button @click="closeModal" v-else>取消</a-button>
      <a-button @click="submit" type="primary">确认</a-button>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema, defaultFormProps } from '/@/components/Form';
  // import { useDebounceFn } from '@vueuse/core';
  import { Radio, message } from 'ant-design-vue';
  import Upload from '/@/components/yzkt/Upload.vue';
  import { addOrEditCustomer } from '/@/api/customerService/list';
  import { AddOrEditCustomerModel } from '/@/api/customerService/model/listModel';
  import { isEmpty } from '/@/utils/is';

  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const emits = defineEmits(['onEdit']);
  const isEdit = ref(false);
  const codeType = ref(0);
  const customer_id = ref('');

  const [register, { closeModal }] = useModalInner((data) => {
    isEdit.value = !isEmpty(data);
    if (data?.record) {
      customer_id.value = data?.record?.customer_id;
      setFieldsValue({
        phone: data.record.phone,
        name: data.record.name,
        remark: data.record.remark,
        avatar: data.record.avatar,
        status: data.record.status,
      });
    }
  });

  const schemas: FormSchema[] = [
    {
      field: 'phone',
      label: '手机号',
      component: 'Input',
      rules: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[1-9][0-9]{9}$/, message: '请输入正确的手机号' },
      ],
      componentProps: {
        placeholder: '输入手机号',
      },
    },
    {
      field: 'name',
      label: '名称',
      component: 'Input',
      required: true,
      componentProps: {
        placeholder: '输入名称',
      },
    },
    {
      field: 'remark',
      label: '备注',
      component: 'Input',
      required: false,
      componentProps: {
        placeholder: '输入备注',
      },
    },
    {
      field: 'avatar',
      label: '头像',
      component: 'Input',
      required: true,
      slot: 'author',
    },
    {
      field: 'status',
      label: '状态',
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 0,
      componentProps: {
        options: [
          { label: '启用', value: 1 },
          { label: '禁用', value: 0 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
      colProps: { lg: 24, md: 24 },
    },
  ];

  // const submitFn = useDebounceFn(async () => {
  //   await validate();
  //   const getFields = getFieldsValue();
  //   console.log('getFields', getFields);
  //   // return Promise.resolve();
  // }, 300);

  const [registerForm, { submit, getFieldsValue, setFieldsValue, validate }] = useForm({
    ...defaultFormProps,
    schemas,
    labelWidth: 60,
    showActionButtonGroup: false,
    submitFunc: async () => {
      if (codeType.value === 1) {
        setFieldsValue({
          avatar: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/yzStarMap/20230914-182747.png',
        });
      }
      await validate();
      const getFields = getFieldsValue() as AddOrEditCustomerModel;
      getFields.customer_id = customer_id.value;
      console.log('getFields', getFields);
      addOrEditCustomer({ ...getFields }).then((res) => {
        console.log('res', res);
        message.success(customer_id.value ? '编辑成功' : '添加成功');
        emits('onEdit');
        closeModal();
      });
      // return Promise.resolve();
    },
  });

  function handleCancel() {
    console.log('确定');
    if (isEdit.value) emits('onEdit');
    closeModal();
  }

  function afterUpload(val) {
    console.log('val', val);
    // teaching.cover_url = val;
  }
</script>

<style lang="less">
  // .detailsModal {
  //   .ant-modal-body > .scrollbar {
  //     padding: 0;
  //   }
  // }

  // .qualifications-details {
  //   @apply px-5 py-4;
  // }
</style>
