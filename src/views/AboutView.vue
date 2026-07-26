<template>
  <div class="mx-auto max-w-5xl space-y-8">
    <section class="glass-card overflow-hidden rounded-[1.75rem]">
      <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div class="space-y-5">
          <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">About</p>
          <h1 class="text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            把写作做得像产品一样认真
          </h1>
          <p class="max-w-2xl text-balance text-base leading-8 text-slate-600 dark:text-slate-300">
            这个博客用 Vue 3 和 Vite 构建，部署在 Cloudflare Pages 上，目标是让内容、排版和动效都保持克制但有质感。它既是写作空间，也是一个持续打磨界面的实验场。
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
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">我关注什么</h2>
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
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Principles</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">这个站点想表达什么</h2>
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

const badges = ['前端工程', '界面细节', '内容组织', '静态部署']

const focusAreas = [
  {
    title: '内容先行',
    description: '先把文章读起来舒服，再谈视觉包装。首页信息架构围绕精选、最新和主题索引展开。',
  },
  {
    title: '克制的动效',
    description: '只保留足够有质感的过渡和悬停反馈，不把注意力从内容本身抢走。',
  },
  {
    title: '稳定的发布链路',
    description: '继续沿用 Vite + Cloudflare Pages 的静态部署方式，保持维护成本低、发布速度快。',
  },
]

const principles = [
  {
    title: '简洁',
    description: '页面应该尽量少，但每个区块都要有明确用途。',
  },
  {
    title: '高级感',
    description: '通过留白、层次和光影，而不是堆叠复杂组件来建立质感。',
  },
  {
    title: '可持续',
    description: '这个模板要能长期写下去，而不是只在首次打开时好看。',
  },
  {
    title: '静态优先',
    description: '不引入额外运行时依赖，保证页面轻量、稳定、好部署。',
  },
]

onMounted(() => {
  document.title = '关于 · PWL Journal'
})
</script>
