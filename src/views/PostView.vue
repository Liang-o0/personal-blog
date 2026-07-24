<template>
  <div class="py-4 max-w-2xl mx-auto" v-if="post">
    <router-link to="/" class="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 transition-colors">
      ← 返回首页
    </router-link>

    <header class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight mb-3">{{ post.title }}</h1>
      <div class="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>{{ post.date }}</span>
        <span v-for="tag in post.tags" :key="tag" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded">
          #{{ tag }}
        </span>
      </div>
    </header>

    <!-- 文章渲染正文 -->
    <article class="prose prose-slate dark:prose-invert max-w-none" v-html="renderedContent"></article>
  </div>
  <div v-else class="text-center py-24 text-slate-500">
    <p>文章加载中...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import fm from 'front-matter'
import { marked } from 'marked'

const route = useRoute()
const post = ref(null)

const renderedContent = computed(() => {
  return post.value ? marked(post.value.body) : ''
})

onMounted(async () => {
  const slug = route.params.slug
  try {
    // 动态检索对应 slug 的 markdown 文件
    const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' })
    const path = `/src/posts/${slug}.md`
    
    if (files[path]) {
      const rawContent = await files[path]()
      const parsed = fm(rawContent)
      post.value = {
        title: parsed.attributes.title,
        date: parsed.attributes.date ? new Date(parsed.attributes.date).toISOString().split('T')[0] : '',
        tags: parsed.attributes.tags || [],
        body: parsed.body
      }
      document.title = `${post.value.title} - MyBlog`
    } else {
      post.value = { title: '404 - 文章未找到', body: '# 很抱歉，文章未找到\n\n您访问的内容不存在。' }
    }
  } catch (e) {
    console.error(e)
    post.value = { title: '加载失败', body: '# 载入文章出错\n\n读取文件时遇到未知错误。' }
  }
})
</script>
