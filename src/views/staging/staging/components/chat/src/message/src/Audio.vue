<template>
  <div class="select-none">
    <div
      class="flex items-center cursor-pointer"
      :class="{ 'flex-row-reverse': msgLayout === 'right' }"
      @click="handleAudio"
    >
      <div
        class="mr-1 w-4 h-4"
        :class="{
          'sprit-left': msgLayout === 'left' && !playing,
          'sprit-right': msgLayout === 'right' && !playing,
          'sprite-animations': msgLayout === 'right' && playing,
          'sprite-animation': msgLayout === 'left' && playing,
        }"
      ></div>
      <div :class="[msgLayout === 'right' ? 'ml-1' : 'mr-1']">{{ duration }}''</div>
    </div>

    <audio
      :src="src"
      class="hidden"
      ref="audio"
      @canplay="getDuration"
      @error="playing = false"
      @ended="playing = false"
      @suspend="handleSuspend"
    ></audio>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';

  const props = defineProps({
    src: {
      type: String,
      default: '',
    },
    playSrc: {
      type: String,
      default: '',
    },
    msgLayout: {
      default: 'left',
      type: String,
    },
  });
  watch(
    () => props.playSrc,
    () => {
      console.log(props.playSrc, props.src);
      if (props.src !== props.playSrc) {
        console.log(11, props.src !== props.playSrc);

        audio.value?.pause();
        playing.value = false;
      }
    },
  );

  const emits = defineEmits(['onError', 'update:playSrc']);

  const playing = ref(false);
  const error = ref(false);
  const audio = ref<HTMLAudioElement>();
  const duration = ref(0);

  function getDuration() {
    error.value = false;
    emits('onError', error.value);
    const d = audio.value?.duration || 0;
    const times = Math.floor(d < 1 ? 1 : d);
    duration.value = times || 0;
  }

  function handleSuspend() {
    error.value = true;
    emits('onError', error.value);
  }

  function handleAudio() {
    if (audio.value && !error.value) {
      if (audio.value.paused) {
        audio.value.currentTime = 0;
        audio.value.play();
        emits('update:playSrc', props.src);
        playing.value = true;
      } else {
        audio.value.pause();
        playing.value = false;
      }
    }
  }
</script>

<style scoped>
  .sprit-left {
    background-image: url('https://ttmini.oss-cn-shenzhen.aliyuncs.com/advisory/iconfont/jj2.png');
    background-size: auto 100%;
  }

  .sprit-right {
    background-image: url('https://ttmini.oss-cn-shenzhen.aliyuncs.com/advisory/iconfont/jj1.png');
    background-size: auto 100%;
  }

  .sprite-animation {
    animation: sprite-animation 1.5s steps(3) infinite;
    background-image: url('https://ttmini.oss-cn-shenzhen.aliyuncs.com/advisory/iconfont/long1.png');
    background-size: auto 100%;
  }

  .sprite-animations {
    animation: sprite-animations 1.5s steps(3) infinite;
    background-image: url('https://ttmini.oss-cn-shenzhen.aliyuncs.com/advisory/iconfont/long2.png');
  }

  @keyframes sprite-animation {
    from {
      background-position: 0 0; /* 从左上角开始 */
    }

    to {
      background-position: -48px 0; /* 最后一帧从左到右滚动 */
    }
  }

  @keyframes sprite-animations {
    from {
      background-position: -48px 0; /* 从左上角开始 */
    }

    to {
      background-position: 0 0; /* 最后一帧从左到右滚动 */
    }
  }
</style>
