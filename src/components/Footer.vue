<template>
  <footer class="mt-10 border-t border-border/50 bg-card/30 backdrop-blur-xl">
    <div class="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-semibold text-text">PWL Journal</p>
        <p class="mt-1 text-sm text-muted">
          Built with Vue 3, Vite, Tailwind CSS and Cloudflare Pages.
        </p>
      </div>


      <div class="flex items-center gap-3 text-sm">
        <router-link
          to="/"
          class="rounded-full px-4 py-2 text-muted transition-colors duration-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
        >
          首页
        </router-link>
        <router-link
          to="/about"
          class="rounded-full px-4 py-2 text-muted transition-colors duration-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
        >
          关于
        </router-link>
      </div>
    </div>
  </footer>
</template>
