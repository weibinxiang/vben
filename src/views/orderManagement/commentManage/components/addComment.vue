<template>
  <Modal v-bind="$attrs" @ok="submit" :confirmLoading="loading">
    <div class="text-gray-400 pl-15 pr-10 pt-4"
      >请勿上传<span class="text-danger">低质量、重复、涉黄涉政</span
      >的评价，情节严重者将关闭您的虚拟评价功能</div
    >
    <div class="w-12/12 md:pr-10 m-auto pt-4 pb-10">
      <Form :model="data" :rules="rules" :labelCol="{ span: 6 }" ref="refForm">
        <FormItem name="sku_type" label="咨询类型">
          <RadioGroup v-model:value="data.sku_type">
            <RadioButton :value="1">电话咨询</RadioButton>
            <RadioButton :value="2">图文咨询</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem required name="content" label="评价内容">
          <a-textarea
            v-model:value="data.content"
            show-count
            :maxlength="50"
            placeholder="请填写评价内容"
          />
        </FormItem>
        <FormItem name="img" label="评价图片">
          <div class="flex">
            <div v-for="item in data.img" :key="item" class="w-[104px] h-[104px] mr-2">
              <Image :src="item" alt="" />
            </div>
            <Upload
              v-if="data.img.length < 3"
              :width="104"
              :height="104"
              :maxSize="5"
              @update:value="afterUpload"
            />
          </div>
          <div class="text-[14px] text-[rgba(0,0,0,45%)] leading-5 mt-2"
            >仅支持上传最多3张评论图片，文件大小建议不大于5MB。</div
          >
        </FormItem>
        <FormItem name="star_level" label="好评星级">
          <RadioGroup v-model:value="data.star_level">
            <RadioButton :value="5">五颗星</RadioButton>
            <RadioButton :value="4">四颗星</RadioButton>
          </RadioGroup>
          <div class="text-[14px] text-[rgba(0,0,0,45%)] leading-5 mt-2"
            >星级将会影响咨询师展示页好评率及满意度，多量五星搭配一至两个四星将会营造更真实的评价氛围。</div
          >
        </FormItem>
        <FormItem name="comment_time" label="评价时间">
          <FormItemRest>
            <div class="min-h-8 flex items-center">
              <RadioGroup
                v-model:value="timeCreateType"
                :options="[
                  { label: '随机', value: 1 },
                  { label: '当前时间', value: 2 },
                  { label: '指定时间', value: 3 },
                ]"
              />
            </div>
          </FormItemRest>
          <DatePicker
            v-model:value="data.comment_time"
            show-time
            placeholder="请选择评论时间"
            format="YYYY-MM-DD HH:mm:ss"
            valueFormat="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
            v-if="timeCreateType === 3"
          />
        </FormItem>
        <FormItem name="is_show" label="是否公开">
          <Switch v-model:checked="data.is_show" class="switch" />
        </FormItem>
        <FormItem name="is_top" label="是否置项">
          <Switch v-model:checked="data.is_top" class="switch" />
        </FormItem>
      </Form>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import {
    Modal,
    Form,
    FormProps,
    Switch,
    message,
    DatePicker,
    Radio,
    RadioButton,
    Image,
  } from 'ant-design-vue';
  import { saveOrderComment } from '/@/api/order/list';

  import { randomDate } from '/@/utils';
  import Upload from '/@/components/yzkt/Upload.vue';
  import dayjs from 'dayjs';
  import { getServiceTime } from '/@/api/sys/user';

  interface dataModel {
    is_top: number;
    content: string;
    comment_time: any;
    sku_type: number;
    img: string[];
    star_level: number;
    is_show: number;
  }
  const emit = defineEmits(['success']);
  const refForm = ref();
  const RadioGroup = Radio.Group;
  const FormItemRest = Form.ItemRest;
  const FormItem = Form.Item;
  const props = defineProps({
    consultantId: {
      type: Number,
      default: 0,
    },
  });
  const timeCreateType = ref(1);
  const rules: FormProps['rules'] = {
    content: [{ required: true, type: 'string', message: '请输入评论内容', trigger: 'change' }],
  };
  const randomTime = ref('');
  const loading = ref(false);
  const data = ref<dataModel>({
    is_top: 0,
    sku_type: 1,
    content: '',
    comment_time: '',
    img: [],
    star_level: 5,
    is_show: 0,
  });
  function afterUpload(val) {
    data.value.img.push(val);
  }
  onMounted(() => {
    getServiceTime().then((res) => {
      randomTime.value = randomDate(res);
    });
  });
  const submit = () => {
    refForm.value.validate().then(() => {
      if (!loading.value) {
        loading.value = true;
        const formData = {
          consultant_id: props.consultantId,
          sku_type: data.value.sku_type,
          content: data.value.content,
          img: data.value.img,
          star_level: data.value.star_level,
          is_top: Number(data.value.is_top),
          is_show: Number(data.value.is_show),
          created_at:
            timeCreateType.value === 1
              ? randomTime.value
              : timeCreateType.value === 2
              ? dayjs(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss')
              : data.value.comment_time,
        };
        console.log(formData, 'formData---------');
        if (!formData.created_at) {
          formData.created_at = dayjs(new Date().getTime()).format('YYYY/MM/DD HH:mm:ss');
        }
        saveOrderComment(formData)
          .then(() => {
            message.success('添加成功！');
            emit('success');
            data.value = {
              is_top: 0,
              sku_type: 1,
              content: '',
              comment_time: '',
              img: [],
              star_level: 5,
              is_show: 0,
            };
          })
          .finally(() => {
            loading.value = false;
          });
      }
    });
  };
</script>

<style lang="less" scoped>
  .upload {
    ::v-deep(.avatar-uploader) {
      .ant-upload {
        border-radius: 50%;
      }
    }
  }
</style>
