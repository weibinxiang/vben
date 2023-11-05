<template>
  <div class="consultant-details bg-white h-full relative overflow-hidden">
    <div class="h-full overflow-y-auto p-6 pr-90 pb-20">
      <Form
        :model="formData"
        :rules="rules"
        :labelCol="{ style: { width: '110px' } }"
        :wrapperCol="{ style: { 'max-width': '600px' } }"
        ref="FormRef"
      >
        <div class="font-bold text-base flex items-center mb-6"
          ><div class="w-1 h-4 bg-#1890FF mr-1"></div> 个人资料
        </div>
        <FormItem label="头像" name="consultant_avatar">
          <div class="overflow-hidden w-26 h-26 bg-gray-100 rounded-full">
            <Upload
              clearStyle
              v-model:value="formData.consultant_avatar"
              :need-cropper="true"
              :cropper="{ showRect: false, showCircle: true, options: { aspectRatio: 1 } }"
              :width="104"
              :height="104"
            />
          </div>
        </FormItem>
        <FormItem label="名称" name="consultant_name">
          <Input
            placeholder="请输入名称"
            v-model:value="formData.consultant_name"
            show-count
            :maxlength="12"
          />
        </FormItem>
        <FormItem label="手机号" name="phone" required>
          <Input placeholder="请输入手机号" v-model:value="formData.phone" />
        </FormItem>
        <FormItem label="从业年限" name="term" required>
          <InputNumber
            placeholder="请输入从业年限"
            v-model:value="formData.term"
            :min="0"
            :max="50"
            :precision="0"
            :controls="false"
          />
        </FormItem>
        <FormItem label="教育/专业背景" name="educational_background">
          <Input
            placeholder="请输入教育/专业背景"
            v-model:value="formData.educational_background"
            show-count
            :maxlength="30"
          />
        </FormItem>
        <FormItem label="勋章" name="tags">
          <Select
            v-model:value="formData.tags"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择勋章"
            :options="tagOption"
          />
        </FormItem>
        <FormItem label="荣誉奖项" name="honor">
          <Textarea
            placeholder="请输入荣誉奖项"
            v-model:value="formData.honor"
            show-count
            :maxlength="30"
          />
        </FormItem>
        <FormItem label="个人介绍" name="introduction" required>
          <Textarea
            placeholder="个人介绍"
            v-model:value="formData.introduction"
            show-count
            :maxlength="100"
          />
        </FormItem>

        <div class="font-bold text-base flex items-center mb-6"
          ><div class="w-1 h-4 bg-#1890FF mr-1"></div> 资历展示
        </div>
        <FormItem label="服务次数" name="virtual_service_count" required>
          <div>
            <div class="flex items-center">
              <div class="w-40">
                <InputNumber
                  placeholder="服务次数"
                  v-model:value="formData.virtual_service_count"
                  :controls="false"
                  :min="0"
                  :max="99999"
                  addon-after="次"
                  :precision="0"
                />
              </div>
              <span class="ml-2"> + 真实订单数</span>
            </div>
            <div class="text-gray-300 mt-1">提示：服务次数=虚拟初始值+真实订单数</div>
          </div>
        </FormItem>
        <FormItem label="服务时长" name="case_duration" required>
          <div>
            <div class="flex items-center">
              <div class="w-43">
                <InputNumber
                  placeholder="服务时长"
                  v-model:value="formData.case_duration"
                  :controls="false"
                  :min="0"
                  :max="99999"
                  addon-after="小时"
                  :precision="0"
                />
              </div>
              <span class="ml-2"> + 真实订单数</span>
            </div>
            <div class="text-gray-300 mt-1">提示：服务时长=虚拟初始值+真实订单数</div>
          </div>
        </FormItem>
        <FormItem
          label="擅长问题"
          name="good_problems"
          required
          v-if="consultant.consultant_type === ConsultantType.ordinary"
        >
          <Input placeholder="请输入擅长问题" v-model:value="formData.good_problems" />
        </FormItem>
        <FormItem
          label="擅长案件"
          name="domain_arr"
          v-if="consultant.consultant_type === ConsultantType.lawyer"
        >
          <Select
            v-model:value="formData.domain_arr"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择擅长案件"
            :options="domainOption"
            :fieldNames="{
              value: 'domain_id',
              label: 'domain',
            }"
          />
        </FormItem>
        <FormItem
          label="办案经历"
          name="case_info"
          :wrapperCol="{ style: { 'max-width': '1200px' } }"
          v-show="consultant.consultant_type === ConsultantType.lawyer"
        >
          <FormItemRest>
            <div class="mt-1.2 mb-1"
              >请登陆
              <span class="text-#1890FF cursor-pointer">《中国法律文书网》</span
              >获取该咨询师真实的办案经历资料填</div
            >
            <BasicTable @register="registerTable">
              <template #action="{ record }">
                <TableAction
                  :actions="[
                    {
                      label: '删除',
                      color: 'error',
                      onClick: () => delCaseInfo(record),
                    },
                  ]"
                />
              </template>
            </BasicTable>
            <a-button
              pre-icon="ant-design:plus-outlined"
              class="w-full mt-1"
              @click="addCaseInfo"
              :loading="loading"
              >添加</a-button
            >
          </FormItemRest>
        </FormItem>
      </Form>
    </div>
    <div class="h-full pb-20 overflow-y-auto absolute right-6 top-6">
      <div class="h-605px w-300px overflow-hidden">
        <PhonePreview :consultant="previewData" :width="300" />
      </div>
    </div>
  </div>
  <div class="absolute bottom-0 left-0 w-full px-4 z-101">
    <div class="bg-white pt-4 pb-3 rounded-t-4" style="box-shadow: 0 0 20px 0 rgb(0 0 0 / 12%)">
      <a-button type="primary" class="ml-4" @click="submit">保存修改</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, PropType, nextTick, computed } from 'vue';
  import {
    Form,
    FormItem,
    FormItemRest,
    FormProps,
    Input,
    InputNumber,
    Textarea,
    Select,
    message,
  } from 'ant-design-vue';
  import { getConsultantDomain, saveConsultantDetail } from '/@/api/serviceStaff/consultant';
  import Upload from '/@/components/yzkt/Upload.vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { tagList, useFormData, caseInfo } from './hooks/useFormData';
  import {
    DomainModel,
    ConsultantCaseInfo,
    ConsultantDetailModel,
    ConsultantType,
  } from '/@/api/serviceStaff/model/consultant';
  import { cloneDeep } from 'lodash-es';
  import { buildUUID } from '/@/utils/uuid';
  import { useRoute } from 'vue-router';
  import PhonePreview from '../phonePreview/PhonePreview.vue';

  const props = defineProps({
    consultant: {
      type: Object as PropType<ConsultantDetailModel>,
      default: () => ({}),
    },
  });
  const emits = defineEmits({
    submit: () => true,
  });

  const FormRef = ref();
  const formData = ref({
    consultant_avatar: '',
    consultant_name: '',
    phone: '',
    educational_background: '',
    term: 800,
    tags: [] as string[],
    honor: '',
    introduction: '',
    virtual_service_count: 800,
    case_duration: '' as number | string,
    domain_arr: [] as number[],
    case_info: [] as ConsultantCaseInfo[],
    good_problems: '',
  });
  const tagOption = ref(tagList);
  const domainOption = ref<DomainModel[]>([]);
  const { columns } = useFormData({ domainOption });
  const route = useRoute();
  const loading = ref(false);

  watch(
    () => props.consultant.consultant_id,
    (val) => {
      if (val) {
        const data = props.consultant;
        formData.value = {
          consultant_avatar: data.consultant_avatar?.image_url,
          phone: data.phone,
          consultant_name: data.name,
          educational_background: data.consultant_info.educational_background,
          term: data.consultant_info.term,
          tags: data.consultant_info.tags,
          honor: data.consultant_info.honor,
          introduction: data.consultant_info.introduction,
          virtual_service_count: data.consultant_info.virtual_service_count,
          case_duration: data.consultant_info.case_duration,
          good_problems: data.consultant_info.good_problems,
          domain_arr: data.domain_arr?.map((v) => v.domain_id),
          case_info: data.consultant_case?.map((item) => ({
            case_date: item.case_date,
            consultant_case_id: item.consultant_case_id,
            domain_id: item.domain_id,
            serial: item.serial,
            title: item.title,
          })),
        };
        nextTick(() => {
          setTableData(formData.value.case_info);
        });
      }
    },
    { immediate: true },
  );

  const previewData = computed(() => {
    const data = {
      ...props.consultant,
      name: formData.value.consultant_name,
      consultant_avatar: {
        ...props.consultant.consultant_avatar,
        image_url: formData.value.consultant_avatar,
      },
      consultant_info: {
        ...props.consultant.consultant_info,
        ...formData.value,
      },
      // domain_arr: formData.value.domain_arr,
    };
    return data;
  });

  const [
    registerTable,
    { getDataSource, setTableData, insertTableDataRecord, deleteTableDataRecord },
  ] = useTable({
    rowKey: 'consultant_case_id',
    dataSource: formData.value.case_info,
    columns,
    showIndexColumn: false,
    pagination: false,
    canResize: false,
    actionColumn: {
      width: 80,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  });

  const rules = ref<FormProps['rules']>({
    consultant_avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
    tags: [
      {
        required: true,
        validator: () => {
          if (!formData.value.tags.length) {
            return Promise.reject('请选择勋章');
          }
          return Promise.resolve();
        },
      },
    ],
    domain_arr: [
      {
        required: true,
        validator: () => {
          if (!formData.value.domain_arr.length) {
            return Promise.reject('请选择擅长案件');
          }
          return Promise.resolve();
        },
      },
    ],
    case_info: [
      {
        trigger: 'blur',
        validator: () => {
          const data = getDataSource();
          if (data.length) {
            const isEveryObjectValid = data.every((item) => {
              return Object.values(item).every((value) => value);
            });
            if (!isEveryObjectValid) {
              return Promise.reject('请完整填写办案经历');
            }
          }
          return Promise.resolve();
        },
      },
    ],
  });

  getConsultantDomain().then((res) => {
    domainOption.value = res;
  });

  function addCaseInfo() {
    const uuid = buildUUID();
    const val = cloneDeep({ ...caseInfo, uuid, consultant_case_id: uuid });
    insertTableDataRecord(val);
    console.log(formData.value.case_info);
  }

  function delCaseInfo(record) {
    deleteTableDataRecord(record.consultant_case_id);
  }

  function submit() {
    FormRef.value.validate().then(() => {
      loading.value = true;
      formData.value.case_info = getDataSource()?.map((item) => {
        const caseInfo = {
          case_date: item.case_date,
          domain_id: item.domain_id,
          serial: item.serial,
          title: item.title,
          consultant_case_id: 0,
        };
        if (!item.uuid) caseInfo.consultant_case_id = item.consultant_case_id;
        return caseInfo;
      });
      saveConsultantDetail({ ...formData.value, consultant_id: +route.params.id })
        .then(() => {
          message.success('保存成功');
          emits('submit');
        })
        .finally(() => {
          loading.value = false;
        });
    });
  }
</script>

<style lang="less">
  .consultant-details {
    .vben-editable-cell__action {
      display: none;
    }

    .vben-editable-cell {
      .ant-input,
      .ant-picker,
      .ant-select {
        width: 100% !important;
      }
    }
  }
</style>
