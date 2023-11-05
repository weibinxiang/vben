<template>
  <div
    class="w-76 flex-shrink-0 bg-white flex flex-col border-r-2 border-solid border-#F0F0F0 relative"
    v-loading="loading"
  >
    <!-- 列表类型 -->
    <div class="flex bg-#F8F8F8 cursor-pointer" v-if="StagingStore.mode === StagingMode.menu">
      <div
        class="flex-1 h-12 flex items-center justify-center border-b-1 border-solid border-#F2F3F5 font-bold text-#86909C"
        :class="{ 'bg-white !text-#1890FF': listKey === item.value }"
        v-for="item in listTabs"
        :key="item.value"
        @click="changeList(item.value)"
        >{{ item.label }}</div
      >
    </div>
    <div
      v-else-if="StagingStore.mode === StagingMode.custom"
      class="px-3 h-14 text-#1D2129 text-15px font-bold border-b border-gray-100 leading-14"
      >共{{ serveList[listKey]?.length || 0 }}条记录
    </div>

    <!-- 服务类型 -->
    <div
      class="flex mx-4 my-3 mb-2 items-center"
      v-if="listKey === ServeTypeEnum.ongoing || listKey === ServeTypeEnum.history"
    >
      <Tooltip v-if="listKey === ServeTypeEnum.ongoing">
        <template #title>
          <div v-if="sortKey === OngoingServeSort.time">当前排序：下单时间优先（点击切换）</div>
          <div v-else>当前排序：新消息优先（点击切换）</div>
        </template>
        <div class="flex flex-col mr-2 cursor-pointer" @click="changeSortKey">
          <Icon
            :color="sortKey === OngoingServeSort.last ? '#9F9F9F' : '#CDCDCD'"
            icon="ant-design:caret-up-outlined"
          />
          <Icon
            :color="sortKey === OngoingServeSort.time ? '#9F9F9F' : '#CDCDCD'"
            icon="ant-design:caret-down-outlined"
            class="-mt-6px"
          />
        </div>
      </Tooltip>
      <Popover
        trigger="click"
        v-model:visible="showFilter"
        v-else-if="listKey === ServeTypeEnum.history"
      >
        <template #content>
          <div class="w-76">
            <BasicForm @register="registerForm" @submit="search" />
          </div>
        </template>
        <Icon
          icon="ant-design:menu-unfold-outlined"
          :size="20"
          class="mr-3 cursor-pointer"
          :class="[isEmpty(searchParams) ? '!text-gray-400' : '!text-#1890FF']"
        />
      </Popover>
      <div
        class="flex bg-#F8F8F8 cursor-pointer flex-1"
        :class="{ '!hidden': listKey !== tab.id }"
        v-for="tab in serveTabs"
        :key="tab.id"
      >
        <div
          class="flex-1 h-8 flex items-center justify-center text-#86909C font-medium rounded m-1 text-13px"
          :class="{ 'serve-tab-active': tab.select === item.value }"
          v-for="item in tab.tabs"
          :key="item.value"
          @click="changeServe(tab, item.value)"
          >{{ item.label }}</div
        >
      </div>
    </div>

    <div class="flex-1 overflow-y-auto">
      <ScrollContainer ref="ScrollContainerRef">
        <template v-if="StagingStore.mode === StagingMode.menu">
          <ServeItem
            v-for="(item, index) in serveList[listKey]"
            :key="item.consulting_id"
            :item="item"
            :index="index"
            @push-order="needResetOrder = true"
          />
        </template>
        <template v-else>
          <CustomItem
            v-for="item in serveList[ServeTypeEnum.custom]"
            :key="item.consulting_id"
            :item="item"
          />
        </template>
        <div class="mark-footer" ref="MarkFooterRef"></div>
        <Empty v-if="!serveList[listKey]?.length" description="暂无订单数据" class="!mt-20" />
      </ScrollContainer>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onActivated, onDeactivated, onUnmounted, nextTick } from 'vue';
  import ServeItem from './src/ServeItem.vue';
  import { Icon } from '/@/components/Icon';
  import { ScrollContainer } from '/@/components/Container';
  import { Popover, Empty, Tooltip } from 'ant-design-vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { isEmpty } from '/@/utils/is';
  import {
    ServeTypeEnum,
    OngoingServeSort,
    OngoingType,
    HistoryType,
    StagingMode,
  } from '/@/api/staging/model/enum';
  import { useStagingStore } from '/@/store/modules/staging';
  import CustomItem from './src/CustomItem.vue';
  import dayjs from 'dayjs';

  const StagingStore = useStagingStore();
  const listKey = ref<ServeTypeEnum>(
    StagingStore.mode === StagingMode.menu ? ServeTypeEnum.ongoing : ServeTypeEnum.custom,
  );
  const listTabs = ref([
    { label: '跟进中', value: ServeTypeEnum.ongoing },
    { label: '历史订单', value: ServeTypeEnum.history },
  ]);
  const serveTabs = [
    {
      id: ServeTypeEnum.ongoing,
      select: OngoingType.all,
      tabs: [
        { label: '全部', value: OngoingType.all },
        { label: '待接单', value: OngoingType.wait },
        { label: '咨询中', value: OngoingType.serveing },
      ],
    },
    {
      id: ServeTypeEnum.history,
      select: HistoryType.all,
      page: 1,
      loading: false,
      finish: false,
      tabs: [
        { label: '全部', value: HistoryType.all },
        { label: '已完成', value: HistoryType.success },
        { label: '已取消', value: HistoryType.cancel },
      ],
    },
  ];
  const showFilter = ref(false);
  const loading = ref(false);
  const { getServeList, serveList, updateServeTime, listenInServeTime } = StagingStore;
  const sortKey = ref<OngoingServeSort>(OngoingServeSort.last);
  const MarkFooterRef = ref();
  const ScrollContainerRef = ref();
  const needResetOrder = ref(true);

  const schemas: FormSchema[] = [
    {
      field: 'keyword',
      label: '关键词',
      component: 'Input',
      componentProps: {
        placeholder: '请输入关键词',
        style: { width: '100%' },
      },
    },
    {
      field: 'datetime',
      label: '下单时间',
      component: 'RangePicker',
      componentProps: {
        style: { width: '100%' },
        disabledDate: (current) => {
          return current && current > dayjs().endOf('day');
        },
      },
    },
    {
      field: 'only_mark_user',
      label: '客户类型',
      component: 'RadioGroup',
      defaultValue: 0,
      componentProps: {
        optionType: 'button',
        buttonStyle: 'solid',
        options: [
          { label: '全部', value: 0 },
          { label: '仅标记用户', value: 1 },
        ],
      },
    },
  ];

  const [registerForm, { getFieldsValue }] = useForm({
    layout: 'vertical',
    schemas,
    colon: true,
    baseColProps: { span: 24 },
    actionColOptions: { span: 24 },
  });
  const searchParams = ref({});

  onActivated(() => {
    // 开始更新服务时间定时器
    updateServeTime();
    listenInServeTime();
  });
  onDeactivated(() => {
    // 清除更新服务时间定时器
    if (StagingStore.timer) clearInterval(StagingStore.timer);
  });
  onUnmounted(() => {
    console.log('---------onUnmounted---------');
  });

  function search() {
    const { only_mark_user, keyword, datetime } = getFieldsValue();
    searchParams.value = {
      keyword: keyword || '',
      begin_date: datetime ? datetime[0] : '',
      end_date: datetime ? datetime[1] : '',
      only_mark_user,
    };
    if (!only_mark_user && !keyword && !datetime) {
      searchParams.value = {};
    }
    showFilter.value = false;
    const data = serveTabs[1];
    data.page = 1;
    data.finish = false;
    queryServeList();
  }

  function queryServeList() {
    loading.value = true;
    getServeList({
      type: listKey.value,
      recordsParams: {
        status: serveTabs[0].select as OngoingType,
        order_by: sortKey.value,
        sort_direction: sortKey.value === OngoingServeSort.time ? 4 : 3,
      },
      consultingsParams: {
        status: serveTabs[1].select as HistoryType,
        page: serveTabs[1].page!,
        page_size: 20,
        ...searchParams.value,
      },
    })
      .then((res) => {
        if (listKey.value === ServeTypeEnum.history) {
          const data = serveTabs[1];
          ++data.page!;
          if (!res.data?.length) data.finish = true;
        }
      })
      .finally(() => {
        loading.value = false;
        listenInServeTime();
      });
  }
  if (StagingStore.mode === StagingMode.menu) {
    queryServeList();
  }

  function changeSortKey() {
    sortKey.value =
      sortKey.value === OngoingServeSort.last ? OngoingServeSort.time : OngoingServeSort.last;
    queryServeList();
  }

  function changeServe(tab, key) {
    tab.select = key;
    queryServeList();
  }

  function changeList(key) {
    listKey.value = key;
    if (
      !serveList[key].length ||
      (listKey.value === ServeTypeEnum.history && needResetOrder.value)
    ) {
      const data = serveTabs[1];
      data.page = 1;
      data.finish = false;
      queryServeList();
      needResetOrder.value = false;
    }
  }

  function getOrderList() {
    if (!serveTabs[1].finish) {
      queryServeList();
    }
  }

  nextTick(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0] || {};
        if (entry.isIntersecting && listKey.value === ServeTypeEnum.history) {
          getOrderList();
        }
      },
      {
        root: ScrollContainerRef.value?.$el,
      },
    );
    // 监听目标元素
    observer.observe(MarkFooterRef.value);
  });
</script>

<style lang="less">
  .serve-tab-active {
    background: white;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 16%);
    color: #1d2129;
  }

  // .ant-form-item-control-input {
  //   margin-t: 0;
  // }
</style>
