<script setup lang="ts">
import { ref, onMounted } from 'vue';

const dark = ref(false);

onMounted(() => {
  dark.value = localStorage.getItem('theme') === 'dark';
  document.documentElement.classList.toggle('dark', dark.value);
});

function toggle() {
  dark.value = !dark.value;
  localStorage.setItem('theme', dark.value ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', dark.value);
}
</script>

<template>
  <button type="button" aria-label="切换主题" @click="toggle">
    {{ dark ? '☀️' : '🌙' }}
  </button>
</template>
