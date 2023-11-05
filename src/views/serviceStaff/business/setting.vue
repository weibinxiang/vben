<template>
  <PageWrapper content-full-height content-background>
    <div class="py-8 px-4 max-w-200 p">
      <Form
        :model="formData"
        :rules="rules"
        ref="FormRef"
        :labelCol="{ style: { width: '120px' } }"
      >
        <FormItem label="单位类型" name="firm_type" required>
          <RadioGroup v-model:value="formData.firm_type" button-style="solid">
            <RadioButton :value="1">咨询师事务所</RadioButton>
            <RadioButton :value="2">法律咨询公司</RadioButton>
          </RadioGroup>
        </FormItem>
        <FormItem label="单位全称" name="name" required>
          <Input v-model:value="formData.name" placeholder="请输入律所/公司名称" />
        </FormItem>
        <FormItem label="单位logo" name="logo" required>
          <div class="flex flex-wrap items-center upload-box">
            <Upload
              v-model:value="formData.logo"
              :need-cropper="true"
              :cropper="{ options: { aspectRatio: 1 } }"
              :width="104"
              :height="104"
              title="上传logo"
            />
            <div class="py-2 pl-2 sm:pl-6 text-gray-400">
              建议比例为
              <span class="text-#1890FF">1:1</span> ，<br />文件大小小于
              <span class="text-#1890FF">2MB</span>，<br />保持视觉元素居中
            </div>
          </div>
        </FormItem>
        <FormItem label="营业执照号" name="business_license" required>
          <Input v-model:value="formData.business_license" placeholder="请输入营业执照号" />
        </FormItem>
        <FormItem label="公司地区" name="address" required>
          <Cascader
            v-model:value="formData.address"
            :options="addressOption"
            placeholder="公司地区"
            :fieldNames="{ label: 'value' }"
          />
        </FormItem>
        <FormItem label="执照照片" name="license_photo" required>
          <div class="flex flex-wrap items-center upload-box">
            <Upload v-model:value="formData.license_photo" :width="104" :height="104" />
            <div class="py-2 pl-2 sm:pl-6 text-gray-400">
              示例图：
              <img src="/src/assets/images/licenseExample.png" class="w-25 block mt-1" />
            </div>
          </div>
        </FormItem>
        <FormItem label="有效时间" name="time" required>
          <FormItemRest>
            <div class="flex items-center">
              <RangePicker
                v-model:value="formData.time"
                :disabled="!!formData.long_term"
                value-format="YYYY-MM-DD"
              />
              <div class="ml-4"
                >长期有效<Switch
                  v-model:checked="formData.long_term"
                  :checkedValue="1"
                  :unCheckedValue="0"
                  class="!ml-2"
                  @change="changeLongTerm"
                />
              </div>
            </div>
          </FormItemRest>
        </FormItem>
      </Form>

      <div class="ml-30 mt-8">
        <a-button
          type="danger"
          class="mr-4"
          @click="handleDel"
          v-if="route.params?.id"
          :loading="delLoading"
          >删除单位</a-button
        >
        <a-button type="primary" @click="submit" :loading="loading">保存提交审核</a-button>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import {
    Form,
    FormProps,
    FormItemRest,
    RadioGroup,
    RadioButton,
    Input,
    RangePicker,
    Switch,
    Cascader,
    message,
    Modal,
  } from 'ant-design-vue';
  import Upload from '/@/components/yzkt/Upload.vue';
  import {
    getAddressList,
    createPracticeUnit,
    getPracticeUnitDetail,
    delPracticeUnit,
  } from '/@/api/serviceStaff/business';
  import { useRouter, useRoute } from 'vue-router';

  const FormItem = Form.Item;

  const router = useRouter();
  const route = useRoute();
  const FormRef = ref();
  const formData = ref({
    firm_type: 1,
    name: '',
    logo: '',
    business_license: '',
    license_photo: '',
    time: [] as string[] as [string, string],
    address: [] as string[],
    long_term: 0,
  });
  const rules = ref<FormProps['rules']>({
    logo: [{ required: true, message: '请上传单位logo', trigger: 'blur' }],
    address: [
      {
        required: true,
        validator: () => {
          if (formData.value.address.length < 2) {
            return Promise.reject('请选择公司地区');
          }
          return Promise.resolve();
        },
      },
    ],
    license_photo: [{ required: true, message: '请上传执照照片', trigger: 'blur' }],
    time: [
      {
        required: true,
        validator: () => {
          if (!formData.value.time.length && !formData.value.long_term) {
            return Promise.reject('请选择有效时间');
          }
          return Promise.resolve();
        },
      },
    ],
  });
  const addressOption = ref<any[]>([]);
  const loading = ref(false);
  const delLoading = ref(false);

  if (route.params?.id) {
    getPracticeUnitDetail({ law_firm_id: +route.params.id }).then((res) => {
      formData.value = {
        firm_type: res.firm_type,
        name: res.name,
        logo: res.logo,
        business_license: res.business_license,
        license_photo: res.license_photo,
        time: [res.valid_begin_time, res.valid_end_time],
        address: [res.province, res.city],
        long_term: res.long_term,
      };
    });
  }

  getAddressList().then((res) => {
    res.forEach((val) => val.children.forEach((v) => (v.children = null)));
    addressOption.value = res;
  });

  function changeLongTerm() {
    // @ts-ignore
    formData.value.time = [];
  }

  function handleDel() {
    Modal.confirm({
      title: '是否确认删除？',
      content: '删除后，已添加的单位信息将被清除!',
      onOk() {
        delLoading.value = true;
        delPracticeUnit({ law_firm_id: +route.params.id })
          .then(() => {
            message.success('删除成功');
            router.back();
          })
          .finally(() => {
            delLoading.value = false;
          });
      },
    });
  }

  function submit() {
    FormRef.value?.validate().then(() => {
      loading.value = true;
      const data = {
        law_firm_id: route.params.id,
        province: formData.value.address[0],
        city: formData.value.address[1],
        valid_begin_time: formData.value.time[0],
        valid_end_time: formData.value.time[1],
        short_name: '',
        ...formData.value,
      };
      createPracticeUnit(data)
        .then(() => {
          message.success('添加成功');
          router.back();
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
</script>
