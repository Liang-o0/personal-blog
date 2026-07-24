### Task 4: 实现博客核心页面视图与文章渲染

**Files:**
- Create: `C:\Users\PWL\personal-blog\src/posts/2026-07-24-hello-world.md`
- Create: `C:\Users\PWL\personal-blog\src/posts/2026-07-24-vue3-guide.md`
- Create: `C:\Users\PWL\personal-blog\src/views/HomeView.vue`
- Create: `C:\Users\PWL\personal-blog\src/views/PostView.vue`
- Create: `C:\Users\PWL\personal-blog\src/views/AboutView.vue`

**Interfaces:**
- Consumes: Vue Router 和 Markdown 解析依赖
- Produces: 可供浏览的博客文章内容界面

- [ ] **Step 1: 创建几篇测试 Markdown 文章**
  包含 Front-matter 标题、时间、描述标签，用于首页加载展示。
  
  Content of `C:\Users\PWL\personal-blog\src/posts/2026-07-24-hello-world.md`:
  ```markdown
  ---
  title: Hello World! 我的博客开通了
  date: 2026-07-24
  tags: ["随笔", "生活"]
  description: 这是我使用 Vue 3 搭建的静态博客第一篇文章。
  ---

  # 欢迎来到我的博客！

  这是我人生中的第一篇博客文章。我使用了以下框架来搭建这个小站：
  - **Vite**：极致的静态打包速度
  - **Vue 3**：组件化的代码编写模式
  - **Tailwind CSS**：高度自由的响应式设计排版
  - **Cloudflare Pages**：全球 CDN 加速部署

  > 每一个开始，都是一次与未知未来的握手。

  下面是一段用于测试的代码高亮：
  ```javascript
  const welcome = "Hello, World!";
  console.log(welcome);
  ```

  希望以后能在这里分享更多有趣的代码和日常！
  ```

  Content of `C:\Users\PWL\personal-blog\src/posts/2026-07-24-vue3-guide.md`:
  ```markdown
  ---
  title: 极简 Vue 3 单文件组件快速入门
  date: 2026-07-23
  tags: ["技术", "Vue"]
  description: 介绍 Vue 3 Composition API `<script setup>` 的精妙与使用技巧。
  ---

  # 极简 Vue 3 快速上手

  Vue 3 引入的 `<script setup>` 是编写单文件组件（SFC）的最佳实践。

  ### 优势
  1. **语法更简洁**：不需要额外返回 `return` 变量。
  2. **更好的 TypeScript 支持**：原生类型推导更顺畅。
  3. **更高的运行时性能**：模板编译会进行静态分析和预加载优化。

  ### 基础状态声明
  ```vue
  <script setup>
  import { ref } from 'vue'

  const count = ref(0)
  const increment = () => count.value++
  </script>

  <template>
    <button @click="increment">点击数: {{ count }}</button>
  </template>
  ```

  这就是 Vue 3 Composition API 的独特魅力。
  ```

- [ ] **Step 2: 编写首页 (HomeView.vue)**
  利用 `import.meta.glob` 加载所有 `.md` 内容，提取元数据并按日期降序排列。
  Content of `C:\Users\PWL\personal-blog\src/views/HomeView.vue`:
  ```vue
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
  ```

- [ ] **Step 3: 编写文章详情页 (PostView.vue)**
  按路由中的 `:slug` 获取文件原始 Markdown 数据，经 `marked` 渲染后用 Tailwind Typography 美化展现。
  Content of `C:\Users\PWL\personal-blog\src/views/PostView.vue`:
  ```vue
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
  ```

- [ ] **Step 4: 编写关于我页面 (AboutView.vue)**
  Content of `C:\Users\PWL\personal-blog\src/views/AboutView.vue`:
  ```vue
  <template>
    <div class="py-4 max-w-2xl mx-auto">
      <h1 class="text-3xl font-extrabold tracking-tight mb-6">关于我</h1>
      
      <article class="prose prose-slate dark:prose-invert">
        <p>你好！我是 PWL，一名热爱前端开发与设计的技术探索者。</p>
        <p>这个博客是我写文章、整理笔记的个人空间。整个网站搭建在极速的 <strong>Vite + Vue 3</strong> 引擎上，样式依靠 <strong>Tailwind CSS</strong>，部署通过 GitHub Action 和 <strong>Cloudflare Pages</strong> 实现了每一次推送自动发布。</p>
        
        <h3>我关注的领域</h3>
        <ul>
          <li>前端技术 (React, Vue, Vite, Tailwind)</li>
          <li>全栈开发与自动化部署</li>
          <li>人机交互界面与现代视觉排版</li>
        </ul>

        <h3>如何找到我</h3>
        <p>你也可以在以下地方与我交流：</p>
        <ul>
          <li>GitHub: <a href="https://github.com" target="_blank">github.com</a></li>
          <li>Email: <a href="mailto:example@example.com">example@example.com</a></li>
        </ul>
      </article>
    </div>
  </template>

  <script setup>
  import { onMounted } from 'vue'
  onMounted(() => {
    document.title = '关于我 - MyBlog'
  })
  </script>
  ```

- [ ] **Step 5: 启动本地测试服务器进行全面体验验证**
  清理 Vite 初始自带的多余无用默认文件（比如 `src/components/HelloWorld.vue` 与 `src/style.css` ），然后编译打包测试。
  Run:
  * Windows Cmd/Powershell: `Remove-Item src/style.css, src/components/HelloWorld.vue -ErrorAction Ignore`
  * 打包构建验证: `npm run build`
  Expected: 打包编译顺利通过无错。

- [ ] **Step 6: 提交更改**
  Run:
  ```bash
  git add src/posts/ src/views/
  git commit -m "feat: complete blog views and markdown loading engine"
  ```
  Expected: 提交成功并标记本地开发结束。
