<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :width="550"
    :min-height="100"
    title="通话录音"
    okText="保存"
    :z-index="1111"
    :canFullscreen="false"
    :loading="loading"
    :footer="null"
  >
    <div class="px-[10px] ok-2 pt-4">
      <div class="text-black mb-4"
        >{{ StagingStore.currentServe?.consultant_name }}咨询师与{{
          StagingStore.currentServe?.user_nickname
        }}通话录音：{{ dataValue.begin_time }} - {{ dataValue.end_time }}</div
      >
      <audio class="w-full" :src="dataValue.audio" controls></audio>
    </div>
  </BasicModal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getRecordDetail } from '/@/api/staging/staging';
  import { useStagingStore } from '/@/store/modules/staging';

  const StagingStore = useStagingStore();
  const loading = ref(false);
  const dataValue = ref({
    begin_time: '',
    end_time: '',
    audio: '',
  });

  const [register] = useModalInner((data) => {
    getRecordDetail({
      consulting_id: data.consulting_id,
      consulting_record_id: data.consulting_record_id,
    }).then((res) => {
      dataValue.value = {
        audio: res.record_detail?.detail_data,
        begin_time: res.record_detail?.begin_time,
        end_time: res.record_detail?.end_time,
      };
    });
    // dataValue.value = data;
  });
</script>
