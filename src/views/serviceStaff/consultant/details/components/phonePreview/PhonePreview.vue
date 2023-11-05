<template>
  <div
    class="z-100 phone-preview"
    :style="{
      '--phone-width': width,
    }"
  >
    <img src="/src/assets/images/phone-bg.png" alt="" class="phone-preview-wrap" />
    <div class="absolute phone-preview-content">
      <div class="h-full rounded-b-100px overflow-hidden relative">
        <div class="h-full overflow-y-auto phone-preview-scroll">
          <ConsultantPreview
            :consultant="consultant"
            v-if="consultant?.consultant_type === ConsultantType.lawyer"
          />
          <DefaultPreview :consultant="consultant" v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { PropType } from 'vue';
  import ConsultantPreview from './src/Consultant.vue';
  import DefaultPreview from './src/Default.vue';
  import { ConsultantInfo } from './typing';
  import { ConsultantType } from '/@/api/serviceStaff/model/consultant';

  defineProps({
    width: {
      type: Number,
      default: 300,
    },
    consultant: {
      type: Object as PropType<ConsultantInfo>,
      default: () => ({}),
    },
  });
</script>

<style lang="less">
  .phone-preview {
    --phone-left: 47;
    --phone-right: 45;
    --phone-bottom: 35;
    --phone-top: 226;

    transform: scale(calc(var(--phone-width) / (750 + var(--phone-left) + var(--phone-right))));
    transform-origin: top left;
    border-radius: 100px;
    background-color: #f8f8f8;

    img {
      -webkit-user-drag: none;
    }

    &-wrap {
      position: relative;
      width: calc((var(--phone-left) + var(--phone-right) + 750) * 1px);
    }

    &-content {
      top: calc(var(--phone-top) * 1px);
      left: calc(var(--phone-left) * 1px);
      width: 750px;
      height: calc(100% - ((var(--phone-top) + var(--phone-bottom)) * 1px));
      overflow: hidden;
      font-size: 12px;
    }
  }

  .phone-preview-scroll::-webkit-scrollbar {
    display: none;
  }
</style>
