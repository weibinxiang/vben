<template>
  <div class="consultant-preview">
    <div class="flex consultant-preview-header">
      <div class="consultant-preview-header-avatar rounded-full flex-shrink-0">
        <img
          :src="consultant.consultant_avatar?.image_url || ConsultantAvatar"
          class="w-full h-full rounded-full object-cover"
        />
      </div>
      <div class="consultant-preview-header-info flex-1 overflow-hidden">
        <div class="flex justify-between">
          <div class="consultant-preview-header-name font-semibold truncate flex-1">
            {{ consultant?.name || '未填写' }}</div
          >
          <div
            v-if="consultant?.consultant_info?.province"
            class="text-#4E5969 text-2xl flex items-center flex-shrink-0"
          >
            <img
              src="https://ttmini.yizhiwechat.com/advisory/adviceroom/map-icon.png"
              class="w-8 h-8"
            />
            {{ `${consultant?.consultant_info?.province}·${consultant?.consultant_info?.city}` }}
          </div>
        </div>
        <div class="text-white font-bold flex flex-wrap">
          <div
            class="consultant-preview-header-tag"
            v-for="(item, index) in consultant.consultant_info?.tags"
            :key="index"
          >
            <div>{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="consultant?.domain_arr?.length" class="flex flex-wrap items-center -mr-8">
      <div class="flex items-center text-2xl font-normal mt-6">
        <img
          class="mr-1.5 w-7 h-7"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/like-icon.png"
        />
        招牌领域：
      </div>
      <div
        v-for="(item, index) in consultant?.domain_arr"
        :key="index"
        class="bg-white rounded py-1.5 px-6 text-#273240 mr-6 text-2xl font-normal mt-6"
      >
        {{ item?.domain }}
      </div>
    </div>
    <div
      class="rounded-2xl border border-#ffdab8 relative px-6 pt-20.5 pb-13 mt-8 flex items-center justify-between text-center border-b-2px border-#f3f3f3"
      style="
        background: linear-gradient(180deg, #fffdf6 0%, #f8f9f9 100%);
        box-shadow: 0 8rpx 32rpx 0 rgb(7 38 74 / 2%);
      "
    >
      <div
        class="rounded-b-2xl absolute left-0 top-0 w-60 h-12 text-xl flex justify-center items-center bg-#FFF5DE text-#643000"
      >
        服务经验 | 2023年过审
      </div>
      <div>
        <div class="text-#002BB8 font-bold text-44px mb-3">100%</div>
        <div class="text-#86909C text-2xl">综合评价率</div>
      </div>
      <div class="bg-#DCDCDC w-1px h-8"></div>
      <div>
        <div class="mb-3">
          <span class="font-bold text-44px">{{ consultant?.consultant_info?.term || 0 }}</span>
          <span class="text-2xl">年</span>
        </div>
        <div class="text-[#86909C] text-2xl">从业年限</div>
      </div>
      <div class="bg-#DCDCDC w-1px h-8"></div>
      <div>
        <div class="mb-3">
          <span class="font-bold text-44px">{{
            formatNumber(+(consultant?.consultant_info?.virtual_service_count || 0))
          }}</span>
          <span class="text-2xl">次</span></div
        >
        <div class="text-#86909C text-2xl">服务次数</div>
      </div>
      <div class="bg-#DCDCDC w-1px h-8"></div>
      <div>
        <div class="mb-3">
          <span class="font-bold text-44px">{{
            formatNumber(+(consultant?.consultant_info?.case_duration || 0))
          }}</span>
          <span class="text-2xl">小时</span>
        </div>
        <div class="text-#86909C text-2xl">个案时长</div>
      </div>
    </div>
    <div class="bg-white rounded-2xl mt-8 px-6 py-6">
      <div v-if="consultant?.consultant_skus?.length" class="flex justify-between">
        <div
          v-for="(item, index) in consultant?.consultant_skus || []"
          :key="index"
          class="w-full relative flex flex-col items-center justify-center overflow-hidden rounded h-54 rounded-lg border-4px border-#efefef bg-white"
          :class="{
            '!border-#0463fc !bg-#dff2ff59': item?.type === selectType,
            '!w-77': consultant.consultant_skus?.length > 1,
          }"
          @click="selectType = item?.type || 1"
        >
          <img
            v-if="item?.type === 1"
            src="https://ttmini.yizhiwechat.com/advisory/adviceroom/recommend-icon.png"
            class="absolute top-0 left-0 w-30 h-12"
          />
          <img
            v-if="item?.type === selectType"
            src="https://ttmini.yizhiwechat.com/advisory/adviceroom/bottom-check-icon.png"
            class="absolute bottom-0 right-0 w-10 h-10"
          />
          <img
            class="w-16 h-16"
            :src="`https://ttmini.yizhiwechat.com/advisory/adviceroom/${
              item?.type === 1 ? 'phone' : 'photo'
            }-icon.png`"
          />
          <div class="text-32px font-semibold">{{
            item?.type === 1 ? '电话咨询' : '图文咨询'
          }}</div>
          <div class="text-#FF634D">
            <span class="text-xl">￥</span>
            <span class="font-bold text-28px">{{
              `${((item?.price || 0) / 100).toFixed(2)}/${item?.duration || 0}分钟`
            }}</span>
          </div>
        </div>
      </div>
      <div
        class="relative px-8 pt-16 pb-8 mt-3"
        :class="[
          consultant?.consultant_skus?.findIndex((item) => item?.type === selectType)
            ? 'consultant-preview-bg-right'
            : 'consultant-preview-bg-left',
        ]"
      >
        <div class="text-#4e5969 text-26px"> {{ tipList?.step }}</div>
        <div
          v-for="(item, index) in tipList?.stepPoint"
          :key="index"
          class="text-#4E5969E5 text-2xl mt-6 flex"
        >
          <div class="w-2 h-2 rounded-full bg-#4E5969E5 flex-shrink-0 mt-3 mx-3"></div>
          {{ item }}
        </div>
      </div>
      <img
        src="https://ttmini.yizhiwechat.com/advisory/adviceroom/card-bottom-footer.png"
        class="w-full mt-6"
      />
    </div>
    <div class="bg-white rounded-2xl px-6 py-6 mt-8">
      <div class="relative flex items-center justify-between">
        <div class="text-3xl font-semibold text-#273240">服务范畴</div>
        <div class="absolute right-0 z-10 w-full h-full"></div>
      </div>
      <div class="flex flex-wrap justify-between mt-8">
        <img
          v-for="(item, index) in 4"
          :key="item"
          class="h-50 w-76.5 mb-7"
          :src="`https://ttmini.yizhiwechat.com/advisory/adviceroom/serve-item-${index}.png`"
        />
      </div>
      <div class="text-#4E5969 text-2xl flex justify-center items-center">
        <img
          class="h-4 w-3.5"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/double-arrow.png" />
        <view class="mx-2">更多精选服务</view>
        <img
          class="h-4 w-3.5"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/double-arrow.png"
      /></div>
      <div>
        <div class="flex justify-between mt-8">
          <img
            v-for="(item, index) in 4"
            :key="item"
            class="h-58 w-37"
            :src="`https://ttmini.yizhiwechat.com/advisory/adviceroom/serve-tag-${index}.png`"
          />
        </div>
      </div>
    </div>
    <div class="bg-white rounded-2xl mt-8 px-6 pb-9 pt-6">
      <div class="text-28px font-semibold text-#273240 mb-8">律师档案</div>
      <div v-if="consultant?.consultant_info?.introduction" class="flex justify-between mb-12">
        <img
          class="flex-shrink-0 w-16 h-16 mr-8"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/lawyer-detail-0.png"
        />
        <div class="flex-1">
          <div class="font-semibold text-2xl text-#4E5969">个人简介</div>
          <div class="mt-3 text-22px text-#4E5969 opacity-80">{{
            consultant?.consultant_info?.introduction
          }}</div>
        </div>
      </div>
      <div
        v-if="consultant?.consultant_info?.educational_background"
        class="flex justify-between mb-12"
      >
        <img
          class="flex-shrink-0 w-16 h-16 mr-8"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/lawyer-detail-1.png"
        />
        <div class="flex-1">
          <div class="font-semibold text-2xl text-#4E5969">教育背景</div>
          <div class="mt-3 text-22px text-#4E5969 opacity-80">{{
            consultant?.consultant_info?.educational_background
          }}</div>
        </div>
      </div>
      <div v-if="consultant?.consultant_info?.licence" class="flex justify-between mb-12">
        <img
          class="flex-shrink-0 w-16 h-16 mr-8"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/lawyer-detail-2.png"
        />
        <div class="flex-1">
          <div class="font-semibold text-2xl text-#4E5969">执照认证</div>
          <div class="flex items-center mt-3">
            <div class="mt-3 text-22px text-#4E5969 opacity-80">{{
              `执业证号：${consultant?.consultant_info?.licence}`
            }}</div>
            <div class="text-#165DFF flex items-center text-xl ml-5">
              <img
                class="w-5 h-5 mr-3"
                src="https://ttmini.yizhiwechat.com/advisory/adviceroom/auth_blue.png"
              />
              已认证
            </div>
          </div>
        </div>
      </div>
      <div v-if="consultant?.law_firm" class="flex justify-between mb-12">
        <img
          class="flex-shrink-0 w-16 h-16 mr-8"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/lawyer-detail-3.png"
        />
        <div class="flex-1">
          <div class="font-semibold text-2xl text-#4E5969">律所认证</div>
          <div class="flex items-center mt-3">
            <div class="text-22px text-#4E5969 opacity-80">{{ consultant?.law_firm?.name }}</div>
            <div class="text-#165DFF flex items-center text-xl ml-5">
              <img
                class="w-5 h-5 mr-3"
                src="https://ttmini.yizhiwechat.com/advisory/adviceroom/auth_blue.png"
              />
              已认证
            </div>
          </div>
        </div>
      </div>
      <div v-if="consultant?.consultant_info?.honor" class="flex justify-between mb-12">
        <img
          class="flex-shrink-0 w-16 h-16 mr-8"
          src="https://ttmini.yizhiwechat.com/advisory/adviceroom/lawyer-detail-3.png"
        />
        <div class="flex-1">
          <div class="font-semibold text-24px text-#4E5969">荣誉</div>
          <div class="mt-3 text-22px text-#4E5969 opacity-80">{{
            consultant?.consultant_info?.honor
          }}</div>
        </div>
      </div>
      <div class="text-#C9CDD4 font-normal text-xl text-center mt-12"
        >声明：当前律师资料(包括但不限于律师头像、执业证号、律所信息等)仅授权本平台展示使用，未经本人和平台同意，其他机构或个人不得撞自复制、链接、使用或转载，或以任何方式建立镜像。
      </div>
      <div
        class="pb-15 left-0 absolute bottom-0 w-full left-0"
        style="background: linear-gradient(180deg, rgb(246 246 246 / 0%) 0%, #f6f6f6 22.6%)"
      >
        <div
          class="flex items-center justify-center h-24 mx-8 rounded-lg text-white text-32px font-semibold"
          style="background: linear-gradient(176deg, #2753e3 0%, #0b2ba5 100%)"
        >
          <div>
            {{ selectType === 1 ? '电话咨询' : '图文咨询' }}
          </div>
          <div v-if="sku?.price" class="ml-8">
            {{ `${sku.price.toFixed(2)}/${sku?.duration}分钟` }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, PropType, computed } from 'vue';
  import { formatNumber } from '../helper';
  import { ConsultantInfo } from '../typing';
  import ConsultantAvatar from '/@/assets/images/avatar/consultant.jpg';

  const props = defineProps({
    consultant: {
      type: Object as PropType<ConsultantInfo>,
      default: () => ({}),
    },
  });

  const selectType = ref(1);

  const tipList = computed(() => {
    if (selectType.value === 1) {
      return {
        step: '发起咨询 >律师响应 > 沟通咨询 > 评价服务',
        stepPoint: [
          '下单后您可以获得二十次免费的图文咨询便于可以提前沟通',
          '电话咨询仅支持单次通话，您需要预留充足的沟通时间（若不小心挂断律师将会立即回拨）',
        ],
      };
    } else {
      return {
        step: '发起咨询 >律师响应 > 沟通咨询 > 评价服务',
        stepPoint: [
          '下单后您需要提前与律师预约咨询时间,律师将会在24小时内响应,若律师逾期则为您自动退款',
          '图文咨询仅支持连续沟通不支持时长累计,您需要预留充足的沟通时间',
        ],
      };
    }
  });

  const sku = computed(() => {
    return props.consultant?.consultant_skus?.find((item) => item?.type === selectType.value);
  });

  console.log(tipList);
</script>

<style lang="less">
  .consultant-preview {
    padding: 64px 32px 232px;
    background: linear-gradient(180deg, #eff7ff 0%, #f6f6f6 100%);

    &-header {
      &-avatar {
        width: 160px;
        height: 160px;
        margin-right: 40px;
      }

      &-name {
        margin-bottom: 18px;
        font-size: 48px;
      }

      &-tag {
        margin-right: 16px;
        margin-bottom: 10px;
        padding: 4px 24px;
        border-radius: 80px;
        background: linear-gradient(93deg, #7a84a0 -1.49%, #5d6888 101.31%);
        font-size: 24px;
      }
    }

    &-bg-left {
      background: url('https://ttmini.yizhiwechat.com/advisory/adviceroom/line-border-left.png')
        no-repeat 0 0 / 100% 100%;
    }

    &-bg-right {
      background: url('https://ttmini.yizhiwechat.com/advisory/adviceroom/line-border-right.png')
        no-repeat 0 0 / 100% 100%;
    }
  }
</style>
