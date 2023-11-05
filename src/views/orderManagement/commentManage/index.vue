<template>
  <PageWrapper content-full-height content-background fixedHeight>
    <template #headerContent>
      <div class="bg-white p-4 pb-2 block md:flex items-center justify-between">
        <BasicForm @register="registerForm" />
      </div>
    </template>
    <div class="bg-light-50 block h-full md:flex">
      <div class="pt-3 h-full flex flex-col overflow-x-auto">
        <div class="flex justify-between p-2">
          <div>评价列表</div>
          <div>
            <a-button @click="openDrawer">评价库批量引用</a-button>
            <a-button
              class="mx-2"
              type="primary"
              preIcon="ant-design:plus-outlined"
              @click="addComment"
            >
              新增评价
            </a-button>
            <a-button type="error" preIcon="ant-design:delete-outlined" @click="delComment">
              删除评价
            </a-button>
          </div>
        </div>
        <div class="flex flex-1">
          <div class="w-60 h-full bg-#fafafa">
            <div class="h-full flex flex-col">
              <div class="p-2 shadow-sm flex-shrink-0 bg-white">
                <InputSearch v-model:value="keyword" />
              </div>

              <div class="flex-1 min-h-0 overscroll-contain overflow-y-auto relative">
                <div
                  v-for="item in searchList"
                  :key="item.consultant_id"
                  class="px-4 py-2 flex items-center cursor-pointer"
                  :class="{ 'bg-#EBF3FF': click_consultant === item.consultant_id }"
                  @click="consultantClick(item.consultant_id)"
                >
                  <img
                    :src="item.consultant_avatar?.image_url || ''"
                    class="w-30px h-30px mr-2 object-cover rounded-full"
                    alt=""
                  />
                  <div class="truncate">{{ item.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-x-auto">
            <BasicTable
              @register="registerTable"
              class="order-table"
              :scroll-x="true"
              :rowSelection="rowSelection"
            >
              <template #headerCell="{ column }">
                <template v-if="column.dataIndex === 'action'">{{ column.customTitle }}</template>
                <template v-else>
                  <div class="flex h-14 items-center">
                    <div
                      v-for="(item, index) in tableColumn"
                      :key="index"
                      :style="item.width ? `width: ${item.width}px` : 'flex: 1'"
                      >{{ item.title }}</div
                    >
                  </div>
                </template>
              </template>
              <template #row="{ record }">
                <TabelColumn>
                  <template #user>
                    <div class="flex flex-col items-center justify-center">
                      <img
                        class="w-[22px] h-[22px] rounded-full"
                        :src="record.user.headimg_url"
                        alt=""
                      />
                      <div class="font-bold text-black text-opacity-85 leading-22px">{{
                        record.user.nickname
                      }}</div>
                    </div>
                  </template>
                  <template #created_at>
                    {{ record.created_at }}
                  </template>
                  <template #content>
                    <div class="text-left whitespace-normal">{{ record.content }}</div>
                    <div class="flex items-center mt-1">
                      <div v-for="i in record.img" :key="i" class="mr-[10px]">
                        <Image :width="104" :height="104" :src="i" alt="" />
                      </div>
                    </div>
                  </template>
                  <template #star_level>
                    <StarOutlined style="color: orange" v-for="i in record.star_level" :key="i" />
                  </template>
                  <template #sku_type>
                    <Tag v-if="record.sku_type === 1" color="orange">电话咨询</Tag>
                    <Tag v-else color="pink">图文咨询</Tag>
                  </template>
                  <template #status>
                    <Tag v-if="record.status === 0" color="green">待审核</Tag>
                    <Tag v-if="record.status === 1" color="green">正常</Tag>
                    <Tag v-if="record.status === 2" color="green">拒绝</Tag>
                  </template>
                  <template #is_show>
                    <Switch
                      v-model:checked="record.is_show"
                      @change="changeIsShow(record)"
                      :checkedValue="1"
                      :unCheckedValue="0"
                    />
                  </template>
                  <template #is_top>
                    <Switch
                      v-model:checked="record.is_top"
                      @change="changeIsTop(record)"
                      :checkedValue="1"
                      :unCheckedValue="0"
                    />
                  </template>
                </TabelColumn>
              </template>
            </BasicTable>
          </div>
        </div>
      </div>
    </div>

    <AddComment
      v-model:visible="addModalVisible"
      title="新增评价"
      centered
      :consultant-id="click_consultant"
      @success="addEvaluateSuccess"
    />
    <importComment
      v-model:visible="importCommentVisible"
      @cancel="importCommentVisible = false"
      @success="success"
      :consultant-id="click_consultant"
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="CommentManage">
  import { ref, onMounted, watch } from 'vue';
  import { Tag, Switch, InputSearch, Image, message } from 'ant-design-vue';
  import { StarOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm, defaultFormProps } from '/@/components/Form';
  import { BasicTable, useTable, defaultTableProps, TableRowSelection } from '/@/components/Table';
  import { useDebounceFn } from '@vueuse/core';
  import { PageWrapper } from '/@/components/Page';
  import { schemas, columns, tableColumn } from './index';
  import AddComment from './components/addComment.vue';
  import { getOrderCommentList, deleteOrderComment, saveOrderComment } from '/@/api/order/list';
  import TabelColumn from './components/TabelColumn.vue';
  import importComment from './components/importComment.vue';
  import { getConsultantList } from '/@/api/serviceStaff/consultant';
  import { ConsultantItemModel } from '/@/api/serviceStaff/model/consultant';

  const click_consultant = ref(0);
  const addModalVisible = ref(false);
  const importCommentVisible = ref(false);
  const keyword = ref('');
  const selectedCommentId = ref<(string | number)[]>([]);
  const formModel = ref();
  const consultantList = ref<ConsultantItemModel[]>([]);
  const rowSelection = ref<Partial<TableRowSelection>>({
    onChange: (selectedRowKeys: (string | number)[]) => {
      selectedCommentId.value = selectedRowKeys;
    },
  });
  const searchList = ref<ConsultantItemModel[]>([]);

  const getSearchList = useDebounceFn(() => {
    if (!keyword.value) {
      searchList.value = consultantList.value;
    }
    searchList.value = consultantList.value.filter((item) => item.name?.includes(keyword.value));
  }, 300);

  watch(
    () => keyword.value,
    () => {
      getSearchList();
    },
    { immediate: true },
  );

  function openDrawer() {
    if (!click_consultant.value) {
      message.info('请点击需要批量添加评价的咨询师');
      return;
    }
    importCommentVisible.value = true;
  }

  function delComment() {
    if (!selectedCommentId.value.length) {
      message.info('请勾选需要删除的评价');
      return;
    }
    deleteOrderComment({ zx_order_comment_id: selectedCommentId.value }).then(() => {
      reload();
    });
  }

  onMounted(() => {
    _getConsultantList();
  });

  const consultantClick = useDebounceFn((e) => {
    click_consultant.value = e;
    if (click_consultant.value) {
      formModel.value = getFieldsValue();
      reload();
    }
  }, 300);

  function _getConsultantList() {
    getConsultantList({
      page: 1,
      page_size: 100,
    }).then((res) => {
      consultantList.value = res.data;
    });
  }

  function changeIsTop(record) {
    saveOrderComment({
      consultant_id: record.consultant_id,
      zx_order_comment_id: record.zx_order_comment_id,
      is_top: record.is_top ? 1 : 0,
    });
  }

  function changeIsShow(record) {
    saveOrderComment({
      consultant_id: record.consultant_id,
      zx_order_comment_id: record.zx_order_comment_id,
      is_show: record.is_show ? 1 : 0,
    });
  }

  function addEvaluateSuccess() {
    addModalVisible.value = false;
    reload({
      page: 1,
    });
  }

  const submitFn = useDebounceFn(() => {
    if (click_consultant.value) {
      formModel.value = getFieldsValue();
      reload();
    } else {
      message.info('请先选中咨询师');
    }
  }, 300);

  function addComment() {
    if (click_consultant.value) {
      addModalVisible.value = true;
    } else {
      message.info('请先选中咨询师');
    }
  }

  const [registerForm, { getFieldsValue }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: submitFn,
    fieldMapToTime: [['time', ['start_time', 'end_time'], 'YYYY-MM-DD HH:mm:ss']],
  });

  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'zx_order_comment_id',
    expandRowByClick: true,
    immediate: false,
    api: (params) => {
      return getOrderCommentList({
        ...params,
        ...formModel.value,
        consultant_id: click_consultant.value,
      });
    },
  });

  function success() {
    importCommentVisible.value = false;
    reload();
  }
</script>

<style lang="less">
  .order-table {
    .ant-table-cell {
      padding: 0 !important;
    }
  }
</style>
