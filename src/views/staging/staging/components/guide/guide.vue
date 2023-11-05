<script lang="ts" setup>
  import { useUserStoreWithOut } from '/@/store/modules/user';
  import { RoleEnum } from '/@/enums/roleEnum';

  const userStore = useUserStoreWithOut();
  const userInfo = userStore.getUserInfo;
</script>

<template>
  <div class="flex flex-col w-full h-full">
    <div class="relative w-full h-80">
      <img src="/src/assets/images/guide_bg.png" class="w-full h-full" alt="" />
      <div class="absolute top-0 left-0 flex">
        <div class="pl-15 pt-22">
          <div class="text-#1D2129 text-6 font-semibold mb-5"
            >你好，{{ userInfo.name
            }}{{
              userInfo.role === RoleEnum.consultant
                ? '咨询师'
                : userInfo.role === RoleEnum.customer
                ? '客服'
                : ''
            }}，欢迎加入「豆角咨询」</div
          >
          <div class="w-142 text-[#4E5969] text-4 font-medium leading-6"
            >请使用微信扫一扫右侧二维码，关注【豆角咨询】公众号，在公众号中完成注册流程后，方可使用电脑网页版工作台</div
          >
        </div>
        <div class="ml-28 pt-8.75">
          <img src="/src/assets/images/qr-code.png" class="w-54 h-54" alt="" />
          <div class="text-#86909C font-medium text-3.5 leading-6 text-center"
            >豆角咨询公众号二维码</div
          >
        </div>
      </div>
    </div>
    <div class="w-full flex-1 bg-white pt-12 pl-20">
      <div class="text-#1D2129 text-6 font-semibold leading-normal mb-6">注册流程</div>
      <div class="w-240.75 h-1 bg-line mb-4"></div>
      <div class="flex w-220 justify-between">
        <img src="/src/assets/images/guide_step_1.png" class="w-56 h-77.5" />
        <img src="/src/assets/images/guide_step_2.png" class="w-56 h-77.5" />
        <img src="/src/assets/images/guide_step_3.png" class="w-56 h-77.5" />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  .bg-line {
    background: linear-gradient(
      90deg,
      rgb(208 227 255 / 69%) -1.75%,
      rgb(222 235 255 / 4%) 106.39%
    );
  }
</style>
