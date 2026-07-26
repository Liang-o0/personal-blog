<template>
  <div class="space-y-12 lg:space-y-16">
    <section
      class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]"
      data-reveal
      style="--delay: 0ms"
    >
      <div class="space-y-6">
        <div class="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
          <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
          Cloudflare Pages / Vue 3 / Markdown
        </div>

        <div class="space-y-4">
          <h1 class="max-w-3xl text-balance text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            简洁、高级、克制的个人博客主页
          </h1>
          <p class="max-w-2xl text-balance text-base leading-8 text-slate-600 sm:text-lg dark:text-slate-300">
            把文章、精选内容、主题索引和作者介绍组织成一套更完整的信息架构，同时保留静态站点的轻快和可维护性。
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <InteractiveHoverButton
            href="#latest"
            text="浏览最新文章"
          />
          <InteractiveHoverButton
            to="/about"
            text="认识作者"
          />
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="stat in heroStats"
            :key="stat.label"
            class="glass-card rounded-2xl p-4 transition-transform duration-300 hover:-translate-y-1"
          >
            <p class="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {{ stat.value }}
            </p>
            <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {{ stat.label }}
            </p>
          </div>
        </div>
      </div>

      <div class="relative" data-reveal style="--delay: 120ms">
        <div class="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle,_rgba(34,211,238,0.22)_0%,_transparent_68%)] blur-3xl"></div>
        <div
          class="group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-slate-950 p-5 shadow-[0_35px_120px_-55px_rgba(15,23,42,0.9)] transition-transform duration-500 hover:-translate-y-1 dark:border-white/10 dark:bg-slate-900"
        >
          <div class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%,rgba(168,85,247,0.16))] opacity-80 transition-opacity duration-500 group-hover:opacity-100"></div>
          <div class="relative space-y-5">
            <div class="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
              <span>Visual Archive</span>
              <span>{{ compactToday }}</span>
            </div>

            <div class="grid gap-5">
              <div class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 p-3">
                <img
                  :src="heroImage"
                  alt="博客主页装置插画"
                  class="mx-auto w-full max-w-sm drop-shadow-[0_32px_48px_rgba(168,85,247,0.35)] transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-xs uppercase tracking-[0.3em] text-cyan-300/70">Focus</p>
                  <p class="mt-2 text-sm leading-7 text-slate-200">
                    页面强调排版、留白和轻量动效，适合长期维护的个人写作站。
                  </p>
                </div>
                <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p class="text-xs uppercase tracking-[0.3em] text-violet-300/70">Stack</p>
                  <p class="mt-2 text-sm leading-7 text-slate-200">
                    Vue 3 + Vite + Tailwind CSS，保持静态站点的速度与部署简洁。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]" data-reveal style="--delay: 80ms">
      <div class="space-y-4">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">Featured</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">精选文章</h2>
          </div>
          <span class="text-sm text-slate-500 dark:text-slate-400">
            {{ filteredPosts.length }} 篇可见
          </span>
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="topic in topicOptions"
            :key="topic.name"
            type="button"
            class="rounded-full border px-3.5 py-2 text-sm transition-all duration-300"
            :class="topic.name === activeTopic
              ? 'border-cyan-300 bg-cyan-50 text-cyan-700 shadow-sm dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-300'
              : 'border-slate-200/70 bg-white/70 text-slate-600 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-cyan-300'"
            @click="activeTopic = topic.name"
          >
            #{{ topic.name }}
            <span class="ml-1 text-xs opacity-70">({{ topic.count }})</span>
          </button>
          <button
            v-if="activeTopic !== '全部'"
            type="button"
            class="rounded-full border border-slate-200/70 bg-white/70 px-3.5 py-2 text-sm text-slate-500 transition-colors duration-300 hover:border-slate-300 hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400 dark:hover:text-white"
            @click="activeTopic = '全部'"
          >
            清除筛选
          </button>
        </div>

        <article v-if="loading" class="glass-card rounded-[1.75rem] p-6">
          <div class="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
            <div class="h-56 animate-pulse rounded-[1.5rem] bg-slate-200/70 dark:bg-slate-800/70"></div>
            <div class="space-y-4 py-2">
              <div class="h-4 w-32 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
              <div class="h-10 w-4/5 animate-pulse rounded-2xl bg-slate-200/70 dark:bg-slate-800/70"></div>
              <div class="space-y-3">
                <div class="h-4 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
                <div class="h-4 w-11/12 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
                <div class="h-4 w-4/5 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
              </div>
            </div>
          </div>
        </article>

        <article
          v-else-if="featuredPost"
          class="group glass-card overflow-hidden rounded-[1.75rem] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-35px_rgba(14,165,233,0.35)]"
        >
          <div class="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
            <div class="overflow-hidden rounded-[1.5rem] bg-slate-950">
              <img
                :src="heroImage"
                :alt="featuredPost.title"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
            </div>

            <div class="flex flex-col justify-between gap-5 p-2 md:p-3">
              <div class="space-y-4">
                <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-400">
                  <span>Featured</span>
                  <span class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                  <span>{{ selectedTopicLabel }}</span>
                </div>
                <p class="text-sm font-medium text-cyan-600 dark:text-cyan-400">
                  {{ formatCompactDate(featuredPost.date) }}
                </p>
                <router-link
                  :to="'/post/' + featuredPost.slug"
                  class="block text-balance text-2xl font-semibold tracking-tight text-slate-950 transition-colors duration-300 hover:text-cyan-600 dark:text-white dark:hover:text-cyan-300 sm:text-3xl"
                >
                  {{ featuredPost.title }}
                </router-link>
                <p class="max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {{ featuredPost.description }}
                </p>
              </div>

              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in featuredPost.tags"
                  :key="tag"
                  class="rounded-full border border-slate-200/70 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300"
                >
                  #{{ tag }}
                </span>
              </div>
            </div>
          </div>
        </article>

        <div v-else class="glass-card rounded-[1.75rem] p-6 text-sm text-slate-500 dark:text-slate-400">
          暂时没有符合当前筛选条件的文章。
        </div>
      </div>

      <aside class="space-y-4" id="latest">
        <div class="flex items-end justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">Latest</p>
            <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">最新动态</h2>
          </div>
          <span class="text-sm text-slate-500 dark:text-slate-400">{{ recentPosts.length }} 篇</span>
        </div>

        <div class="space-y-3">
          <div v-if="loading" class="glass-card rounded-[1.5rem] p-4">
            <div class="space-y-4">
              <div class="h-4 w-28 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
              <div class="h-6 w-3/4 animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
              <div class="h-4 w-full animate-pulse rounded-full bg-slate-200/70 dark:bg-slate-800/70"></div>
            </div>
          </div>

          <template v-else-if="recentPosts.length">
            <router-link
              v-for="(post, index) in recentPosts"
              :key="post.slug"
              :to="'/post/' + post.slug"
              class="group scroll-reveal glass-card block rounded-[1.5rem] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:shadow-[0_25px_50px_-28px_rgba(14,165,233,0.4)]"
              :style="{ '--delay': `${index * 90}ms` }"
              data-reveal
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-4">
                  <p class="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {{ formatCompactDate(post.date) }}
                  </p>
                  <span class="rounded-full border border-slate-200/70 bg-white/60 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-400">
                    Read
                  </span>
                </div>

                <h3 class="text-lg font-semibold tracking-tight text-slate-950 transition-colors duration-300 group-hover:text-cyan-600 dark:text-white dark:group-hover:text-cyan-300">
                  {{ post.title }}
                </h3>
                <p class="line-clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {{ post.description }}
                </p>

                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="tag in post.tags.slice(0, 3)"
                    :key="tag"
                    class="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:bg-white/5 dark:text-slate-400"
                  >
                    #{{ tag }}
                  </span>
                </div>
              </div>
            </router-link>
          </template>

          <div v-else class="glass-card rounded-[1.5rem] p-5 text-sm text-slate-500 dark:text-slate-400">
            当前筛选没有匹配的文章。切回“全部”可以查看完整列表。
          </div>
        </div>
      </aside>
    </section>

    <section class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]" data-reveal style="--delay: 120ms">
      <div class="glass-card rounded-[1.75rem] p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-600 dark:text-cyan-400">Topics</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">主题标签</h2>
        <p class="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
          点击标签可以筛选文章。这个交互会同步更新精选文章和最新列表。
        </p>
        <div class="mt-5 flex flex-wrap gap-3">
          <span
            v-for="topic in topicOptions.slice(1)"
            :key="topic.name"
            class="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm text-slate-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/60 hover:text-cyan-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-cyan-300"
          >
            <span>#{{ topic.name }}</span>
            <span class="text-xs text-slate-400">({{ topic.count }})</span>
          </span>
        </div>
      </div>

      <div class="glass-card rounded-[1.75rem] p-6">
        <p class="text-xs font-semibold uppercase tracking-[0.35em] text-violet-600 dark:text-violet-400">About</p>
        <h2 class="mt-2 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">关于这座博客</h2>
        <p class="mt-4 max-w-2xl text-balance text-sm leading-8 text-slate-600 dark:text-slate-300">
          这是一个专注于内容和质感的个人博客模板。它保留了静态站点的轻快，补上更完整的信息架构，让文章、标签和作者介绍在同一屏里都能找到合适的位置。
        </p>

        <div class="mt-5 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4 transition-transform duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Speed</p>
            <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">静态加载，响应迅速</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4 transition-transform duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Motion</p>
            <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">滚动进入，节奏更明确</p>
          </div>
          <div class="rounded-2xl border border-slate-200/70 bg-white/70 p-4 transition-transform duration-300 hover:-translate-y-1 dark:border-slate-700 dark:bg-slate-900/70">
            <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Stack</p>
            <p class="mt-2 text-sm font-medium text-slate-900 dark:text-white">Vue 3 + Vite + Tailwind</p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap gap-3">
          <InteractiveHoverButton
            to="/about"
            text="查看完整介绍"
          />
          <InteractiveHoverButton
            to="/"
            text="返回首页顶部"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import fm from 'front-matter'
