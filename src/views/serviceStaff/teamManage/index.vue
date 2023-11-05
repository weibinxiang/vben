<template>
  <PageWrapper content-full-height content-background>
    <div class="px-6 py-4 bg-[#fff]">
      <BasicForm @register="registerForm" />
    </div>
    <div class="h-4 bg-#f0f2f5"></div>
    <div class="px-4 bg-[#fff] h-full">
      <div class="flex justify-between items-center py-4">
        <div class="text-base font-bold">咨询师团队列表</div>
        <a-button
          pre-icon="ant-design:plus-circle-outlined"
          @click="router.push({ name: 'TeamEdit' })"
          type="primary"
          >添加团队</a-button
        >
      </div>

      <div class="flex flex-wrap">
        <div
          class="w-272px h-304px flex flex-col border-#F0F0F0 border-1px flex-shrink-0 mr-4 mb-4"
          v-for="item in list"
          :key="item.group_id"
        >
          <img :src="item.group_image?.image_url" class="w-full h-170px flex-shrink-0" />
          <div class="flex-1 px-4 py-4 relative">
            <div>{{ item.name }}</div>
            <div class="mt-2 flex items-center justify-between">
              <div>{{ `团队人数：${item.group_info?.group_num || 0}人` }}</div>
              <div>{{ `负责人：${item.principal?.name}` }}</div>
            </div>
            <a-button
              type="primary"
              class="absolute -bottom-16px left-175px"
              @click="router.push({ name: 'TeamEdit', params: { group_id: item.group_id } })"
            >
              管理
            </a-button>
          </div>
        </div>
      </div>
      <Loading :loading="loading" :empty="!list.length" />
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup name="TeamManage">
  import { PageWrapper } from '/@/components/Page';
  import { BasicForm, useForm, FormSchema, defaultFormProps } from '/@/components/Form';
  import { getGroupList } from '/@/api/serviceStaff/team';
  import { GroupList } from '/@/api/serviceStaff/model/team';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import Loading from '/@/components/yzkt/Loading.vue';

  const router = useRouter();
  const list = ref<GroupList[]>([]);
  const loading = ref(true);
  const schemas: FormSchema[] = [
    {
      field: 'search_key',
      component: 'Input',
      label: '团队名称：',
      componentProps: {
        placeholder: '请输入团队名称',
        style: { width: '100%' },
        onChange: (e: any) => {
          console.log(e);
        },
      },
    },
    {
      field: 'status',
      component: 'Select',
      label: '筛选：',
      componentProps: {
        defaultValue: 0,
        options: [
          { label: '全部', value: 0 },
          { label: '正常', value: 1 },
          { label: '关闭', value: 2 },
        ],
        style: { minWidth: '200px' },
      },
    },
  ];
  const [registerForm, { getFieldsValue, submit }] = useForm({
    ...defaultFormProps,
    submitFunc: async () => {
      getList();
    },
    schemas,
  });
  function getList() {
    const value = getFieldsValue() as any;
    getGroupList({ ...value, page: 1, page_size: 100 })
      .then((res) => {
        list.value = res.data;
      })
      .finally(() => {
        loading.value = false;
      });
  }
  onMountedOrActivated(() => {
    submit();
  });
</script>
