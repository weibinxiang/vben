<template>
  <div class="border border-#F0F0F0 mr-4 mb-4 rounded consultant-item w-100 flex flex-col relative">
    <div
      class="absolute -top-6px left-0 bg-#E6F7FF text-#1890FF font-bold h-26px px-2"
      style="border-radius: 12px 2px"
      >{{ consultant.consultant_type === ConsultantType.lawyer ? '法律咨询师' : '普通咨询师' }}</div
    >
    <div class="flex items-center border-b border-#F5F5F5 pt-6 pb-3 pl-4 pr-1">
      <img
        :src="consultant.consultant_avatar?.image_url"
        class="w-13.5 h-13.5 object-cover rounded-full"
      />
      <div class="pl-3 flex items-center flex-1 overflow-hidden">
        <div class="flex-1 overflow-hidden">
          <div class="flex">
            <span class="text-base font-bold truncate mr-2">{{ consultant.name }}</span>
            <Tag v-if="consultant?.status === 1" color="success">正常</Tag>
            <Tag v-else color="error">禁用</Tag>
            <Tag v-if="consultant.is_recommend === 0">首页隐藏</Tag>
          </div>
          <!-- <div
            class="flex items-center flex-wrap mt-1 border border-#D9D9D9 py-2px px-2 bg-#FAFAFA w-max"
          >
            <SvgIcon name="tag" :size="11" class="flex-shrink-0 mr-2" />
            <div
              class="text-black text-opacity-80 text-xs group"
              v-for="(item, index) in consultant.domain_arr"
              :key="index"
              ><span>{{ item }}</span
              ><span class="mx-1 text-10px group-last:hidden">|</span></div
            >
          </div> -->
          <div class="text-gray-400 text-xs truncate mt-1">{{
            consultant.consultant_info?.introduction
          }}</div>
        </div>
        <div class="pb-8">
          <Dropdown placement="bottomRight" v-model:visible="visible" :trigger="['click']">
            <div class="pr-3">
              <Icon icon="ant-design:menu-outlined" />
            </div>
            <template #overlay>
              <div class="pr-3">
                <Popconfirm
                  :title="
                    consultant.status
                      ? '禁用后该咨询师无法正常售卖服务，以及无法正常登陆服务端工作台?'
                      : '是否启用该咨询师？'
                  "
                  placement="left"
                  :okButtonProps="{ loading: loading }"
                  overlayClassName="del-consultant w-90"
                  @confirm="changeStatus"
                >
                  <div
                    class="flex items-center text-#9CA3AF shadow-md bg-white w-30 h-10 px-3 cursor-pointer"
                    :class="{ '!text-#55D187': !consultant.status }"
                  >
                    <template v-if="consultant.status === 1">
                      <Icon icon="ant-design:stop-outlined" />
                      <span class="ml-2">禁用咨询师</span>
                    </template>
                    <template v-else>
                      <Icon icon="ant-design:check-circle-outlined" />
                      <span class="ml-2">启用咨询师</span>
                    </template>
                  </div>
                </Popconfirm>
                <div
                  class="flex items-center text-#9CA3AF shadow-md bg-white w-30 h-10 px-3 cursor-pointer"
                  :class="{ '!text-#55D187': !consultant.is_recommend }"
                  @click="changeShowStatus"
                >
                  <template v-if="consultant.is_recommend === 1">
                    <Icon icon="ant-design:eye-invisible-outlined" />
                    <span class="ml-2">首页隐藏</span>
                  </template>
                  <template v-else>
                    <Icon icon="ant-design:eye-outlined" />
                    <span class="ml-2">首页展示</span>
                  </template>
                </div>
              </div>
            </template>
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-col justify-between">
      <div class="px-4">
        <div class="my-2" v-for="item in platform" :key="item.key">
          <div class="flex rounded bg-#F5F5F5 px-3 py-2">
            <SvgIcon :name="item.key" :size="30" class="flex-shrink-0 mt-2px" />
            <div class="flex-1 pl-3">
              <div class="flex items-center mb-1">
                <span class="mr-2 font-bold">{{ item.name }}</span>
                <Tag v-if="item?.status === 1" color="success">正常</Tag>
                <Tag v-else color="default">未开通</Tag>
              </div>
              <div class="flex items-center flex-wrap text-xs">
                <div class="text-#86909C mr-4" v-if="item[SkuType.text]">
                  <SvgIcon name="zixun-image" :size="16" class="flex-shrink-0" />
                  <span class="ml-1">图文：</span>
                  <span class="text-#1890FF" v-if="item[SkuType.text]"
                    >¥{{ ((item[SkuType.text]?.price || 0) / 100)?.toFixed(2) }}/{{
                      formatTime(item[SkuType.text]?.duration)
                    }}</span
                  >
                  <span v-else>-</span>
                </div>
                <div class="text-#86909C mr-4" v-if="item[SkuType.phone]">
                  <SvgIcon name="zixun-phone" :size="16" class="flex-shrink-0" />
                  <span class="ml-1">电话：</span>
                  <span class="text-#1890FF" v-if="item[SkuType.phone]"
                    >¥{{ ((item[SkuType.phone]?.price || 0) / 100)?.toFixed(2) }}/{{
                      formatTime(item[SkuType.phone]?.duration)
                    }}</span
                  >
                  <span v-else>-</span>
                </div>
                <div class="text-#86909C" v-if="item[SkuType.dollar]">
                  <SvgIcon name="zixun-one" :size="16" class="flex-shrink-0" />
                  <span class="ml-1">一元：</span>
                  <span class="text-#1890FF" v-if="item[SkuType.dollar]"
                    >¥{{ ((item[SkuType.dollar]?.price || 0) / 100)?.toFixed(2) }}/次</span
                  >
                  <span v-else>-</span>
                </div>

                <div
                  class="text-gray-400"
                  v-if="!item[SkuType.text] && !item[SkuType.phone] && !item[SkuType.dollar]"
                  >暂无服务内容</div
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end py-3 px-4">
        <a-button class="mr-3" @click="emits('promotion', consultant.consultant_id)">推广</a-button>
        <a-button type="primary" @click="emits('toDetails', consultant.consultant_id)"
          >查看详情</a-button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, PropType, ref } from 'vue';
  import { Tag, Dropdown, Popconfirm, message } from 'ant-design-vue';
  import {
    ConsultantItemModel,
    ConsultantSkus,
    SkuType,
    ConsultantType,
  } from '/@/api/serviceStaff/model/consultant';
  import { Icon, SvgIcon } from '/@/components/Icon';
  import { formatTime } from '/@/utils';
  import { setConsultantStatus, setConsultantRecommend } from '/@/api/serviceStaff/consultant';

  interface PlatFormSku {
    key: string;
    name: string;
    status?: number;
    [SkuType.text]?: ConsultantSkus | undefined;
    [SkuType.phone]?: ConsultantSkus | undefined;
    [SkuType.dollar]?: ConsultantSkus | undefined;
  }

  const props = defineProps({
    consultant: {
      type: Object as PropType<ConsultantItemModel>,
      default: () => ({}),
    },
  });

  const emits = defineEmits({
    toDetails: (id) => id,
    promotion: (id) => id,
    refresh: () => true,
  });

  const visible = ref(false);
  const loading = ref(false);

  const platform = computed(() => {
    const data: PlatFormSku[] = [
      {
        key: 'dy',
        name: '抖音',
      },
      // {
      //   key: 'ks',
      //   name: '快手',
      // },
      // {
      //   key: 'wx',
      //   name: '微信',
      // },
    ];
    data.forEach((item) => {
      const key = `${item.key}_sku`;
      const info = props.consultant[key];
      item.status = info.status;
      info.sku_data.forEach((val) => {
        item[val.type] = val;
      });
    });
    return data;
  });

  function changeStatus() {
    loading.value = true;
    setConsultantStatus({
      consultant_id: props.consultant.consultant_id,
      status: +!props.consultant.status,
    })
      .then(() => {
        message.success(`${props.consultant.status ? '禁用' : '启用'}咨询师成功`);
        emits('refresh');
      })
      .finally(() => {
        loading.value = false;
      });
  }
  function changeShowStatus() {
    loading.value = true;
    const status = +!props.consultant?.is_recommend as 0 | 1;
    setConsultantRecommend({
      consultant_id: props.consultant.consultant_id,
      type: status,
    })
      .then(() => {
        message.success(`操作成功`);
        emits('refresh');
      })
      .finally(() => {
        loading.value = false;
      });
  }
</script>

<style lang="less">
  .consultant-item {
    .ant-badge-status-text {
      color: inherit;
      font-size: 12px;
    }
  }

  .del-consultant {
    &.ant-dropdown-menu {
      box-shadow: none;
    }
  }
</style>
