<template>
  <PageWrapper content-full-height content-background fixedHeight>
    <div class="bg-light-50 block h-full md:flex">
      <div class="pt-3 h-full overflow-y-auto">
        <div class="flex justify-end p-2">
          <a-button
            class="mx-2"
            type="primary"
            preIcon="ant-design:plus-outlined"
            @click="
              () => {
                openSettingModal(true, {});
              }
            "
          >
            新增评论
          </a-button>
        </div>
        <BasicTable @register="registerTable">
          <template #headerCell="{ column }">
            <template v-if="column.dataIndex === 'action'">{{ column.customTitle }}</template>
            <template v-else>
              <div class="flex h-14 items-center">
                <div v-for="(item, index) in tableColumn" :key="index" style="flex: 1">{{
                  item.title
                }}</div>
              </div>
            </template>
          </template>
          <template #row="{ record }">
            <TabelColumn>
              <template #comment_date>
                {{ record.comment_date }}
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
              <template #action>
                <a-button type="link" @click="openSettingModal(true, { record })">编辑</a-button>
                <Popconfirm
                  @confirm="delComment(record.zx_order_comment_model_id)"
                  title="确认要删除此条评论吗？"
                  ok-text="确认"
                  cancel-text="取消"
                >
                  <a href="#">删除</a>
                </Popconfirm>
              </template>
            </TabelColumn>
          </template>
        </BasicTable>
      </div>
    </div>
    <AddCommentModal
      v-model:visible="addModalVisible"
      centered
      @success="addEvaluateSuccess"
      @register="registerDetalis"
    />
  </PageWrapper>
</template>

<script lang="ts" setup name="CommentManage">
  import { ref } from 'vue';
  import { Image, Popconfirm } from 'ant-design-vue';
  import { StarOutlined } from '@ant-design/icons-vue';
  import { useModal } from '/@/components/Modal';
  import { BasicTable, useTable, defaultTableProps } from '/@/components/Table';
  import { PageWrapper } from '/@/components/Page';
  import { columns, tableColumn } from './index';
  import AddCommentModal from './components/addCommentModal.vue';
  import { getOrderCommentModelList, deleteOrderCommentModel } from '/@/api/order/list';
  import TabelColumn from './components/TabelColumn.vue';

  const [registerDetalis, { openModal: openSettingModal }] = useModal();

  const addModalVisible = ref(false);
  function delComment(id) {
    deleteOrderCommentModel({ zx_order_comment_model_id: [id] }).then(() => {
      reload();
    });
  }
  function addEvaluateSuccess() {
    addModalVisible.value = false;
    reload({
      page: 1,
    });
  }
  const [registerTable, { reload }] = useTable({
    ...defaultTableProps,
    columns,
    rowKey: 'zx_order_comment_id',
    expandRowByClick: true,
    immediate: true,
    api: (params) => {
      return getOrderCommentModelList({
        ...params,
      });
    },
  });
</script>

<style lang="less">
  .order-table {
    .ant-table-cell {
      padding: 0 !important;
    }
  }
</style>
