<template>
  <nav class="sticky top-4 z-50 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="glass-card flex items-center justify-between rounded-[1.5rem] px-4 py-3 sm:px-5">
      <router-link to="/" class="group flex items-center gap-3">
        <span class="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-transform duration-500 ease-custom group-hover:-rotate-6 group-hover:scale-105">
          L
        </span>
        <div class="hidden sm:block">
          <div class="text-sm font-semibold tracking-tight text-text">britliang Journal</div>
          <div class="text-xs text-muted">hello its my personal Blog</div>
        </div>
      </router-link>

      <div class="flex items-center gap-2 sm:gap-3">
        <router-link
          to="/"
          class="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors duration-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
          active-class="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
        >
          首页
        </router-link>
        <router-link
          to="/about"
          class="rounded-full px-4 py-2 text-sm font-medium text-muted transition-colors duration-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
          active-class="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
        >
          关于
        </router-link>

        <button
          type="button"
          class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted transition-all duration-500 ease-custom hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
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
