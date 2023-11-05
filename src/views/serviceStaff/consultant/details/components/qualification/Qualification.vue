<template>
  <div class="p-6 pb-20 sales-details min-h-full bg-white">
    <Form
      :model="formData"
      :rules="rules"
      :labelCol="{ style: { width: '100px' } }"
      :wrapperCol="{ style: { 'max-width': '500px' } }"
      ref="FormRef"
    >
      <div class="font-bold text-base flex items-center mb-6"
        ><div class="w-1 h-4 bg-#1890FF mr-1"></div> 实名认证
      </div>
      <FormItem label="身份证号" name="id_card_number" required>
        <a-input placeholder="请输入身份证号" v-model:value="formData.id_card_number" />
      </FormItem>
      <FormItem label="身份证件" name="id_card_back" required>
        <FormItemRest>
          <div class="flex flex-wrap items-center">
            <Upload
              v-model:value="formData.id_card_back"
              :width="168"
              :height="104"
              title="国徽面上传"
            />
            <div class="py-2 pl-2 sm:pl-6 text-gray-400">
              示例图：
              <img
                :src="idCardBackExample"
                class="w-42 block mt-1 cursor-pointer"
                @click="preview(idCardBackExample)"
              />
            </div>
          </div>
          <div class="flex flex-wrap items-center mt-2">
            <Upload
              v-model:value="formData.id_card_head"
              :width="168"
              :height="104"
              title="人像面上传"
            />
            <div class="py-2 pl-2 sm:pl-6 text-gray-400">
              示例图：
              <img
                :src="idCardHeadExample"
                class="w-42 block mt-1 cursor-pointer"
                @click="preview(idCardHeadExample)"
              />
            </div>
          </div>
        </FormItemRest>
      </FormItem>
      <template v-if="consultantType === ConsultantType.lawyer">
        <div class="font-bold text-base flex items-center mb-6"
          ><div class="w-1 h-4 bg-#1890FF mr-1"></div> 资质认证
        </div>
        <FormItem label="执业单位" name="phone">{{ consultant?.law_firm?.name }}</FormItem>
        <FormItem label="执业证号" name="licence" required>
          <a-input placeholder="请输入执业证号" v-model:value="formData.licence" />
        </FormItem>
        <FormItem label="执业证件" name="image_url" required>
          <div class="flex flex-wrap items-center">
            <Upload
              v-model:value="formData.image_url"
              :width="168"
              :height="140"
              title="上传执业证件"
              subTitle=""
            />
            <div class="py-2 pl-2 sm:pl-6 text-gray-400">
              示例图：
              <img
                :src="certificateExample"
                class="w-30 block mt-1 cursor-pointer"
                @click="preview(certificateExample)"
              />
            </div>
          </div>
        </FormItem>
      </template>
    </Form>

    <div class="absolute bottom-0 left-0 w-full px-4">
      <div class="bg-white pt-4 pb-3 rounded-t-4" style="box-shadow: 0 0 20px 0 rgb(0 0 0 / 12%)">
        <a-button type="primary" class="ml-4" @click="submit" :loading="loading">保存修改</a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType } from 'vue';
  import { Form, FormItemRest, FormItem, FormProps, message } from 'ant-design-vue';
  import Upload from '/@/components/yzkt/Upload.vue';
  import { createImgPreview } from '/@/components/Preview';
  import idCardBackExample from '/@/assets/images/id_card_back_example.jpg';
  import idCardHeadExample from '/@/assets/images/id_card_head_example.jpg';
  import certificateExample from '/@/assets/images/certificate_example.jpg';
  import { saveQualification, getQualification } from '/@/api/serviceStaff/consultant';
  import { useRouter, useRoute } from 'vue-router';
  import { QualificationModel, ConsultantType } from '/@/api/serviceStaff/model/consultant';

  defineProps({
    consultantType: {
      type: Number as PropType<ConsultantType>,
      default: ConsultantType.ordinary,
    },
  });

  const FormRef = ref();
  const router = useRouter();
  const route = useRoute();
  const loading = ref(false);
  const consultant = ref<QualificationModel>();
  const formData = ref({
    id_card_number: '',
    id_card_back: '',
    id_card_head: '',
    licence: '',
    image_url: '',
  });
  const rules = ref<FormProps['rules']>({
    id_card_number: [
      { required: true, message: '请输入身份证号码' },
      {
        pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
        message: '请输入正确的身份证号码',
      },
    ],
    id_card_back: [
      {
        required: true,
        trigger: 'blur',
        validator: () => {
          if (!formData.value.id_card_back || !formData.value.id_card_head) {
            return Promise.reject('请上传身份正反面');
          }
          return Promise.resolve();
        },
      },
    ],
    image_url: [{ required: true, message: '请上传执业证件', trigger: 'blur' }],
  });

  if (route.params.id) {
    getQualification({ consultant_id: +route.params.id }).then((res) => {
      consultant.value = res;
      formData.value = {
        id_card_number: res.consultant_info.id_card_number,
        id_card_back: res.consultant_info.id_card_back,
        id_card_head: res.consultant_info.id_card_head,
        licence: res.consultant_info.licence,
        image_url: res.licence_image?.image_url,
      };
    });
  }

  function preview(img) {
    createImgPreview({ imageList: [img] });
  }

  function submit() {
    FormRef.value?.validate().then(() => {
      loading.value = true;
      saveQualification({ consultant_id: +route.params.id, consultant_info: formData.value })
        .then(() => {
          message.success('提交成功');
          router.back();
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
</script>
