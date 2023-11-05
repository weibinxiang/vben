<script lang="ts" setup>
  import type { PropType } from 'vue';
  import { ConsultantItemModel } from '/@/api/serviceStaff/model/consultant';

  defineProps({
    formData: {
      type: Object as any,
      default: () => {},
    },
    lawyerList: {
      type: Array as PropType<ConsultantItemModel[]>,
      default: () => [],
    },
    positionName: {
      type: String,
      default: '',
    },
  });
</script>

<template>
  <div class="bg-[#fff] rounded-8px mt-4 relative">
    <div class="layer-card-bg rounded-t-8px px-3 py-4" v-if="lawyerList.length">
      <div class="flex case-item">
        <div class="relative mr-3 overflow-hidden rounded-md w-25 h-30">
          <img
            class="w-25 h-30"
            :src="lawyerList[0]?.consultant_avatar?.image_url"
            mode="aspectFill"
          />
          <div
            class="w-full h-5 bg-[#fff] text-xl text-#1133B1 text-center leading-20 absolute bottom-0"
            >满意度99</div
          >
        </div>
        <div class="relative flex-1">
          <div class="relative flex items-center w-full">
            <div class="text-[#fff] text-base font-semibold mr-2">
              {{ lawyerList[0].name }}
            </div>
            <div
              class="bg-[#447af5] font-normal text-xs text-[#fff] h-4 pl-1 pr-1 flex justify-center items-center leading-4 rounded-3xl"
            >
              <img
                class="flex-shrink-0 mr-2 w-3 h-3"
                src="https://ttmini.yizhiwechat.com/advisory/adviceroom/lawyer-bag-icon.png"
                mode="scaleToFill"
              />
              {{ positionName }}
            </div>
          </div>
          <div class="text-[#fff] text-mini line-clamp-2 mt-3">
            <!-- {{ headLayer[0].consultant_info?.introduction }} -->
          </div>
          <div class="flex mt-8">
            <!-- <div
              v-for="i in headLayer[0].consultant_domain.slice(0, 3)"
              :key="i.domain_id"
              class="text-[#fff] border-[2rpx] border-[#fff] text-xl px-4 rounded-[5rpx] mr-6 mb-6 font-normal"
              >{{ i.domain?.domain }}</div
            > -->
          </div>
          <div class="text-[#fff] absolute bottom-0 flex items-end justify-between w-full">
            <div class=""> </div>
            <div
              class="h-6 w-17 text-[#165DFF] text-xs bg-[#fff] rounded flex items-center justify-center"
            >
              去咨询
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="px-3 pb-3" v-if="lawyerList.length > 1">
      <div
        v-for="item in lawyerList.slice(1)"
        :key="item.consultant_id"
        class="flex pt-4 case-item"
      >
        <div class="relative mr-3 overflow-hidden rounded-md w-25 h-30">
          <img class="w-25 h-30" :src="item?.consultant_avatar?.image_url" mode="aspectFill" />
          <div
            class="w-full h-5 bg-rec-btn text-xl text-[#fff] text-center leading-20 absolute bottom-0"
            >满意度99</div
          >
        </div>
        <div class="relative flex-1">
          <div class="relative flex items-center w-full">
            <div class="text-[#273240] text-base font-semibold mr-8"> {{ item.name }} </div>
            <div class="absolute right-0 text-[#86909C] text-xl flex items-center"> </div>
          </div>
          <div class="text-[#4E5969] text-mini line-clamp-2 mt-3">
            <!-- {{ item.consultant_info?.introduction }} -->
          </div>
          <div class="flex mt-8">
            <!-- <div
              v-for="i in item.consultant_domain.slice(0, 3)"
              :key="i.domain_id"
              class="text-[#A5AAB2] border-[1rpx] border-[#A5AAB2] bg-[#FFF] text-mini px-4 rounded-[5rpx] mr-6 mb-6"
              >{{ i.domain?.domain }}</div
            > -->
          </div>
          <div class="text-[#FF7E36] absolute bottom-0 flex items-end justify-between w-full">
            <div class=""></div>
            <div
              class="h-6 w-17 text-[#FFF] text-xs bg-[#165DFF] rounded flex items-center justify-center"
            >
              去咨询
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @font-face {
    font-family: font-number;
    src: url('https://ttmini.yizhiwechat.com/keTang/v147/Plumb.ttf');
  }

  .num-font {
    font-family: font-number;
  }

  .layer-card-bg {
    // background: url('https://ttmini.yizhiwechat.com/advisory/adviceroom/grey-medal.png') no-repeat
    //     60% 0 / 152rpx 176rpx,
    // background: linear-gradient(151deg, #3170ff 7.76%, #0445d8 88.31%);
    background: url('https://ttmini.yizhiwechat.com/advisory/adviceroom/layer-bg-card-new.png')
      no-repeat 0 0 / 100% 100%;
  }

  .bg-work {
    background: url('https://ttmini.yizhiwechat.com/advisory/adviceroom/work-year.png') no-repeat 0
      0 / cover;
  }

  .bg-btn {
    border: 1rpx solid #fff;
    border-radius: 26rpx;
    background: linear-gradient(145deg, #ffe0a9 0%, #ffbd65 100%);
  }

  .bg-rec-btn {
    background: linear-gradient(176deg, #2753e3 0%, #0b2ba5 100%);
    box-shadow: 0 0 1px 0 #fff inset;
  }

  .case-item:not(:last-child) {
    padding-bottom: 32rpx;
    border-bottom: 2rpx solid #f3f3f3;
  }
</style>
