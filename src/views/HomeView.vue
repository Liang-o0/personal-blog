<template>
  <div class="space-y-20 pb-20">
    <!-- Hero / Greeting Section (Asymmetric Bento-style layout) -->
    <section 
      class="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-stretch"
      data-reveal
      style="--delay: 100ms"
    >
      <!-- Greeting Card -->
      <div class="glass-card rounded-[2rem] p-8 md:p-10 flex flex-col justify-between space-y-8 relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div class="space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
            </span>
            PWL Journal · Built with Vue 3
          </div>

          <h1 class="text-balance text-4xl font-extrabold tracking-tight text-text sm:text-5xl lg:text-6xl leading-[1.1]">
            <TextAnimate text="欢迎来到我的" />
            <br />
            <TextAnimate text="精神角落 ✨" class="text-gradient" />
          </h1>
          <p class="max-w-xl text-balance text-base leading-relaxed text-muted">
            你好，我是梁。这里是我的个人博客，记录生活、灵感、代码和日常的奇思妙想。
            希望你在这里能找到共鸣，哪怕只是一瞬间的启发。
          </p>
        </div>

        <div class="flex flex-wrap gap-4">
          <SlideButton
            text1="了解关于我"
            text2="LET'S GO ➔"
            to="/about"
          />
          <SlideButton
            text1="阅读最新文章"
            text2="GO READ ➔"
            href="#articles"
            class="bg-gradient-to-r from-secondary/80 to-accent/80"
          />
        </div>
      </div>

      <!-- Quick Info Card -->
      <div class="glass-card rounded-[2rem] p-8 flex flex-col justify-between relative overflow-hidden">
        <div class="absolute -left-16 -bottom-16 w-48 h-48 bg-secondary/10 rounded-full blur-3xl"></div>
        
        <div class="space-y-6 relative z-10">
          <div class="flex items-center justify-between text-xs uppercase tracking-widest text-muted">
            <span>Visual Archive</span>
            <span>{{ compactToday }}</span>
          </div>

          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <iconify-icon icon="lucide:sparkles" class="text-xl"></iconify-icon>
              </div>
              <div>
                <p class="text-xs text-muted">目前致力于</p>
                <p class="text-sm font-semibold text-text">探索前端美学 & AI 智能</p>
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <div class="grid h-10 w-10 place-items-center rounded-xl bg-secondary/10 text-secondary">
                <iconify-icon icon="lucide:cpu" class="text-xl"></iconify-icon>
              </div>
              <div>
                <p class="text-xs text-muted">技术栈</p>
                <p class="text-sm font-semibold text-text">Vue 3 / Vite / Tailwind</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-border/40 relative z-10">
          <div>
            <p class="text-2xl font-extrabold tracking-tight text-text">{{ posts.length }}</p>
            <p class="text-xs text-muted">已发布文章</p>
          </div>
          <div>
            <p class="text-2xl font-extrabold tracking-tight text-text">{{ topicCounts.length }}</p>
            <p class="text-xs text-muted">个分类主题</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Hobbies Section (爱好) -->
    <section 
      class="space-y-6"
      data-reveal
      style="--delay: 150ms"
    >
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-primary"><TextAnimate text="My Passions" /></p>
        <h2 class="mt-1 text-3xl font-bold tracking-tight text-text"><TextAnimate text="爱好与生活" :delay="45" /></h2>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          v-for="hobby in hobbies" 
          :key="hobby.title"
          class="glass-card rounded-2xl p-6 transition-all duration-500 ease-custom hover:-translate-y-2 border border-border/40 hover:border-primary/30 group"
        >
          <div class="h-12 w-12 rounded-2xl bg-card border border-border/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 ease-custom">
            <iconify-icon :icon="hobby.icon" class="text-2xl"></iconify-icon>
          </div>
          <h3 class="mt-4 text-lg font-bold text-text">{{ hobby.title }}</h3>
          <p class="mt-2 text-sm text-muted leading-relaxed">{{ hobby.description }}</p>
        </div>
      </div>
    </section>

    <!-- Photo Gallery (我喜欢的照片) -->
    <section 
      class="space-y-6"
      data-reveal
      style="--delay: 200ms"
    >
      <div>
        <p class="text-xs font-bold uppercase tracking-widest text-accent"><TextAnimate text="Visual Moments" /></p>
        <h2 class="mt-1 text-3xl font-bold tracking-tight text-text"><TextAnimate text="我喜欢的瞬间" :delay="45" /></h2>
      </div>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div 
          v-for="(photo, index) in favoritePhotos" 
          :key="index"
          class="glass-card rounded-[1.5rem] p-3 group overflow-hidden border border-border/30 hover:border-accent/30 transition-all duration-500 ease-custom"
        >
          <div class="overflow-hidden rounded-[1rem] aspect-[4/3] bg-bg relative">
            <img 
              :src="photo.url" 
              :alt="photo.caption" 
              class="w-full h-full object-cover transition-transform duration-700 ease-custom group-hover:scale-[1.06] group-hover:rotate-1"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-custom flex items-end p-4">
              <span class="text-xs font-semibold text-white tracking-wide">{{ photo.caption }}</span>
            </div>
          </div>
          <div class="mt-3 px-2 pb-1 flex items-center justify-between">
            <span class="text-sm font-semibold text-text">{{ photo.title }}</span>
            <span class="text-[10px] uppercase font-bold tracking-wider text-accent">{{ photo.date }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Section (个人的文章) -->
    <section 
      id="articles"
      class="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]"
      data-reveal
      style="--delay: 250ms"
    >
      <!-- Articles list -->
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-primary"><TextAnimate text="Articles" /></p>
            <h2 class="mt-1 text-3xl font-bold tracking-tight text-text"><TextAnimate text="精选文章" :delay="45" /></h2>
          </div>
          <span class="text-xs font-semibold text-muted bg-card px-3 py-1.5 rounded-full border border-border/50">
            {{ filteredPosts.length }} 篇文章
          </span>
        </div>

        <!-- Filter Tags -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="topic in topicOptions"
            :key="topic.name"
            type="button"
            class="rounded-full border px-4 py-2 text-sm transition-all duration-500 ease-custom"
            :class="topic.name === activeTopic
              ? 'border-primary/50 bg-primary/10 text-primary shadow-sm font-medium'
              : 'border-border/40 bg-card/50 text-muted hover:-translate-y-0.5 hover:border-primary/30 hover:text-primary'"
            @click="activeTopic = topic.name"
          >
            #{{ topic.name }}
            <span class="ml-1 text-xs opacity-70">({{ topic.count }})</span>
          </button>
        </div>

        <!-- Dynamic Articles loading -->
        <div class="space-y-4">
          <div v-if="loading" class="glass-card rounded-3xl p-8 space-y-4">
            <div class="h-4 w-1/4 animate-pulse rounded bg-border"></div>
            <div class="h-8 w-3/4 animate-pulse rounded bg-border"></div>
            <div class="h-4 w-full animate-pulse rounded bg-border"></div>
          </div>

          <template v-else-if="filteredPosts.length">
            <div 
              v-for="post in filteredPosts" 
              :key="post.slug"
              class="glass-card rounded-[1.75rem] p-6 hover:shadow-xl transition-all duration-500 ease-custom group border border-border/40 hover:border-primary/20 flex flex-col justify-between"
            >
              <div class="space-y-3">
                <div class="flex items-center justify-between text-xs text-muted">
                  <span>{{ formatCompactDate(post.date) }}</span>
                  <div class="flex gap-1.5">
                    <span 
                      v-for="tag in post.tags" 
                      :key="tag"
                      class="bg-primary/5 text-primary px-2.5 py-0.5 rounded-full text-[10px] font-semibold border border-primary/10"
                    >
                      #{{ tag }}
                    </span>
                  </div>
                </div>

                <router-link 
                  :to="'/post/' + post.slug"
                  class="block text-2xl font-bold tracking-tight text-text hover:text-primary transition-colors duration-300"
                >
                  {{ post.title }}
                </router-link>
                
                <p class="text-sm text-muted leading-relaxed line-clamp-2">
                  {{ post.description }}
                </p>
              </div>

              <div class="mt-6 flex items-center justify-between pt-4 border-t border-border/30">
                <router-link 
                  :to="'/post/' + post.slug"
                  class="inline-flex items-center gap-1.5 text-sm font-bold text-primary group-hover:gap-2.5 transition-all duration-300 ease-custom"
                >
                  阅读全文
                  <iconify-icon icon="lucide:arrow-right" class="text-xs"></iconify-icon>
                </router-link>
              </div>
            </div>
          </template>

          <div v-else class="glass-card rounded-3xl p-8 text-center text-muted text-sm">
            该分类下暂无文章。
          </div>
        </div>
      </div>

      <!-- Works / Projects Section (个人的作品) -->
      <div class="space-y-6">
        <div>
          <p class="text-xs font-bold uppercase tracking-widest text-secondary"><TextAnimate text="Works" /></p>
          <h2 class="mt-1 text-3xl font-bold tracking-tight text-text"><TextAnimate text="个人作品" :delay="45" /></h2>
        </div>

        <div class="space-y-4">
          <div 
            v-for="project in personalWorks" 
            :key="project.title"
            class="glass-card rounded-[1.75rem] p-6 hover:shadow-xl transition-all duration-500 ease-custom border border-border/40 hover:border-secondary/20 flex flex-col justify-between relative overflow-hidden group"
          >
            <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors duration-500"></div>
            
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform duration-500 ease-custom">
                  <iconify-icon :icon="project.icon" class="text-xl"></iconify-icon>
                </div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-secondary">{{ project.status }}</span>
              </div>
              
              <h3 class="text-xl font-bold text-text">{{ project.title }}</h3>
              <p class="text-xs text-muted leading-relaxed">{{ project.description }}</p>
            </div>

            <div class="mt-5 flex items-center justify-between">
              <div class="flex gap-1.5">
                <span 
                  v-for="tech in project.technologies" 
                  :key="tech"
                  class="bg-secondary/5 text-secondary px-2.5 py-0.5 rounded-full text-[9px] font-semibold border border-secondary/10"
                >
                  {{ tech }}
                </span>
              </div>
              <a 
                :href="project.link" 
                target="_blank"
                class="text-xs font-bold text-secondary flex items-center gap-1 hover:gap-1.5 transition-all duration-300"
              >
                访问
                <iconify-icon icon="lucide:external-link" class="text-[10px]"></iconify-icon>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import fm from 'front-matter'
import SlideButton from '../components/ui/SlideButton.vue'
import TextAnimate from '../components/ui/TextAnimate.vue'

const posts = ref([])
const loading = ref(true)
const activeTopic = ref('全部')

// Hobbies definitions using Iconify icons
const hobbies = [
  {
    title: '弹钢琴 🎹',
    icon: 'lucide:music',
    description: '指尖在黑白键上跳跃，让旋律流淌进清晨与黄昏的静谧里。'
  },
  {
    title: '打羽毛球 🏸',
    icon: 'lucide:activity',
    description: '在球场上快速奔跑、挥拍、跳杀，用汗水换来身体的轻盈。'
  },
  {
    title: '音乐歌唱 🎤',
    icon: 'lucide:mic',
    description: '唱歌是我的秘密树洞，不管是摇滚还是抒情，都是情绪的宣泄。'
  },
  {
    title: '放空冥想 🧠',
    icon: 'lucide:brain',
    description: '给大脑放个短假，在天马行空的白日梦中搜集闪光的灵感。'
  }
]

// Personal photos definitions (using Picsum Photos high quality random ids)
const favoritePhotos = [
  {
    title: '海边落日',
    caption: '落日沉入大海，泛起橘粉色的波光',
    url: 'https://picsum.photos/id/10/800/600',
    date: 'SUMMER',
  },
  {
    title: '林间木屋',
    caption: '晨光穿透林间树梢，照亮安静的小屋',
    url: 'https://picsum.photos/id/15/800/600',
    date: 'AUTUMN',
  },
  {
    title: '角落咖啡馆',
    caption: '午后的一杯拿铁，配上翻开的书页',
    url: 'https://picsum.photos/id/30/800/600',
    date: 'WINTER',
  },
  {
    title: '山野夜空',
    caption: '无垠的银河繁星，在大地之上闪烁',
    url: 'https://picsum.photos/id/42/800/600',
    date: 'SPRING',
  }
]

// Personal works/projects definitions using Iconify icons
const personalWorks = [
  {
    title: 'PWL Space',
    icon: 'lucide:layout-template',
    description: '一个完全基于玻璃拟态 (Glassmorphism) 风格设计的个人灵感面板，探索极简与华丽视觉的交界。',
    status: 'ACTIVE',
    technologies: ['Vue 3', 'Tailwind', 'Anime.js'],
    link: '#'
  },
  {
    title: 'Vibe Ambient',
    icon: 'lucide:radio',
    description: '专为工作和冥想设计的轻量网页端白噪音播放器，支持混音与动态渐变微光背景。',
    status: 'COMPLETED',
    technologies: ['HTML5 Audio', 'Vue 3'],
    link: '#'
  },
  {
    title: 'Mind Node',
    icon: 'lucide:git-fork',
    description: '一个极简的本地脑图草稿板，用最少的操作快速沉淀思维链路，支持导出与云存储。',
    status: 'DESIGN',
    technologies: ['SVG', 'TypeScript'],
    link: '#'
  }
]

const compactDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

const formatCompactDate = (value) => {
  if (!value) return '--'
  const parsed = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return compactDateFormatter.format(parsed).replace(/\//g, '.')
}

const loadPosts = async () => {
  loading.value = true
  try {
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
      })
    )
    posts.value = list.sort((a, b) => new Date(b.date) - new Date(a.date))
  } catch (err) {
    console.error('Failed to load posts', err)
  } finally {
    loading.value = false
  }
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

const compactToday = computed(() => formatCompactDate(new Date()))

// Reveal Observer setup
const observer = ref(null)
const observedElements = new WeakSet()

const registerRevealTargets = async () => {
  await nextTick()
  if (!observer.value) return
  document.querySelectorAll('[data-reveal]').forEach((element) => {
    if (observedElements.has(element)) return
    observedElements.add(element)
    observer.value.observe(element)
  })
}

const setupRevealObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.value?.unobserve(entry.target)
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px',
    }
  )
}

watch(posts, () => {
  registerRevealTargets()
})

watch(activeTopic, () => {
  registerRevealTargets()
})

onMounted(() => {
  document.title = 'PWL Journal '
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

<style scoped>
.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)));
}
</style>
