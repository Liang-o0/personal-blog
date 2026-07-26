<template>
  <footer class="mt-10 border-t border-slate-200/70 bg-white/50 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/40">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-medium text-slate-900 dark:text-white">PWL Journal</p>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Built with Vue 3, Vite, Tailwind CSS and Cloudflare Pages.
        </p>
      </div>

      <div class="flex items-center gap-3 text-sm">
        <router-link
          to="/"
          class="rounded-full px-4 py-2 text-slate-500 transition-colors hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          首页
        </router-link>
        <router-link
          to="/about"
          class="rounded-full px-4 py-2 text-slate-500 transition-colors hover:bg-slate-950/5 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
          关于
        </router-link>
      </div>
    </div>
  </footer>
</template>
