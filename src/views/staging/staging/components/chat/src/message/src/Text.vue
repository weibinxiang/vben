<template>
  <div class="break-words">{{ text }}</div>
</template>

<script lang="ts" setup>
  defineProps({
    text: {
      type: String,
      default: '',
    },
  });
</script>
