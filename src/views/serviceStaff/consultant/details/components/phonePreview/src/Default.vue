<template>
  <div class="p-8">
    <!-- 咨询师介绍 -->
    <div class="w-full rounded-lg bg-white px-6 relative mt-8 pt-37 pb-9">
      <div class="absolute flex items-end left-6 -top-8">
        <div class="flex-shrink-0">
          <img
            :src="consultant.consultant_avatar?.image_url || ConsultantAvatar"
            class="w-38 h-38 rounded-full object-cover"
          />
        </div>
        <div class="ml-10">
          <div class="flex items-center">
            <div class="text-#1D2129 text-40px font-semibold truncate">{{ consultant.name }}</div>
          </div>
          <div class="h-10">
            <div v-if="consultant.consultant_info?.tags?.length" class="flex items-center mt-4">
              <div
                v-for="item in consultant.consultant_info.tags"
                :key="item"
                style="background: linear-gradient(93deg, #7a84a0 -1.49%, #5d6888 101.31%)"
                class="px-6 py-1 rounded-full text-white text-2xl font-semibold mr-4 mb-2 flex-none"
                >{{ item }}</div
              >
            </div>
          </div>
        </div>
      </div>
      <div v-if="consultant.consultant_info?.good_problems">
        <img
          class="float-left mr-3 w-34.5 h-9"
          src="https://ttmini.yizhiwechat.com/advisory/iconfont/icon-sign.png"
        />
        <div class="text-#4E5969 font-semibold text-2xl leading-10 truncate-2">
          {{ consultant.consultant_info.good_problems }}
        </div>
      </div>
      <div class="flex mt-8 w-full">
        <div class="flex-1 flex items-end justify-center border-r border-#C9CDD4 px-2">
          <span class="text-#002BB8 text-32px font-bold leading-8 whitespace-nowrap"> 100% </span>
          <span class="text-#86909C text-22px ml-2 leading-6 whitespace-nowrap">评价率</span>
        </div>
        <div class="flex-1 flex items-end justify-center border-r border-#C9CDD4 px-2">
          <span class="text-#273240 text-32px font-bold leading-8 whitespace-nowrap">{{
            formatNumber(+(consultant?.consultant_info?.virtual_service_count || 0))
          }}</span>
          <span class="text-#273240 text-2xl font-semibold ml-2 leading-6 whitespace-nowrap"
            >次</span
          >
          <span class="text-#86909C text-22px ml-2 leading-6 whitespace-nowrap">解答次数</span>
        </div>
        <div class="flex-1 flex items-end justify-center px-2">
          <span class="text-#273240 text-32px font-bold leading-8 whitespace-nowrap">{{
            formatNumber(+(consultant.consultant_info?.case_duration || 0))
          }}</span>
          <span class="text-#273240 text-2xl font-semibold ml-2 leading-6 whitespace-nowrap"
            >小时</span
          >
          <span class="text-#86909C text-22px ml-2 leading-6 whitespace-nowrap">服务时长</span>
        </div>
      </div>
    </div>

    <!-- 业务介绍 -->
    <img
      src="https://ttmini.yizhiwechat.com/zixun-oss/default-preview.png"
      class="w-full mt-9 mb-7"
    />

    <!-- 更多服务 -->
    <div v-if="consultant.consultant_skus?.length" class="mt-9 w-full bg-white rounded-lg p-6">
      <div class="font-semibold text-#1D2129 text-28px">更多服务</div>
      <div class="mt-8">
        <template v-for="item in consultant.consultant_skus" :key="item.consultant_sku_id">
          <div v-if="item?.type !== 3" class="p-6 bg-#F7F7F7 rounded-lg mt-7">
            <div class="flex items-center justify-between">
              <div class="flex items-center text-#273240 text-32px font-semibold">
                <img
                  class="mr-4 w-13 h-13"
                  :src="`https://ttmini.yizhiwechat.com/advisory/iconfont/icon-serve-${
                    item?.type === 1 ? 'phone' : 'text'
                  }.png`"
                  mode="scaleToFill"
                />
                {{ item?.type === 1 ? '电话咨询' : '图文咨询' }}
              </div>
              <div class="flex items-center">
                <div class="flex items-center text-#002BB8 text-32px font-bold">
                  <div class="text-22px">￥</div>
                  <div class="">{{ Number((item?.price || 0) / 100).toFixed(2) }}</div>
                </div>
                <div class="mx-1.5 text-#4E5969 text-22px font-semibold">/</div>
                <div class="text-#4E5969 text-22px font-semibold">{{ item?.duration }}分钟</div>
              </div>
            </div>
            <div class="flex items-center justify-between mt-3">
              <div v-if="item?.type === 1" class="text-#4E5969 text-2xl"
                >与老师即时沟通，解决您的燃煤之急</div
              >
              <div v-else class="text-#4E5969 text-2xl w-100"
                >在线咨询室，方便发送图片/视频等内容，沟通方式更丰富</div
              >
              <div class="flex items-center text-black text-2xl font-semibold">立即咨询 ></div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- 老师介绍 -->
    <div class="mt-9 w-full bg-white rounded-lg p-6">
      <div class="font-semibold text-#1D2129 text-28px">咨询师介绍</div>
      <div class="flex mt-10">
        <img
          class="flex-shrink-0 mr-6 w-14 h-14"
          src="https://ttmini.yizhiwechat.com/advisory/iconfont/icon-teacher-about.png"
        />
        <div>
          <div class="text-#273240 text-28px font-semibold">个人简介</div>
          <div class="text-#4E5969 text-22px mt-3">{{
            consultant.consultant_info?.introduction
          }}</div>
        </div>
      </div>

      <div v-if="consultant.consultant_info?.educational_background" class="flex mt-10">
        <img
          class="flex-shrink-0 mr-6 w-14 h-14"
          src="https://ttmini.yizhiwechat.com/advisory/iconfont/icon-teacher-sare.png"
        />
        <div>
          <div class="text-#273240 text-28px font-semibold">专业背景</div>
          <div class="text-#4E5969 text-22px mt-3">{{
            consultant.consultant_info?.educational_background
          }}</div>
        </div>
      </div>

      <div v-if="consultant.consultant_info?.honor" class="flex mt-10">
        <img
          class="flex-shrink-0 mr-6 w-14 h-14"
          src="https://ttmini.yizhiwechat.com/advisory/iconfont/icon-teacher-honor.png"
        />
        <div>
          <div class="text-#273240 text-28px font-semibold">获得荣誉</div>
          <div class="text-#4E5969 text-22px mt-3">{{ consultant.consultant_info?.honor }}</div>
        </div>
      </div>
      <div class="text-#C9CDD4 text-22px mt-10">
        声明:
        当前咨询师资料(包括但不限于咨询师头像、个人信息等)仅授权本平台展示使用，未经本人和平台同意，其他机构或个人不得擅自复制、链接、使用或转载，或以任何方式建立镜像。
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';
  import { ConsultantInfo } from '../typing';
  import { formatNumber } from '../helper';
  import ConsultantAvatar from '/@/assets/images/avatar/consultant.jpg';

  defineProps({
    consultant: {
      type: Object as PropType<ConsultantInfo>,
      default: () => ({}),
    },
  });
</script>

<style lang="scss"></style>
