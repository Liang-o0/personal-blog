<template>
  <div class="py-4">
    <header class="mb-12">
      <h1 class="text-4xl font-extrabold tracking-tight mb-3">Hi, 我是 PWL 👋</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400">欢迎来到我的个人博客空间，这里记录一些随笔、技术笔记和生活碎片。</p>
    </header>

    <section>
      <h2 class="text-xl font-bold tracking-tight mb-6 border-b pb-2 border-slate-200 dark:border-slate-800">最新文章</h2>
      <div class="space-y-8" v-if="posts.length">
        <article v-for="post in posts" :key="post.slug" class="group flex flex-col gap-2">
          <span class="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{{ post.date }}</span>
          <router-link :to="'/post/' + post.slug" class="text-2xl font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group-hover:translate-x-1 inline-block transform duration-200">
            {{ post.title }}
          </router-link>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{{ post.description }}</p>
          <div class="flex items-center gap-2 mt-1">
            <span v-for="tag in post.tags" :key="tag" class="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs">
              #{{ tag }}
            </span>
          </div>
        </article>
      </div>
      <div v-else class="text-slate-500 py-12 text-center">暂无文章</div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import fm from 'front-matter'

const posts = ref([])

onMounted(async () => {
  // 动态搜索 /src/posts 目录下所有的 Markdown 源文件
  const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' })
  const list = []

  for (const path in files) {
    const slug = path.split('/').pop().replace('.md', '')
    const content = await files[path]()
    const parsed = fm(content)
    list.push({
      slug,
      title: parsed.attributes.title || '无标题',
      date: parsed.attributes.date ? new Date(parsed.attributes.date).toISOString().split('T')[0] : '',
      tags: parsed.attributes.tags || [],
      description: parsed.attributes.description || '',
    })
  }

  // 按日期倒序排列
  posts.value = list.sort((a, b) => new Date(b.date) - new Date(a.date))
})
</script>