import heroImage from '../assets/hero.png'
import InteractiveHoverButton from '../components/ui/InteractiveHoverButton.vue'

const posts = ref([])
const loading = ref(true)
const activeTopic = ref('全部')

const compactDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const formatCompactDate = (value) => {
  if (!value) {
    return '--'
  }

  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return compactDateFormatter.format(parsed).replace(/\//g, '.')
}

const loadPosts = async () => {
  loading.value = true

  const files = import.meta.glob('/src/posts/*.md', { query: '?raw', import: 'default' })
  const list = await Promise.all(
    Object.entries(files).map(async ([path, load]) => {
      const slug = path.split('/').pop().replace('.md', '')
      const content = await load()
      const parsed = fm(content)
      const tags = Array.isArray(parsed.attributes.tags) ? parsed.attributes.tags : []

      return {
        slug,
        title: parsed.attributes.title || '未命名文章',
        date: parsed.attributes.date ? new Date(parsed.attributes.date).toISOString().split('T')[0] : '',
        tags,
        description: parsed.attributes.description || '',
      }
    }),
  )

  posts.value = list.sort((a, b) => new Date(b.date) - new Date(a.date))
  loading.value = false
}

const topicCounts = computed(() => {
  const counts = new Map()

  posts.value.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    })
  })

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const topicOptions = computed(() => [
  { name: '全部', count: posts.value.length },
  ...topicCounts.value,
])

