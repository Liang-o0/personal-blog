### Task 3: 架构路由系统与基础公共组件

**Files:**
- Create: `C:\Users\PWL\personal-blog\src/router/index.js`
- Create: `C:\Users\PWL\personal-blog\src/components/Navbar.vue`
- Create: `C:\Users\PWL\personal-blog\src/components/Footer.vue`
- Modify: `C:\Users\PWL\personal-blog\src/App.vue`
- Modify: `C:\Users\PWL\personal-blog\src/main.js`

**Interfaces:**
- Consumes: Tailwind CSS 配置与基本 Vue 项目环境
- Produces: 路由导航及全局暗黑模式控制状态

- [ ] **Step 1: 编写路由配置**
  创建博客的 3 个主要路由页面（首页列表、详情页、关于页）。
  Content of `C:\Users\PWL\personal-blog\src/router/index.js`:
  ```javascript
  import { createRouter, createWebHistory } from 'vue-router'
  import HomeView from '../views/HomeView.vue'
  import PostView from '../views/PostView.vue'
  import AboutView from '../views/AboutView.vue'

  const routes = [
    { path: '/', name: 'Home', component: HomeView },
    { path: '/post/:slug', name: 'Post', component: PostView },
    { path: '/about', name: 'About', component: AboutView }
  ]

  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  export default router
  ```

- [ ] **Step 2: 创建 Navbar.vue 组件**
  创建顶部导航栏，实现自适应排版与夜间模式切换逻辑。
  Content of `C:\Users\PWL\personal-blog\src/components/Navbar.vue`:
  ```vue
  <template>
    <nav class="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-50 transition-colors duration-300">
      <div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <router-link to="/" class="text-xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">MyBlog</router-link>
        <div class="flex items-center gap-6">
          <router-link to="/" class="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">首页</router-link>
          <router-link to="/about" class="text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" active-class="text-indigo-600 dark:text-indigo-400">关于</router-link>
          <button @click="toggleDark" class="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all" aria-label="Toggle Dark Mode">
            <span v-if="isDark" class="text-yellow-500">☀️</span>
            <span v-else class="text-slate-600">🌙</span>
          </button>
        </div>
      </div>
    </nav>
  </template>

  <script setup>
  import { ref, onMounted } from 'vue'

  const isDark = ref(false)

  const toggleDark = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  onMounted(() => {
    isDark.value = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  })
  </script>
  ```

- [ ] **Step 3: 创建 Footer.vue 组件**
  简单的页脚，包含版权声明。
  Content of `C:\Users\PWL\personal-blog\src/components/Footer.vue`:
  ```vue
  <template>
    <footer class="border-t border-slate-200 dark:border-slate-800 py-8 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div class="max-w-4xl mx-auto px-4 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2026 MyBlog. Powered by Vite + Vue 3.</p>
      </div>
    </footer>
  </template>
  ```

- [ ] **Step 4: 修改 App.vue 使用路由和基础布局**
  整合页眉页脚，留出中间的 RouterView 进行视图切换。
  Content of `C:\Users\PWL\personal-blog\src/App.vue` (完全重写):
  ```vue
  <template>
    <div class="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main class="flex-grow max-w-4xl w-full mx-auto px-4 py-8">
        <router-view />
      </main>
      <Footer />
    </div>
  </template>

  <script setup>
  import Navbar from './components/Navbar.vue'
  import Footer from './components/Footer.vue'
  </script>
  ```

- [ ] **Step 5: 在 main.js 中注册路由**
  将 `router` 引入并绑定 to Vue 根实例。
  Modify: `C:\Users\PWL\personal-blog\src/main.js`
  Replace target content:
  ```javascript
  import { createApp } from 'vue'
  import './assets/main.css'
  import App from './App.vue'

  createApp(App).mount('#app')
  ```
  With:
  ```javascript
  import { createApp } from 'vue'
  import './assets/main.css'
  import App from './App.vue'
  import router from './router'

  createApp(App).use(router).mount('#app')
  ```

- [ ] **Step 6: 提交更改**
  Run:
  ```bash
  git add src/router/index.js src/components/Navbar.vue src/components/Footer.vue src/App.vue src/main.js
  git commit -m "feat: setup routing system and layout layout components"
  ```
  Expected: 路由及基础框架部分提交成功
