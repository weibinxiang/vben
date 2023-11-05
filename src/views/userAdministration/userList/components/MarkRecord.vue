<template>
  <BasicModal @register="register" v-bind="$attrs" title="标记记录" showFooter>
    <div>
      <div class="flex items-center w-full justify-between">
        <RadioGroup v-model:value="codeType" button-style="outline" class="w-300px">
          <RadioButton :value="0">全部</RadioButton>
          <RadioButton :value="1">咨询师标记</RadioButton>
          <RadioButton :value="2">客服标记</RadioButton>
        </RadioGroup>
        <div>共{{ markList.length }}条</div>
      </div>

      <div class="h-[45vh] overflow-y-auto">
        <template v-if="markList.length">
          <div v-for="item in markList" :key="item.user_id">
            <markItem :option="item" />
          </div>
        </template>
      </div>
    </div>
    <template #footer>
      <div class="text-right">
        <Pagination
          v-model:current="pageParams.page"
          :total="pageParams.total"
          :pageSize="pageParams.page_size"
          @change="onPageChange"
        />
      </div>
    </template>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Radio, Pagination } from 'ant-design-vue';
  import markItem from './markItem.vue';
  import { getUserTagList } from '/@/api/customer/list';

  const codeType = ref(0);
  const RadioGroup = Radio.Group;
  const RadioButton = Radio.Button;
  const user_id = ref();

  const markList = ref<any[]>([]);
  const pageParams = ref({
    page: 1,
    total: 0,
    page_size: 10,
  });

  watch(
    () => codeType.value,
    () => {
      userTagList();
    },
  );

  function onPageChange(e: number) {
    pageParams.value.page = e;
    userTagList();
  }

  function userTagList() {
    getUserTagList({
      type: codeType.value,
      user_id: user_id.value,
      page: pageParams.value.page,
      page_size: pageParams.value.page_size,
    }).then((res) => {
      pageParams.value.total = res.total;
      markList.value = res.data;
    });
  }

  const [register] = useModalInner((task) => {
    user_id.value = task.user_id;
    userTagList();
    // task = [
    //   {
    //     img: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/animeFace/tpmwc3ewsjd.jpg',
    //     name: '王小明（咨询师）',
    //     time: '2023-9-6 17:43',
    //     label: ['仅咨询', '仅咨询'],
    //     notes:
    //       '外商华侨，中国籍，常年定居日本。2011年，福建投资，省政府招商，政府批地24亩，交纳3900万土地出让金，后2014年书记更换，被省政府偷偷告上法庭，恶意诉讼，判罚交纳3.2亿补偿款；2019年年底申请抗诉',
    //   },
    //   {
    //     img: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/animeFace/tpmwc3ewsjd.jpg',
    //     name: '王小明（咨询师）',
    //     time: '2023-9-6 17:43',
    //     label: ['仅咨询', '仅咨询'],
    //     notes:
    //       '外商华侨，中国籍，常年定居日本。2011年，福建投资，省政府招商，政府批地24亩，交纳3900万土地出让金，后2014年书记更换，被省政府偷偷告上法庭，恶意诉讼，判罚交纳3.2亿补偿款；2019年年底申请抗诉',
    //   },
    //   {
    //     img: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/animeFace/tpmwc3ewsjd.jpg',
    //     name: '王小明（咨询师）',
    //     time: '2023-9-6 17:43',
    //     label: ['仅咨询', '仅咨询'],
    //     notes:
    //       '外商华侨，中国籍，常年定居日本。2011年，福建投资，省政府招商，政府批地24亩，交纳3900万土地出让金，后2014年书记更换，被省政府偷偷告上法庭，恶意诉讼，判罚交纳3.2亿补偿款；2019年年底申请抗诉',
    //   },
    //   {
    //     img: 'https://ttmini.oss-cn-shenzhen.aliyuncs.com/animeFace/tpmwc3ewsjd.jpg',
    //     name: '王小明（咨询师）',
    //     time: '2023-9-6 17:43',
    //     label: ['仅咨询', '仅咨询'],
    //     notes:
    //       '外商华侨，中国籍，常年定居日本。2011年，福建投资，省政府招商，政府批地24亩，交纳3900万土地出让金，后2014年书记更换，被省政府偷偷告上法庭，恶意诉讼，判罚交纳3.2亿补偿款；2019年年底申请抗诉',
    //   },
    // ];
    // markList.value = task;
    console.log('task', task);
  });
</script>
