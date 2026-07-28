<template>
  <div class="mx-auto max-w-4xl space-y-6 pb-20">
    <router-link
      to="/"
      class="inline-flex items-center gap-2 text-sm font-semibold text-muted transition-colors duration-300 hover:text-primary"
    >
      <iconify-icon icon="lucide:arrow-left" class="text-xs"></iconify-icon>
      返回首页
    </router-link>

    <div v-if="loading" class="glass-card rounded-[1.75rem] p-8 space-y-4">
      <div class="h-4 w-32 animate-pulse rounded bg-border"></div>
      <div class="h-10 w-4/5 animate-pulse rounded bg-border"></div>
      <div class="h-4 w-full animate-pulse rounded bg-border"></div>
    </div>

    <div v-else-if="errorMessage" class="glass-card rounded-[1.75rem] p-8 space-y-3">
      <p class="text-xs font-bold uppercase tracking-widest text-primary">404</p>
      <h1 class="text-3xl font-extrabold tracking-tight text-text"><TextAnimate text="文章未找到" /></h1>
      <p class="text-sm leading-relaxed text-muted">{{ errorMessage }}</p>
    </div>

    <article v-else-if="post" class="space-y-8">
      <header class="glass-card overflow-hidden rounded-[1.75rem]">
        <div class="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div class="space-y-5">
            <div class="flex flex-wrap items-center gap-3 text-xs text-muted">
              <span>{{ formattedDate }}</span>
              <span class="h-1 w-1 rounded-full bg-border"></span>
              <span>Markdown Article</span>
            </div>

            <h1 class="text-balance text-3xl font-extrabold tracking-tight text-text sm:text-4xl leading-[1.2]">
              <TextAnimate v-if="post?.title" :text="post.title" />
            </h1>

            <p v-if="post.description" class="text-balance text-sm leading-relaxed text-muted">
              {{ post.description }}
            </p>

            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="rounded-full border border-border bg-card/60 px-3.5 py-1 text-xs font-semibold text-text"
              >
                #{{ tag }}
              </span>
            </div>
          </div>

          <div class="overflow-hidden rounded-[1.5rem] bg-card/85 p-4 border border-border/40 relative">
            <img
              :src="heroImage"
              :alt="post.title"
              class="w-full rounded-[1.25rem] object-cover drop-shadow-[0_20px_40px_rgba(var(--primary),0.1)]"
            />
            <div class="mt-4 grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl border border-border/30 bg-bg/40 p-4">
                <p class="text-[10px] uppercase font-bold tracking-widest text-primary">Format</p>
                <p class="mt-1.5 text-xs leading-relaxed text-text">Markdown 渲染，兼容静态发布。</p>
              </div>
              <div class="rounded-2xl border border-border/30 bg-bg/40 p-4">
                <p class="text-[10px] uppercase font-bold tracking-widest text-secondary">Read</p>
                <p class="mt-1.5 text-xs leading-relaxed text-text">排版拉开层次，阅读更轻松。</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div class="glass-card rounded-[1.75rem] p-6 sm:p-8">
        <article
          class="prose max-w-none dark:prose-invert prose-headings:tracking-tight prose-headings:text-text prose-a:text-primary hover:prose-a:opacity-85 prose-strong:text-text prose-code:rounded-md prose-code:bg-card prose-code:border prose-code:border-border/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none dark:prose-pre:bg-card/40 dark:prose-pre:border dark:prose-pre:border-border/30"
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
import TextAnimate from '../components/ui/TextAnimate.vue'

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
  if (!post.value?.date) return ''
  const parsed = new Date(post.value.date)
  if (Number.isNaN(parsed.getTime())) return post.value.date
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(parsed).replace(/\//g, '.')
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
