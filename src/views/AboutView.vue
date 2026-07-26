<template>
  <div class="mx-auto max-w-5xl space-y-8">
    <section class="glass-card overflow-hidden rounded-[1.75rem]">
      <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-5">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">About</p>
          <h1 class="text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            If you would to get in touch with me,my contact details are at the end.Feel free to out to me with any qusetion——I'm always online.
          </h1>
          <p class="max-w-2xl text-balance text-base leading-8 text-slate-600 dark:text-slate-300">
            This blog is built with Vue 3 and Vite, deployed on Cloudflare Pages. It is both a writing space and an experiment in continuously improving the interface.
          </p>

          <div class="flex flex-wrap gap-3">
            <span
              v-for="item in badges"
              :key="item"
              class="rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
            >
              {{ item }}
            </span>
          </div>
        </div>

        <div class="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-slate-950 p-4 dark:border-white/10 dark:bg-slate-900">
          <img
            :src="heroImage"
            alt="博客装置插画"
            class="w-full rounded-[1.25rem] object-cover drop-shadow-[0_20px_40px_rgba(168,85,247,0.2)]"
          />

          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Stack</p>
              <p class="mt-2 text-sm leading-7 text-slate-200">Vue 3 / Vue Router / Tailwind CSS</p>
            </div>
            <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p class="text-xs uppercase tracking-[0.3em] text-violet-300/70">Deploy</p>
              <p class="mt-2 text-sm leading-7 text-slate-200">Cloudflare Pages 静态部署</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <div class="glass-card rounded-[1.75rem] p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">Focus</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">What I Focus On</h2>
        <div class="mt-5 space-y-3">
          <div
            v-for="item in focusAreas"
            :key="item.title"
            class="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
          >
            <p class="text-sm font-medium text-slate-950 dark:text-white">{{ item.title }}</p>
            <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <div class="glass-card rounded-[1.75rem] p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">如何联系我呢</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">联系方式[狗头]</h2>
        <div class="mt-5 grid gap-3 sm:grid-cols-2">
          <div
            v-for="item in principles"
            :key="item.title"
            class="rounded-2xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70"
          >
            <p class="text-sm font-medium text-slate-950 dark:text-white">{{ item.title }}</p>
            <p class="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{{ item.description }}</p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <InteractiveHoverButton
            to="/"
            text="回到首页"
          />
          <InteractiveHoverButton
            to="/"
            text="看最新文章"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import heroImage from '../assets/hero.png'
import InteractiveHoverButton from '../components/ui/InteractiveHoverButton.vue'

const badges = ['Brave', 'Confident', 'Positive', 'Kindness']

const focusAreas = [
  {
    title: 'Firstly',
    description: 'Readability should be the top priority, followed by visual aesthetics. Minimalism and efficiency.',
  },
  {
    title: 'Second',
    description: 'How to maintain an optimistic mindset',
  },
 
]

const principles = [
  {
    title: 'Google Email',
    description: 'wenlianpu63@gmail.com',
  },
  {
    title: 'QQ Email',
    description: '1804125721@qq.com',
  },
]

onMounted(() => {
  document.title = '关于 · PWL Journal'
})
</script>
