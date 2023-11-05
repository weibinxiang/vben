<template>
  <ScrollContainer
    class="flex-1 relative px-4"
    ref="ScrollContainerRef"
    v-loading="StagingStore.getMsgLoading"
  >
    <div ref="MarkHeadRef"></div>
    <MessageCard :msg="msg" v-for="msg in StagingStore.message" :key="msg.consulting_record_id" />
    <div class="h-5"></div>
  </ScrollContainer>
</template>

<script lang="ts" setup>
  import { ref, watch, nextTick } from 'vue';
  import MessageCard from './Card.vue';
  import { ScrollContainer } from '/@/components/Container';
  import { useStagingStore } from '/@/store/modules/staging';
  import { useDebounceFn } from '@vueuse/core';

  const StagingStore = useStagingStore();

  const ScrollContainerRef = ref<typeof ScrollContainer>();
  const MarkHeadRef = ref();
  const loadMore = ref(false);

  watch(
    () => [StagingStore.message.length, StagingStore.currentServe?.consulting_id],
    () => {
      if (!loadMore.value) {
        scrollBottom();
      }
    },
  );

  const scrollBottom = useDebounceFn(() => {
    nextTick(() => {
      ScrollContainerRef.value?.scrollBottom();
    });
  }, 50);

  nextTick(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0] || {};
        if (entry.isIntersecting) {
          if (StagingStore.message.length) {
            getRecordList();
          }
        }
      },
      {
        root: ScrollContainerRef.value?.$el,
      },
    );
    // 监听目标元素
    observer.observe(MarkHeadRef.value);
  });

  function getRecordList() {
    // 暂存一下加载数据前的高度
    const srcollHieght = ScrollContainerRef.value?.scrollbarRef.wrap.scrollHeight;
    if (StagingStore.serveInfo[StagingStore.currentServe?.consulting_id || 0].msgFinished) return;
    loadMore.value = true;
    StagingStore.queryRecords(StagingStore.message[0].consulting_record_id)
      .then(() => {
        // 重置滚动到上一次数据的位置
        const top = ScrollContainerRef.value?.scrollbarRef.wrap.scrollHeight - srcollHieght;
        ScrollContainerRef.value!.scrollbarRef.wrap.scrollTop = top;
      })
      .finally(() => {
        loadMore.value = false;
      });
  }
</script>
