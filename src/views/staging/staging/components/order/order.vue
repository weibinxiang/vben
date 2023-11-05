<template>
  <div class="max-h-full overflow-y-auto w-71 flex-shrink-0 ml-4 flex flex-col">
    <div class="bg-white rounded flex-1">
      <div class="px-5 text-base font-bold pt-5">订单信息</div>
      <div class="staging-order p-5">
        <div class="staging-order-cell">
          <div class="staging-order-label">客户</div>
          <div class="staging-order-value">{{ consulting?.user_info?.nickname }}</div>
        </div>
        <div class="staging-order-cell">
          <div class="staging-order-label">咨询师</div>
          <div class="staging-order-value">{{ consulting?.consultant_detail?.name }}</div>
        </div>
        <div class="staging-order-cell">
          <div class="staging-order-label">类型</div>
          <div class="staging-order-value"
            ><Tag color="processing"
              >{{ consulting?.type === ConsultingType.phone ? '电话' : '图文' }}咨询</Tag
            ></div
          >
        </div>
        <div class="staging-order-cell">
          <div class="staging-order-label">服务</div>
          <div class="staging-order-value"
            >¥{{ ((consulting?.price || 0) / 100).toFixed(2) }} /
            {{ consulting?.duration }}分钟</div
          >
        </div>
        <div class="staging-order-cell">
          <div class="staging-order-label">下单</div>
          <div class="staging-order-value">{{ consulting?.created_at }}</div>
        </div>
        <div class="staging-order-cell">
          <div class="staging-order-label">问题</div>
          <div class="staging-order-value">
            <div
              class="text-#1890FF cursor-pointer"
              @click="openQuestionDetailsModal(true)"
              v-if="consulting?.consulting_brief?.consulting_brief_id"
            >
              查看详情 <Icon icon="ant-design:right-outlined" :size="14" />
            </div>
            <div v-else class="text-gray-400">客户暂未填写</div>
          </div>
        </div>
        <div
          class="px-4 rounded border border-solid border-#D9D9D9 bg-#F7F8FA py-6px staging-order-question"
          v-if="consulting?.consulting_brief?.consulting_brief_id"
        >
          <div class="staging-order-question-cell">
            <div class="staging-order-question-label">所在地区：</div>
            <div class="staging-order-question-text">{{
              consulting?.consulting_brief?.district
            }}</div>
          </div>
          <div class="staging-order-question-cell">
            <div class="staging-order-question-label">案件类型：</div>
            <div class="staging-order-question-text"
              ><Tag color="processing">{{
                consulting?.consulting_brief?.domain_detail?.domain
              }}</Tag></div
            >
          </div>
          <div class="staging-order-question-cell">
            <div class="staging-order-question-label">涉案金额：</div>
            <div class="staging-order-question-text"
              >{{ consulting?.consulting_brief?.amount }}元</div
            >
          </div>
          <div class="staging-order-question-cell">
            <div class="staging-order-question-label">问题描述：</div>
            <div class="staging-order-question-text">{{
              consulting?.consulting_brief?.brief || '未填写'
            }}</div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-white rounded mt-4 px-5 pb-5 staging-order min-h-63 flex-shrink-0"
      v-if="
        StagingStore.mode === StagingMode.menu || consulting?.consultant_user?.consultant_user_id
      "
    >
      <div class="pt-5 flex justify-between items-center">
        <div class="text-base font-bold">标记客户</div>
        <Popover
          trigger="click"
          overlayClassName="staging-order-mark-popover"
          v-model:visible="visible"
        >
          <template #content>
            <div class="w-30">
              <div
                class="flex items-center justify-center text-black text-opacity-85 h-8 cursor-pointer"
                @click="editMark"
              >
                <Icon icon="ant-design:edit-outlined" class="mr-2" />
                编辑标记
              </div>
              <div
                class="flex items-center justify-center text-#F5222D h-8 cursor-pointer"
                @click="delMark"
              >
                <Icon icon="ant-design:delete-outlined" class="mr-2" />
                删除标记
              </div>
            </div>
          </template>
          <Icon
            icon="ant-design:ellipsis-outlined"
            :size="20"
            class="!text-#4080FF cursor-pointer"
            v-if="
              consulting?.consultant_user?.consultant_user_id &&
              StagingStore.mode === StagingMode.menu
            "
          />
        </Popover>
      </div>
      <div class="py-5" v-if="consulting?.consultant_user?.consultant_user_id && !isEditMark">
        <div class="staging-order-cell">
          <div class="staging-order-label">标签</div>
          <div class="staging-order-value flex flex-wrap">
            <div
              v-for="item in consulting?.consultant_user?.tag_name || []"
              :key="item.consultant_user_tag_id"
              class="bg-#EFEFEF rounded px-3 py-1 mr-3 mb-2 text-xs"
              >{{ item.tag_name }}</div
            >
          </div>
        </div>
        <div class="staging-order-cell">
          <div class="staging-order-label">备注</div>
          <div class="staging-order-value">{{ consulting?.consultant_user?.remark }}</div>
        </div>
      </div>
      <Form :model="formData" class="!py-5" ref="FormRef" v-else>
        <FormItem name="tag" :rules="[{ required: true, message: '请选择客户标签！' }]">
          <Select
            v-model:value="formData.tag"
            mode="multiple"
            style="width: 100%"
            placeholder="请选择客户标签"
            :options="tagList"
            :fieldNames="{
              value: 'consultant_user_tag_id',
              label: 'tag_name',
            }"
          />
        </FormItem>
        <FormItem name="remark" :rules="[{ required: true, message: '请填写标记备注！' }]">
          <InputTextarea
            v-model:value="formData.remark"
            placeholder="请填写标记备注"
            show-count
            :maxlength="200"
            :rows="3"
          />
        </FormItem>
        <a-button class="w-full mt-4" @click="handleSubmitMark" :loading="markLoading"
          >保存</a-button
        >
      </Form>
    </div>
  </div>
  <QuestionDetailsModal @register="registerQuestionDetailsModal" />
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { Tag, Form, FormItem, Input, Select, Popover, message } from 'ant-design-vue';
  import { useStagingStore } from '/@/store/modules/staging';
  import { ConsultingType, StagingMode } from '/@/api/staging/model/enum';
  import { markUser, removeConsultantUser } from '/@/api/staging/staging';
  import QuestionDetailsModal from './src/QuestionDetailsModal.vue';
  import { useModal } from '/@/components/Modal';
  import { Icon } from '/@/components/Icon';
  import { getConsultantTagList } from '/@/api/sys/user';

  const InputTextarea = Input.TextArea;
  const formData = ref({
    tag: [] as string[],
    remark: '',
  });
  const StagingStore = useStagingStore();
  const { serveInfo } = StagingStore;
  const consulting = computed(() => {
    return StagingStore.consulting;
  });
  const markLoading = ref(false);
  const FormRef = ref();
  const isEditMark = ref(false);
  const tagList = ref();
  const visible = ref(false);

  watch(
    () => StagingStore.currentServe,
    (val) => {
      if (val?.consulting_id !== consulting.value?.consultant_id) {
        isEditMark.value = false;
        formData.value = {
          tag: [] as string[],
          remark: '',
        };
      }
    },
  );

  getConsultantTagList().then((res) => {
    tagList.value = res;
  });

  const [registerQuestionDetailsModal, { openModal: openQuestionDetailsModal }] = useModal();

  function editMark() {
    visible.value = false;
    isEditMark.value = true;
    formData.value = {
      tag:
        consulting.value?.consultant_user?.tag_name?.map((item) => item.consultant_user_tag_id) ||
        [],
      remark: consulting.value?.consultant_user?.remark || '',
    };
  }

  function delMark() {
    visible.value = false;

    removeConsultantUser({
      consultant_user_id: consulting.value?.consultant_user?.consultant_user_id || 0,
    }).then(() => {
      message.success('删除标记成功');
      const data = serveInfo[consulting.value!.consulting_id].consulting;
      data!.consultant_user = undefined;
    });
  }

  function handleSubmitMark() {
    FormRef.value.validate().then(() => {
      markLoading.value = true;
      markUser({
        user_id: consulting.value?.user_id || 0,
        remark: formData.value.remark,
        tags: formData.value.tag.toString(),
      })
        .then((res) => {
          message.success('标记成功');
          const data = serveInfo[consulting.value!.consulting_id].consulting;
          data!.consultant_user = {
            consulting_id: data!.consulting_id,
            consultant_user_id: res!.consultant_user_id,
            remark: formData.value.remark,
            tag_name: tagList.value?.filter((item) =>
              formData.value.tag.includes(item.consultant_user_tag_id),
            ),
          };
          isEditMark.value = false;
          formData.value = {
            tag: [] as string[],
            remark: '',
          };
        })
        .finally(() => {
          markLoading.value = false;
        });
    });
  }
</script>

<style lang="less">
  .staging-order {
    .staging-order-cell {
      display: flex;
      margin-bottom: 14px;
    }

    .staging-order-label {
      width: 48px;
      color: rgb(134 144 156 / 90%);
    }

    .staging-order-value {
      @apply truncate;

      flex: 1;
    }

    .staging-order-question {
      &-cell {
        display: flex;
        margin: 6px 0;
      }

      &-label {
        flex-shrink: 0;
        color: rgb(134 144 156 / 90%);
      }

      &-text {
        display: -webkit-box;
        overflow: hidden;
        text-align: justify;
        text-overflow: ellipsis;
        word-break: break-all;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
    }
  }

  .staging-order-mark-popover {
    .ant-popover-inner-content {
      padding: 2px 0 !important;
    }
  }
</style>