const filteredPosts = computed(() => {
  if (activeTopic.value === '全部') {
    return posts.value
  }

  return posts.value.filter((post) => post.tags.includes(activeTopic.value))
})

const featuredPost = computed(() => filteredPosts.value[0] ?? posts.value[0] ?? null)
const recentPosts = computed(() => {
  const source = filteredPosts.value
  return source.slice(featuredPost.value ? 1 : 0, 5)
})

const heroStats = computed(() => [
  {
    value: String(posts.value.length).padStart(2, '0'),
    label: '篇文章',
  },
  {
    value: String(topicCounts.value.length).padStart(2, '0'),
    label: '个主题',
  },
  {
    value: featuredPost.value ? formatCompactDate(featuredPost.value.date) : '--',
    label: '最近更新',
  },
])

const selectedTopicLabel = computed(() => (activeTopic.value === '全部' ? '全站内容' : `#${activeTopic.value}`))
const compactToday = computed(() => formatCompactDate(new Date()))

const observer = ref(null)
const observedElements = new WeakSet()

const registerRevealTargets = async () => {
  await nextTick()

  if (!observer.value) {
    return
  }

  document.querySelectorAll('[data-reveal]').forEach((element) => {
    if (observedElements.has(element)) {
      return
    }

    observedElements.add(element)
    observer.value.observe(element)
  })
}

const setupRevealObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return
        }

        entry.target.classList.add('is-visible')
        observer.value?.unobserve(entry.target)
      })
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -8% 0px',
    },
  )
}

watch(posts, () => {
  registerRevealTargets().catch((error) => {
    console.error(error)
  })
})

watch(activeTopic, () => {
  registerRevealTargets().catch((error) => {
    console.error(error)
  })
})

onMounted(() => {
  document.title = 'PWL Journal · 简洁高级的个人博客'
  setupRevealObserver()

  loadPosts()
    .then(() => registerRevealTargets())
    .catch((error) => {
      console.error(error)
      loading.value = false
    })
})

onBeforeUnmount(() => {
  observer.value?.disconnect()
})
</script>
