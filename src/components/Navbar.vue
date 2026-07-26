<template>
  <nav class="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="glass-card flex items-center justify-between rounded-[1.5rem] px-4 py-3 sm:px-5">
      <router-link to="/" class="group flex items-center gap-3">
        <span class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-500 to-violet-500 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
          L
        </span>
        <div class="hidden sm:block">
          <div class="text-sm font-semibold tracking-tight text-slate-950 dark:text-white">britliang Journal</div>
          <div class="text-xs text-slate-500 dark:text-slate-400">hello its my personal Blog</div>
        </div>
      </router-link>

      <div class="flex items-center gap-2 sm:gap-3">
        <router-link
          to="/"
          class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
          active-class="bg-slate-950/5 text-slate-950 dark:bg-white/10 dark:text-white"
        >
          首页
        </router-link>
        <router-link
          to="/about"
          class="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
          active-class="bg-slate-950/5 text-slate-950 dark:bg-white/10 dark:text-white"
        >
          关于
        </router-link>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200/70 bg-white/80 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-cyan-300"
          @click="toggleDark"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :aria-pressed="isDark"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.7A8.5 8.5 0 1 1 11.3 3a7 7 0 0 0 9.7 9.7Z" />
          </svg>
          <svg v-else viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2.5M12 19.5V22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M2 12h2.5M19.5 12H22M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" />
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const isDark = ref(false)

const applyTheme = (dark) => {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem('theme', dark ? 'dark' : 'light')
}

const toggleDark = () => {
  applyTheme(!isDark.value)
}

onMounted(() => {
  const storedTheme = localStorage.getItem('theme')
  const preferredDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = storedTheme ? storedTheme === 'dark' : preferredDark

  applyTheme(dark)
})
</script>
