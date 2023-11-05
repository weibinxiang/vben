<template>
  <BasicModal
    @register="register"
    v-bind="$attrs"
    :title="`${!isEdit ? '新增' : '编辑'}评价`"
    showFooter
    @ok="submitFn"
  >
    <div class="p-4 w-full">
      <BasicForm @register="registerForm">
        <template #img>
          <div class="mt-3">
            <div class="flex">
              <div
                v-for="(item, index) in imgs"
                :key="item"
                class="relative w-[104px] h-[104px] mr-2"
              >
                <img :src="item" alt="" class="w-full h-full" />
                <CloseCircleFilled
                  @click="delImg(index)"
                  style="position: absolute; top: 3px; right: 3px"
                />
              </div>
              <Upload
                v-if="imgs.length < 3"
                :width="104"
                :height="104"
                :maxSize="5"
                @update:value="afterUpload"
              />
            </div>
            <div class="text-[14px] text-[rgba(0,0,0,45%)] leading-5 mt-2"
              >仅支持上传最多3张评论图片，文件大小建议不大于5MB。</div
            >
          </div>
        </template>
        <template #comment_date>
          <div class="min-h-8 flex items-center">
            <FormItemRest>
              <RadioGroup
                v-model:value="timeCreateType"
                :options="[
                  { label: '随机', value: 1 },
                  { label: '当前时间', value: 2 },
                  { label: '指定时间', value: 3 },
                ]"
              />
            </FormItemRest>
          </div>
          <DatePicker
            v-model:value="originTime"
            show-time
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择评论时间"
            style="width: 100%"
            v-if="timeCreateType === 3"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useDebounceFn } from '@vueuse/core';
  import { randomDate } from '/@/utils/index';
  import { BasicForm, useForm, FormSchema, defaultFormProps } from '/@/components/Form';
  import { saveOrderCommentModel } from '/@/api/order/list';
  import { message, RadioGroup, DatePicker, FormItemRest } from 'ant-design-vue';
  import Upload from '/@/components/yzkt/Upload.vue';
  import { getServiceTime } from '/@/api/sys/user';
  import { CloseCircleFilled } from '@ant-design/icons-vue';
  import dayjs from 'dayjs';

  const imgs = ref<string[]>([]);
  const originTime = ref('');
  const timeCreateType = ref(3);
  const zx_order_comment_model_id = ref(0);
  const randomTime = ref();
  const isEdit = ref(false);
  const emits = defineEmits(['success']);
  onMounted(() => {
    getServiceTime().then((res) => {
      randomTime.value = randomDate(res);
    });
  });
  const [register, { closeModal }] = useModalInner((task) => {
    resetFields();
    imgs.value = [];
    originTime.value = '';
    if (task.record) {
      isEdit.value = true;
      timeCreateType.value = 3;
      imgs.value = task.record.img || [];
      originTime.value = task.record.comment_date;
      zx_order_comment_model_id.value = task.record.zx_order_comment_model_id;
      setFieldsValue({
        content: task.record.content,
        star_level: task.record.star_level,
      });
    }
  });

  const schemas: FormSchema[] = [
    {
      field: 'content',
      label: '评价内容',
      required: true,
      component: 'InputTextArea',
      componentProps: {
        placeholder: '评价内容',
        showCount: true,
        maxlength: 300,
        style: { width: '328px' },
        autoSize: { minRows: 3 },
      },
    },
    {
      field: 'img',
      label: '评价图片',
      labelWidth: 77,
      component: 'Input',
      slot: 'img',
    },
    {
      field: 'star_level',
      label: '好评星级',
      labelWidth: 77,
      component: 'RadioButtonGroup',
      required: true,
      defaultValue: 5,
      componentProps: {
        options: [
          { label: '五颗星', value: 5 },
          { label: '四颗星', value: 4 },
        ],
      },
      colProps: { lg: 24, md: 24 },
    },
    {
      field: 'comment_date',
      label: '评价时间',
      labelWidth: 77,
      component: 'Input',
      slot: 'comment_date',
    },
  ];

  const submitFn = useDebounceFn(() => {
    validate().then(() => {
      let params: any = {
        comment_date:
          timeCreateType.value === 1
            ? randomTime.value
            : timeCreateType.value === 2
            ? dayjs(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss')
            : originTime.value,
        img: imgs.value,
        ...getFieldsValue(),
      };
      if (!params.comment_date) {
        params.comment_date = dayjs(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss');
      }
      if (zx_order_comment_model_id.value) {
        params = {
          ...params,
          zx_order_comment_model_id: zx_order_comment_model_id.value,
        };
      }
      saveOrderCommentModel(params).then(() => {
        message.success('操作成功');
        closeModal();
        emits('success');
      });
    });
  }, 300);

  const [registerForm, { getFieldsValue, validate, setFieldsValue, resetFields }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: false,
  });
  function afterUpload(val) {
    imgs.value.push(val);
    console.log(val, 'data.value.img');
  }
  function delImg(index) {
    imgs.value.splice(index, 1);
  }
  // function createRandomTime() {
  //   if (timeCreateType.value === 1) {
  //     if (curriculumCreatedTime.value) {
  //       data.value.comment_date = dayjs(
  //         randomIntNumber(dayjs(new Date()).valueOf(), dayjs().valueOf()),
  //       );
  //     } else {
  //       timeCreateType.value = 2;
  //     }
  //   } else {
  //     data.value.comment_date = '';
  //   }
  // }
</script>
