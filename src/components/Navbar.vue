<template>
  <nav class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
    <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
      <router-link to="/" class="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">MyBlog</router-link>
      <div class="flex items-center gap-6">
        <router-link to="/" class="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">首页</router-link>
        <router-link to="/about" class="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">关于</router-link>
        <button @click="toggleDark" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label="Toggle Dark Mode">
          <span v-if="isDark" class="text-yellow-500">☀️</span>
          <span v-else class="text-slate-600">🌙</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
})
</script>
