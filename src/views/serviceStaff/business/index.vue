<template>
  <PageWrapper content-full-height content-background>
    <template #headerContent>
      <div class="bg-white p-4 pb-2 block md:flex items-center justify-between">
        <BasicForm @register="registerForm" />
      </div>
    </template>
    <div class="px-4">
      <div class="flex justify-between items-center py-4">
        <div class="text-base font-bold">执业单位列表（共{{ count }}人）</div>
        <a-button
          pre-icon="ant-design:plus-circle-outlined"
          type="primary"
          @click="router.push({ name: 'BusinessSetting' })"
          >添加单位</a-button
        >
      </div>

      <div class="flex flex-wrap">
        <CardItem v-for="item in list" :key="item.law_firm_id" :item="item" />
      </div>
      <Loading :loading="loading" :empty="!list.length" />
    </div>
  </PageWrapper>
</template>

<script setup lang="ts" name="Business">
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { BusinessItem } from '/@/api/serviceStaff/model/business';
  import { getPracticeUnitList } from '/@/api/serviceStaff/business';
  import { BasicForm, useForm, defaultFormProps, FormSchema } from '/@/components/Form';
  import { useRouter } from 'vue-router';
  import { onMountedOrActivated } from '/@/hooks/core/onMountedOrActivated';
  import Loading from '/@/components/yzkt/Loading.vue';
  import CardItem from './components/CardItem.vue';

  const list = ref<BusinessItem[]>([]);
  const router = useRouter();
  const loading = ref(false);
  const count = ref(0);

  const schemas: FormSchema[] = [
    {
      field: 'search_key',
      label: '关键字',
      component: 'Input',
      componentProps: {
        placeholder: '输入关键字',
      },
    },
    {
      field: 'status',
      label: '状态',
      component: 'Select',
      defaultValue: 1,
      componentProps: {
        style: { width: '208px' },
        options: [
          { label: '全部', value: 0 },
          { label: '已标记', value: 1 },
          { label: '未标记', value: 2 },
        ],
        onChange(target) {
          console.log('value', target);
        },
      },
    },
  ];

  const [registerForm, { getFieldsValue, submit }] = useForm({
    ...defaultFormProps,
    schemas,
    showActionButtonGroup: true,
    submitFunc: async () => {
      getList();
    },
    fieldMapToTime: [['time', ['begin_time', 'end_time'], 'YYYY-MM-DD HH:mm:ss']],
  });

  function getList() {
    loading.value = true;
    const value = getFieldsValue();
    getPracticeUnitList({ ...value, page: 1, page_size: 100 })
      .then((res) => {
        list.value = res.data;
        count.value = res.law_firm_count;
      })
      .finally(() => {
        loading.value = false;
      });
  }

  onMountedOrActivated(() => {
    submit();
  });
</script>
