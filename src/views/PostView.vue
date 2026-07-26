<template>
  <div class="mx-auto max-w-4xl space-y-6">
    <router-link
      to="/"
      class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
    >
      <span aria-hidden="true">←</span>
      返回首页
    </router-link>

    <div v-if="loading" class="glass-card rounded-[1.75rem] p-8">
      <div class="space-y-5">
        <div class="h-4 w-32 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
        <div class="h-12 w-4/5 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70"></div>
        <div class="h-4 w-11/12 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
        <div class="h-4 w-3/4 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
      </div>
    </div>

    <div v-else-if="errorMessage" class="glass-card rounded-[1.75rem] p-8">
      <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">404</p>
      <h1 class="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">文章未找到</h1>
      <p class="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300">{{ errorMessage }}</p>
    </div>

    <article v-else-if="post" class="space-y-8">
      <header class="glass-card overflow-hidden rounded-[1.75rem]">
        <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div class="space-y-5">
            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <span>{{ formattedDate }}</span>
              <span class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
              <span>Markdown Article</span>
            </div>

            <h1 class="text-balance text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {{ post.title }}
            </h1>

            <p v-if="post.description" class="max-w-2xl text-balance text-base leading-8 text-slate-600 dark:text-slate-300">
              {{ post.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="overflow-hidden rounded-[1.5rem] border border-slate-200/70 bg-slate-950 p-4 dark:border-white/10 dark:bg-slate-900">
            <img
              :src="heroImage"
              :alt="post.title"
              class="w-full rounded-[1.25rem] object-cover drop-shadow-[0_20px_40px_rgba(168,85,247,0.2)]"
            />
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Format</p>
                <p class="mt-2 text-sm leading-7 text-slate-200">Markdown 渲染，兼容静态发布。</p>
              </div>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p class="text-xs uppercase tracking-[0.3em] text-violet-300/70">Read</p>
                <p class="mt-2 text-sm leading-7 text-slate-200">排版拉开层次，阅读更轻松。</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="glass-card rounded-[1.75rem] p-6 sm:p-8">
        <article
          class="prose prose-slate max-w-none dark:prose-invert prose-headings:tracking-tight prose-headings:text-slate-950 dark:prose-headings:text-white prose-a:text-cyan-600 dark:prose-a:text-cyan-400 prose-strong:text-slate-900 dark:prose-strong:text-white prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal dark:prose-code:bg-white/10"
          v-html="renderedContent"
        ></article>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import fm from 'front-matter'
import { marked } from 'marked'
import heroImage from '../assets/hero.png'

const route = useRoute()
const post = ref(null)
const loading = ref(true)
const errorMessage = ref('')

marked.setOptions({
  breaks: true,
  gfm: true,
})

const renderedContent = computed(() => {
  return post.value ? marked.parse(post.value.body) : ''
})

const formattedDate = computed(() => {
  if (!post.value?.date) {
    return ''
  }

  const parsed = new Date(post.value.date)
  if (Number.isNaN(parsed.getTime())) {
    return post.value.date
  }

  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(parsed)
    .replace(/\//g, '.')
})

const loadPost = async () => {
  loading.value = true
  errorMessage.value = ''

  const slug = route.params.slug

  try {
    const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' })
    const path = `/src/posts/${slug}.md`
    const loader = files[path]

    if (!loader) {
      post.value = null
      errorMessage.value = '你访问的文章不存在，或者链接已经失效。'
      return
    }

    const rawContent = await loader()
    const parsed = fm(rawContent)

    post.value = {
      title: parsed.attributes.title || '未命名文章',
      date: parsed.attributes.date ? new Date(parsed.attributes.date).toISOString().split('T')[0] : '',
      tags: Array.isArray(parsed.attributes.tags) ? parsed.attributes.tags : [],
      description: parsed.attributes.description || '',
      body: parsed.body || '',
    }

    document.title = `${post.value.title} · PWL Journal`
  } catch (error) {
    console.error(error)
    post.value = null
    errorMessage.value = '加载文章时发生错误，请稍后重试。'
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  () => {
    loadPost()
  },
  { immediate: true },
)
</script>
