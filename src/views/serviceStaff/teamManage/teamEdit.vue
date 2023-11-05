<template>
  <PageWrapper content-full-height content-background class="relative">
    <div class="py-8 px-4 max-w-240">
      <Form
        :model="formData"
        :rules="rules"
        ref="FormRef"
        :labelCol="{ style: { width: '120px' } }"
      >
        <div class="text-#262626 text-base font-semibold flex items-center mb-7">
          <div class="bg-#1890FF rounded-90px w-2px h-14px mr-2"></div>
          基础信息</div
        >
        <FormItem label="团队负责人：" name="principal_id" required>
          <div class="text-gray-400 text-sm mt-6px">
            <div>1、团队负责人拥有团队的推广权限（可通过该咨询师的推广账号推广此团队）； </div>
            <div>2、不会展示在团队咨询师列表中，但允许在咨询师列表添加负责人； </div>
          </div>
          <a-button
            type="dashed"
            pre-icon="ant-design:plus-outlined"
            class="mt-6"
            @click="openEidtDilog(false)"
            >选择咨询师</a-button
          >
          <div v-if="headLayer.length">
            <div
              v-for="item in headLayer"
              :key="item.consultant_id"
              class="w-60 h-16 flex items-center border-#F0F0F0 border-1px relative rounded mt-7 px-4"
            >
              <Icon
                icon="ant-design:close-circle-filled"
                :size="18"
                class="absolute -right-2 -top-2 cursor-pointer"
                @click="headLayer = []"
              />
              <img :src="item?.consultant_avatar?.image_url" class="w-10 h-10 rounded-full mr-2" />
              <div>{{ item.name }}</div>
            </div>
          </div>
        </FormItem>
        <FormItem label="团队名称" name="group_name" required>
          <Input
            v-model:value="formData.group_name"
            placeholder="请输入团队名称"
            :maxlength="20"
            style="width: 50%"
          />
        </FormItem>
        <FormItem label="团队咨询师：" name="group_consultant" required>
          <div class="text-gray-400 text-sm mt-6px">
            <div>团队中第1名咨询师默认为点亮咨询师，可设置职称头衔 </div>
          </div>
          <a-button
            type="dashed"
            pre-icon="ant-design:plus-outlined"
            class="mt-6"
            @click="openEidtDilog(true)"
            >选择咨询师</a-button
          >
          <div v-if="lawyerList.length" class="flex flex-wrap">
            <div
              v-for="(item, index) in lawyerList"
              :key="item.consultant_id"
              class="w-60 h-16 flex items-center border-#F0F0F0 border-1px relative rounded mt-7 px-4 mr-2 flex-shrink-0"
            >
              <Icon
                icon="ant-design:close-circle-filled"
                :size="18"
                class="absolute -right-2 -top-2 cursor-pointer"
                @click="deleteLawyer(item.consultant_id)"
              />
              <img :src="item?.consultant_avatar?.image_url" class="w-10 h-10 rounded-full mr-2" />
              <div>
                <div>{{ item.name }}</div>
                <div v-if="index === 0 && !editPositionName" class="flex items-center text-#8c8c8c"
                  >{{ '职称：' + positionName }}

                  <Icon
                    icon="ant-design:edit-filled"
                    :size="18"
                    class="cursor-pointer"
                    @click="editPositionName = true"
                  />
                </div>
                <InputSearch
                  v-model:value="positionName"
                  placeholder="请输入"
                  @search="editPositionName = false"
                  size="small"
                  show-count
                  :maxlength="6"
                  v-else-if="index === 0"
                  class="input-search"
                >
                  <template #enterButton>
                    <Icon
                      icon="ant-design:check-outlined"
                      :size="18"
                      class="cursor-pointer"
                      @click="editPositionName = true"
                    />
                  </template>
                </InputSearch>
              </div>
            </div>
          </div>
        </FormItem>
        <FormItem label="上传团队照片" name="group_image" required>
          <div class="flex flex-wrap items-center upload-box">
            <Upload
              v-model:value="formData.group_image"
              :need-cropper="true"
              :cropper="{ options: { aspectRatio: 4 / 3 } }"
              :width="104"
              :height="104"
              title="上传团队照片"
            />
            <div class="py-2 pl-2 sm:pl-6 text-gray-400">
              1、图片尺寸比例为4:3,建议尺寸为920*690px
              <br />2、优质的封面会极大增加曝光度哦～ <br />3、请上传小于3M的图片
            </div>
          </div>
        </FormItem>
        <div class="text-#262626 text-base font-semibold flex items-center mb-7">
          <div class="bg-#1890FF rounded-90px w-2px h-14px mr-2"></div>
          营销信息</div
        >
        <FormItem
          label="团队人数"
          name="group_num"
          required
          extra="团队人数不一定与添加咨询师数量相等，可自由填写"
          class="number-input"
        >
          <InputNumber v-model:value="formData.group_num" placeholder="请输入团队人数" :min="0" />
        </FormItem>
        <FormItem label="团队招牌领域" name="group_domain" required extra="请选择5个案件擅长的类型">
          <Select
            v-model:value="formData.group_domain"
            mode="multiple"
            style="width: 50%"
            placeholder="请选择团队的招牌领域"
            :options="domainOption"
            :fieldNames="{
              value: 'domain_id',
              label: 'domain',
            }"
          />
        </FormItem>
        <FormItem
          label="服务人数"
          name="virtual_service_count"
          required
          extra="初始服务人数作为购买咨询人数的基础数据，展示的服务人数=虚拟初始值+真实咨询数"
        >
          <div class="flex items-center">
            服务人数=
            <InputNumber
              v-model:value="formData.virtual_service_count"
              placeholder="请输入初始服务人数"
              addon-after="人"
              class="mx-1"
              :min="0"
              :max="99999"
            />
            ＋真实服务次数
          </div>
        </FormItem>
        <FormItem
          label="成功案例"
          name="case_duration"
          required
          extra="展示时长=虚拟初始成功案例+真实咨询案例数"
        >
          <div class="flex items-center">
            成功案例=
            <InputNumber
              v-model:value="formData.case_duration"
              placeholder="请输入初始成功案例数"
              addon-after="个"
              class="mx-1"
              :min="0"
            />
            ＋真实案例数
          </div>
        </FormItem>
        <FormItem label="案例经验">
          <Alert
            message="此处系统自动汇总展示各个团队成员咨询师的案件经历，若更改请在对应咨询师信息处编辑"
            type="info"
            show-icon
          />
        </FormItem>
      </Form>

      <div class="ml-30 mt-8">
        <a-button type="primary" :loading="loading" @click="submit">保存</a-button>
      </div>
    </div>
    <SelectDilog
      :lawFirmList="lawFirmList"
      :isMultiple="isMultiple"
      :lawyerList="lawyerList"
      v-model:visible="visible"
      @get-select-list="getSelectList"
    />

    <PhoneImg
      class="absolute top-12 right-12"
      :formData="formData"
      :domainOption="domainOption"
      :lawyerList="lawyerList"
      :positionName="positionName"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { Icon } from '/@/components/Icon';
  import {
    Form,
    FormProps,
    Input,
    Alert,
    Select,
    InputSearch,
    InputNumber,
    message,
  } from 'ant-design-vue';
  import Upload from '/@/components/yzkt/Upload.vue';
  import SelectDilog from './components/selectDilog.vue';
  import PhoneImg from './components/phoneImg.vue';
  import { getPracticeUnitNoPageList } from '/@/api/serviceStaff/business';
  import { ConsultantItemModel, DomainModel } from '/@/api/serviceStaff/model/consultant';
  import { getConsultantDomain } from '/@/api/serviceStaff/consultant';
  import { saveGroupInfo, getGroupDetail } from '/@/api/serviceStaff/team';
  import { useRouter, useRoute } from 'vue-router';

  const FormItem = Form.Item;
  const lawFirmList = ref<{ law_firm_id: number; logo: string; name: string }[]>([]);
  const FormRef = ref();
  const isMultiple = ref(false);
  const visible = ref(false);
  const router = useRouter();
  const route = useRoute();

  const positionName = ref('主任咨询师');
  const headLayer = ref<ConsultantItemModel[]>([]);
  const lawyerList = ref<ConsultantItemModel[]>([]);
  const editPositionName = ref(false);

  if (route.params?.group_id) {
    getGroupDetail({ group_id: Number(route.params?.group_id) }).then((res) => {
      formData.value = {
        group_image: res?.group_image?.image_url,
        group_name: res.name,
        group_num: res.group_info?.group_num,
        virtual_service_count: res.group_info.virtual_service_count,
        case_duration: res.group_info.case_duration,
        group_domain: res.group_domain.map((item) => item.domain_id),
        group_consultant: [],
        principal_id: '',
      };
      positionName.value = res.group_consultant[0]?.consultant_info?.grade || '主任咨询师';
      headLayer.value = [res.principal];
      lawyerList.value = res.group_consultant;
    });
  }
  const formData = ref({
    principal_id: '' as number | string,
    group_image: '',
    group_name: '' as number | string,
    group_num: '' as number | string,
    virtual_service_count: '' as number | string,
    case_duration: '' as number | string,
    group_consultant: [] as any,
    group_domain: [] as number[],
  });
  const rules = ref<FormProps['rules']>({
    principal_id: [{ required: true, message: '请选择团队负责人', trigger: 'blur' }],
    group_consultant: [
      {
        required: true,
        validator: () => {
          if (!formData.value.group_consultant.length) {
            return Promise.reject('请选择团队咨询师');
          }
          return Promise.resolve();
        },
      },
    ],
    group_domain: [
      {
        required: true,
        validator: () => {
          if (!formData.value.group_domain.length) {
            return Promise.reject('请选择团队招牌领域');
          } else if (formData.value.group_domain.length > 5) {
            return Promise.reject('最多选择5个');
          }
          return Promise.resolve();
        },
      },
    ],
    group_image: [{ required: true, message: '请上传团队照片', trigger: 'blur' }],
    group_num: [{ required: true, message: '请填写团队人数', trigger: 'blur' }],
    virtual_service_count: [{ required: true, message: '请填写服务人数', trigger: 'blur' }],
    case_duration: [{ required: true, message: '请填写成功案例', trigger: 'blur' }],
  });

  onMounted(() => {
    getLawFirmList();
    getConsultantDomain().then((res) => {
      domainOption.value = res;
    });
  });
  watch(
    () => headLayer.value,
    (v) => {
      if (v.length) {
        formData.value.principal_id = v[0].consultant_id;
      } else {
        formData.value.principal_id = '';
      }
    },
    { immediate: true },
  );
  watch(
    () => lawyerList.value,
    (v) => {
      if (v.length) {
        formData.value.group_consultant = v.map((item, index) => {
          return {
            consultant_id: item.consultant_id,
            professional: index === 0 ? positionName.value : '',
            sort: v.length - index,
          };
        });
      } else {
        formData.value.group_consultant = [];
      }
    },
    { immediate: true },
  );
  const domainOption = ref<DomainModel[]>([]);
  const loading = ref(false);
  function openEidtDilog(type) {
    isMultiple.value = type;
    visible.value = true;
  }
  function getLawFirmList() {
    loading.value = true;
    getPracticeUnitNoPageList()
      .then((res) => {
        lawFirmList.value = res;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  function getSelectList(v) {
    console.log(v);
    if (isMultiple.value) {
      lawyerList.value = v;
    } else {
      headLayer.value = v;
      if (!lawyerList.value.length) {
        lawyerList.value = v;
      }
    }
  }
  function submit() {
    console.log('formData.value.group_consultant', formData.value.group_consultant);

    FormRef.value.validate().then(() => {
      loading.value = true;
      formData.value.group_consultant[0].professional = positionName.value;
      let data = {};
      if (route?.params.group_id) {
        data = { ...formData.value, group_id: Number(route?.params.group_id) };
      } else {
        data = { ...formData.value };
      }
      saveGroupInfo(data)
        .then(() => {
          message.success('提交成功');
          router.back();
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
  function deleteLawyer(id) {
    lawyerList.value = lawyerList.value.filter((item) => item.consultant_id !== id);
  }
</script>
<style lang="scss" scoped>
  .input-search {
    ::v-deep(.ant-btn-primary) {
      display: flex;
      align-items: center;
      padding: 0 4px;
      border-color: #d9d9d9;
      background-color: #f5f5f5;
      color: #349dfe;
    }
  }

  ::v-deep(.ant-input-number-group-wrapper) {
    width: 35% !important;
  }

  .number-input {
    ::v-deep(.ant-input-number) {
      width: 50% !important;
    }
  }
</style>
