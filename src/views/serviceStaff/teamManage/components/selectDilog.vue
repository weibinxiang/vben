<template>
  <Modal
    :visible="visible"
    :title="isMultiple ? '选择团队成员（多选，最多20人）' : '选择团队负责人（单选）'"
    :footer="null"
    :width="1136"
    @ok="handleOk"
    @cancel="emits('update:visible', false)"
    :after-close="afterClose"
  >
    <div class="px-6 py-6 bg-#f2f3f5 flex">
      <div class="bg-white w-306px mr-2px">
        <div
          class="text-#1D2129 text-base font-semibold px-3 py-4 border-#F2F3F5 border-b-1px cursor-pointer"
          @click="lawFirmId = 0"
          :class="{ 'bg-#ebf3ff': !lawFirmId }"
          >不限单位</div
        >
        <div class="h-516px overflow-auto">
          <div
            v-for="item in lawFirmList"
            :key="item.law_firm_id"
            class="px-4 pt-4 cursor-pointer"
            :class="lawFirmId === item.law_firm_id ? 'bg-#ebf3ff' : ''"
            @click="lawFirmId = item.law_firm_id"
          >
            <div class="flex items-center">
              <img :src="item.logo" class="w-10 h-10 rounded-full mr-3" />
              <div>{{ item.name }}</div>
            </div>
            <div class="mt-4 w-full h-1px bg-#F2F3F5"></div>
          </div>
        </div>
      </div>
      <div class="bg-white w-390px mr-2px">
        <div class="text-#1D2129 text-base font-semibold px-3 py-3 border-#F2F3F5 border-b-1px"
          ><InputSearch @search="getList" v-model:value="keyword" />
        </div>
        <div class="px-4 py-4 overflow-auto h-516px">
          <div
            class="border-#F2F3F5 border-1px px-4 py-4 w-full mb-3 flex justify-between items-center cursor-pointer"
            v-for="item in list"
            :key="item.consultant_id"
            @click="select(item)"
          >
            <div class="flex items-center">
              <img :src="item?.consultant_avatar?.image_url" class="w-10 h-10 rounded-full mr-3" />
              <div>{{ item.name }}</div>
            </div>
            <Checkbox :checked="isChecked(item.consultant_id)" />
          </div>
        </div>
      </div>
      <div class="bg-white w-390px">
        <div class="text-#1D2129 text-base font-semibold px-3 py-4 border-#F2F3F5 border-b-1px">{{
          `已选（${selectList.length}）`
        }}</div>
        <div class="px-4 py-4 overflow-auto h-460px border-#F2F3F5 border-b-1px">
          <div ref="dragList" id="dragList">
            <div
              class="border-#F2F3F5 border-1px px-4 py-4 w-full mb-3 flex justify-between items-center"
              v-for="item in selectList"
              :key="item.consultant_id"
            >
              <div class="flex items-center">
                <img
                  :src="item?.consultant_avatar?.image_url"
                  class="w-10 h-10 rounded-full mr-3"
                />
                <div>{{ item.name }}</div>
              </div>
              <div>
                <Icon icon="ant-design:drag-outlined" :size="18" class="mr-2 cursor-pointer" />
                <Icon
                  icon="ant-design:delete-outlined"
                  :size="18"
                  class="cursor-pointer"
                  @click="deleteLawyer(item.consultant_id)"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="h-56px w-full border-#F2F3F5 border-b-1px py-3 px-4 flex justify-end items-center"
        >
          <a-button class="mr-3" @click="emits('update:visible', false)">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </div>
      </div>
    </div>
  </Modal>
</template>
<script lang="ts" setup>
  import { Modal, InputSearch, Checkbox, message } from 'ant-design-vue';
  import { ref, watch } from 'vue';
  import { getConsultantList } from '/@/api/serviceStaff/consultant';
  import { ConsultantItemModel } from '/@/api/serviceStaff/model/consultant';
  import { Icon } from '/@/components/Icon';
  import { cloneDeep } from 'lodash-es';
  import type { PropType } from 'vue';
  import { useSortable } from '@/hooks/core/useSortable';

  const keyword = ref();
  const list = ref<ConsultantItemModel[]>([]);
  const selectList = ref<ConsultantItemModel[]>([]);
  const emits = defineEmits(['update:visible', 'getSelectList']);
  const props = defineProps({
    lawFirmList: {
      type: [] as any,
      default: () => [],
    },
    isMultiple: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    lawyerList: {
      type: Array as PropType<ConsultantItemModel[]>,
      default: () => [],
    },
  });
  const lawFirmId = ref();
  const dragList = ref();

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        initDragList();
      }
      if (visible && props.lawyerList.length && props.isMultiple) {
        selectList.value = cloneDeep(props.lawyerList);
      }
    },
    { immediate: true },
  );

  watch(
    () => lawFirmId.value,
    () => {
      getList();
    },
  );

  function afterClose() {
    lawFirmId.value = props.lawFirmList[0].law_firm_id;
    selectList.value = [];
  }
  function initDragList() {
    const { initSortable } = useSortable(dragList, {
      group: { name: 'dragList', pull: true, put: true },
      animation: 150,
      sort: true,
      forceFallback: true,
      onEnd({ newIndex, oldIndex }) {
        selectList.value.splice(newIndex!, 0, ...selectList.value.splice(oldIndex!, 1));
        console.log('  selectList.value', selectList.value);
      },
    });
    initSortable();
  }
  function handleOk() {}
  function getList() {
    getConsultantList({
      law_firm_id: lawFirmId.value,
      page: 1,
      page_size: 100,
      search_key: keyword.value,
    }).then((res) => {
      list.value = res.data;
    });
  }
  getList();

  function isChecked(id) {
    return selectList.value.some((item) => item.consultant_id === id);
  }
  function select(item) {
    if (props.isMultiple) {
      if (isChecked(item.consultant_id)) {
        deleteLawyer(item.consultant_id);
      } else {
        selectList.value.push(item);
      }
    } else {
      selectList.value = [];
      selectList.value.push(item);
    }
  }
  function deleteLawyer(id) {
    selectList.value = selectList.value.filter((item) => item.consultant_id !== id);
  }
  function submit() {
    if (props.isMultiple && selectList.value.length > 20) {
      message.warn('团队成员最多20人!');
      return;
    }
    emits('getSelectList', selectList.value);
    emits('update:visible', false);
  }
</script>
<style lang="scss" scoped>
  ::-webkit-scrollbar {
    display: none;
  }
</style>
