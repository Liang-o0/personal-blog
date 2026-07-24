### Task 2: 配置 Tailwind CSS 与全局样式

**Files:**
- Create: `C:\Users\PWL\personal-blog\tailwind.config.js`
- Create: `C:\Users\PWL\personal-blog\postcss.config.js`
- Create: `C:\Users\PWL\personal-blog\src/assets/main.css`

**Interfaces:**
- Consumes: Task 1 建立好的项目基础依赖
- Produces: 可在 Vue 组件中直接使用的 Tailwind CSS 类名与暗黑模式支持

- [ ] **Step 1: 编写 PostCSS 配置**
  在项目根目录下写入 `postcss.config.js` 以编译 CSS。
  Content of `C:\Users\PWL\personal-blog\postcss.config.js`:
  ```javascript
  export default {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  }
  ```

- [ ] **Step 2: 编写 Tailwind 配置文件**
  启用暗黑模式 class 选择器，并引入 `typography` 排版插件。
  Content of `C:\Users\PWL\personal-blog\tailwind.config.js`:
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    darkMode: 'class',
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
  ```

- [ ] **Step 3: 创建全局 CSS 并引入 Tailwind 指令**
  创建 `src/assets/main.css`，在头部声明 Tailwind 核心指令，并为全局添加背景色过渡效果以适配暗黑模式切换。
  Content of `C:\Users\PWL\personal-blog\src/assets/main.css`:
  ```css
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  body {
    @apply transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50;
  }
  ```

- [ ] **Step 4: 测试 CSS 构建配置**
  在 `src/main.js` 中引入刚创建的全局样式，确认 Vite 能正确加载它。
  Modify: `C:\Users\PWL\personal-blog\src/main.js`
  Replace target content:
  ```javascript
  import { createApp } from 'vue'
  import './style.css'
  import App from './App.vue'

  createApp(App).mount('#app')
  ```
  With:
  ```javascript
  import { createApp } from 'vue'
  import './assets/main.css'
  import App from './App.vue'

  createApp(App).mount('#app')
  ```
  Run: `npm run build`
  Expected: 打包成功且无 CSS 语法报错

- [ ] **Step 5: 提交更改**
  Run:
  ```bash
  git add tailwind.config.js postcss.config.js src/assets/main.css src/main.js
  git commit -m "style: configure Tailwind CSS and theme variables"
  ```
  Expected: 提交成功
