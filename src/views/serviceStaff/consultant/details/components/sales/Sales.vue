<template>
  <div class="p-6 pb-20 sales-details bg-white min-h-full">
    <div class="flex">
      <div class="flex-1">
        <div class="font-bold text-base flex items-center mb-6"
          ><div class="w-1 h-4 bg-#1890FF mr-1"></div> 咨询服务
        </div>
        <Form
          :model="formData"
          :labelCol="{ style: { width: '100px' } }"
          :wrapperCol="{ style: { 'max-width': '500px' } }"
          ref="FormRef"
        >
          <div class="flex items-center ml-7 mb-3 flex-wrap">
            <div class="text-base font-bold flex items-center">
              <span class="mr-1">抖音</span>
              <SvgIcon name="dy" />
            </div>

            <div class="ml-6">
              <span class="text-gray-400 mr-3">{{ spreadText }}</span>
              <a-button type="link" class="!p-0 !h-0" @click="bindSpread" v-if="!spreadText"
                >立即绑定推广号</a-button
              >
              <a-button type="link" class="!p-0 !h-0" v-else @click="spreadDetail">详情</a-button>
            </div>
          </div>
          <FormItem
            label="一元咨询"
            name="dollar"
            required
            v-if="consultant.consultant_type === ConsultantType.ordinary"
          >
            <FormItemRest>
              <div class="mt-1 mb-2 flex justify-between">
                <div class="flex items-center">
                  <div>售卖状态：</div>
                  <Switch
                    v-model:checked="formData.dollar.status"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                </div>
                <div class="flex items-center">
                  <div>详情页展示：</div>
                  <Switch
                    v-model:checked="formData.dollar.is_recommend"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                </div>
              </div>
              <div class="flex items-center">
                <InputNumber
                  placeholder="价格"
                  v-model:value="formData.dollar.price"
                  :controls="false"
                  :min="0"
                  addon-after="元"
                />
                <span class="mx-4 leading-none text-#86909C text-xl">/</span>
                <div class="ant-input-number-group-wrapper">次</div>
              </div>
              <div class="text-#4E5969 text-xs mt-3"
                >咨询形式为一问一答，此咨询服务可用作为高价咨询服务的推广、低转高等营销场景中</div
              >
            </FormItemRest>
          </FormItem>
          <FormItem
            label="电话咨询"
            name="phone"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                validator: validatorPhone,
              },
            ]"
          >
            <FormItemRest>
              <div class="mt-1.3 mb-2 flex justify-between">
                <div class="flex items-center">
                  <div>售卖状态：</div>
                  <Switch
                    v-model:checked="formData.phone.status"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                </div>
                <div class="flex items-center">
                  <div>详情页展示：</div>
                  <Switch
                    v-model:checked="formData.phone.is_recommend"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                </div>
              </div>
              <div class="flex items-center">
                <InputNumber
                  placeholder="价格"
                  v-model:value="formData.phone.price"
                  :controls="false"
                  :min="0"
                  addon-after="元"
                  :disabled="!formData.phone.status"
                />
                <span class="mx-4 leading-none text-#86909C text-xl">/</span>
                <InputNumber
                  placeholder="时长"
                  v-model:value="formData.phone.duration"
                  :controls="false"
                  :min="0"
                  addon-after="分钟"
                  :disabled="!formData.phone.status"
                />
              </div>
            </FormItemRest>
          </FormItem>
          <FormItem
            label="图文咨询"
            name="text"
            :rules="[
              {
                required: true,
                trigger: 'blur',
                validator: validatorText,
              },
            ]"
          >
            <FormItemRest>
              <div class="mt-1 mb-2 flex justify-between">
                <div class="flex items-center">
                  <div>售卖状态：</div>
                  <Switch
                    v-model:checked="formData.text.status"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                </div>
                <div class="flex items-center">
                  <div>详情页展示：</div>
                  <Switch
                    v-model:checked="formData.text.is_recommend"
                    :checked-value="1"
                    :un-checked-value="0"
                  />
                </div>
              </div>
              <div class="flex items-center">
                <InputNumber
                  placeholder="价格"
                  v-model:value="formData.text.price"
                  :controls="false"
                  :min="0"
                  addon-after="元"
                  :disabled="!formData.text.status"
                />
                <span class="mx-4 leading-none text-#86909C text-xl">/</span>
                <InputNumber
                  placeholder="时长"
                  v-model:value="formData.text.duration"
                  :controls="false"
                  :min="0"
                  addon-after="分钟"
                  :disabled="!formData.text.status"
                />
              </div>
            </FormItemRest>
          </FormItem>
        </Form>
      </div>
      <div class="w-300px h-610px">
        <PhonePreview :consultant="previewData" :width="300" />
      </div>
    </div>

    <div class="absolute bottom-0 left-0 w-full px-4">
      <div class="bg-white pt-4 pb-3 rounded-t-4" style="box-shadow: 0 0 20px 0 rgb(0 0 0 / 12%)">
        <a-button type="primary" class="ml-4" @click="submit" :loading="loading">保存修改</a-button>
      </div>
    </div>

    <EmpowerModal @register="registerEmpowerModal" :z-index="998" />
    <EmpowerAccountModal
      @register="registerEmpowerAccountModal"
      @add-spread="bindSpread"
      :z-index="997"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, PropType } from 'vue';
  import { Form, FormItem, FormItemRest, InputNumber, message, Switch } from 'ant-design-vue';
  import { SvgIcon } from '/@/components/Icon';
  import {
    SaveConsultantSkuParams,
    ConsultantDetailModel,
    ConsultantSpreadItem,
    ConsultantType,
    SkuType,
  } from '/@/api/serviceStaff/model/consultant';
  import { useRoute } from 'vue-router';
  import {
    getConsultantSku,
    saveConsultantSku,
    getConsultantSpread,
  } from '/@/api/serviceStaff/consultant';
  import { useModal } from '/@/components/Modal';
  import EmpowerAccountModal from './components/EmpowerAccountModal.vue';
  import EmpowerModal from './components/EmpowerModal.vue';
  import PhonePreview from '../phonePreview/PhonePreview.vue';

  const props = defineProps({
    consultant: {
      type: Object as PropType<ConsultantDetailModel>,
      default: () => ({}),
    },
  });
  const FormRef = ref();
  //  后端数据结构暂时没有快手微信
  const formData = ref({
    text: {
      duration: 0,
      price: 0,
      status: 0,
      is_recommend: 1,
    },
    phone: {
      duration: 0,
      price: 0,
      status: 0,
      is_recommend: 1,
    },
    dollar: {
      price: 1,
      status: 1,
      is_recommend: 1,
    },
  });

  const route = useRoute();
  const loading = ref(false);
  const spreadList = ref<ConsultantSpreadItem[]>([]);
  const spreadText = computed(() => {
    let text = '';
    const names = spreadList.value.map((v) => v.nickname);
    if (names.length) {
      text = '已绑定' + spreadList.value[0].nickname;
      if (names.length > 1) {
        text += `等${names.length - 1}个推广号`;
      }
    }
    return text;
  });

  const previewData = computed(() => {
    const skus = [] as any;
    for (const k in formData.value) {
      if (formData.value[k].status) {
        skus.push({
          type: SkuType[k],
          consultant_id: +route.params.id,
          price: formData.value[k].price * 100,
          duration: formData.value[k].duration,
          status: formData.value[k].status,
          is_recommend: formData.value[k].is_recommend,
        });
      }
    }
    const data = {
      ...props.consultant,
      consultant_skus: skus,
    };
    return data;
  });

  const [registerEmpowerModal, { openModal: openEmpowerModal }] = useModal();
  const [registerEmpowerAccountModal, { openModal: openEmpowerAccountModal }] = useModal();

  if (route.params.id) {
    getConsultantSku({ consultant_id: +route.params.id }).then((res) => {
      const key = ['', 'phone', 'text', 'dollar'];
      res.forEach((item) => {
        const k = key[item.type];
        formData.value[k] = {
          duration: item.duration,
          price: item.price / 100,
          status: item.status,
          is_recommend: item.is_recommend,
        };
      });
      if (props.consultant.consultant_type === ConsultantType.lawyer) {
        formData.value.dollar.status = 0;
      }
    });
    getConsultantSpread({ consultant_id: +route.params.id }).then((res) => {
      spreadList.value = res.dy;
    });
  }

  function validatorPhone(_, value) {
    if (value.status && (!value.price || !value.duration)) {
      return Promise.reject('请确认信息是否填写完整');
    }
    return Promise.resolve();
  }

  function validatorText(_, value) {
    if (value.status && (!value.price || !value.duration)) {
      return Promise.reject('请确认信息是否填写完整');
    }
    return Promise.resolve();
  }

  function bindSpread() {
    openEmpowerModal(true, { consultant_id: +route.params.id });
  }

  function spreadDetail() {
    openEmpowerAccountModal(true, {
      spreadList: spreadList.value,
    });
  }

  function submit() {
    FormRef.value.validate().then(() => {
      loading.value = true;
      const data: SaveConsultantSkuParams['sku_data'] = [
        {
          type: 1,
          consultant_id: +route.params.id,
          price: formData.value.phone.price * 100,
          duration: formData.value.phone.duration,
          status: formData.value.phone.status,
          is_recommend: formData.value.phone.is_recommend,
        },
        {
          type: 2,
          consultant_id: +route.params.id,
          price: formData.value.text.price * 100,
          duration: formData.value.text.duration,
          status: formData.value.text.status,
          is_recommend: formData.value.text.is_recommend,
        },
        {
          type: 3,
          consultant_id: +route.params.id,
          price: formData.value.dollar.price * 100,
          status: formData.value.dollar.status,
          is_recommend: formData.value.dollar.is_recommend,
        },
      ];

      saveConsultantSku({ sku_data: data })
        .then(() => {
          message.success('保存成功');
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
</script>
