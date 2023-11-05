<template>
  <BasicModal
    @register="registerModal"
    title="咨询问题"
    :width="560"
    :footer="null"
    v-bind="$attrs"
  >
    <div class="question-details p-5">
      <div class="question-details-cell">
        <div class="question-details-label">所在地区：</div>
        <div class="question-details-value">{{ consulting?.consulting_brief?.district }}</div>
      </div>
      <div class="question-details-cell">
        <div class="question-details-label">案件类型：</div>
        <div class="question-details-value">{{
          consulting?.consulting_brief?.domain_detail?.domain
        }}</div>
      </div>
      <div class="question-details-cell">
        <div class="question-details-label">涉案金额：</div>
        <div class="question-details-value">{{ consulting?.consulting_brief?.amount }}元</div>
      </div>
      <div class="question-details-cell">
        <div class="question-details-label">问题描述：</div>
        <div class="question-details-value">{{ consulting?.consulting_brief?.brief }}</div>
      </div>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useStagingStore } from '/@/store/modules/staging';

  const StagingStore = useStagingStore();
  const consulting = computed(() => {
    return StagingStore.consulting;
  });
  const [registerModal] = useModalInner((data) => {
    console.log(data);
  });
</script>

<style lang="less">
  .question-details {
    .question-details-cell {
      display: flex;
      margin-bottom: 14px;
    }

    .question-details-label {
      width: 108px;
      color: rgb(134 144 156 / 90%);
    }

    .question-details-value {
      @apply truncate;

      flex: 1;
    }
  }
</style>
