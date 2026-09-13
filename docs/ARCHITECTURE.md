# 项目结构说明

这是一个基于 Vue 3、Vite 和 Vue Router 的静态个人博客，部署目标是 Cloudflare Pages。

```text
src/
  main.js                 应用入口，注册 Vue、样式和路由
  App.vue                 全局应用壳层：背景、导航、路由出口、页脚
  router/index.js         页面路由和 404 兜底
  views/                  页面级组件
    HomeView.vue          首页内容与文章筛选
    PostView.vue          Markdown 文章详情
    AboutView.vue          关于页
    NotFoundView.vue      未匹配路由的 404 页面
  components/             可复用业务组件
    Navbar.vue            全局导航与主题切换
    Footer.vue            全局页脚
    ui/                   动画、轮播和按钮等展示组件
  posts/                  Markdown 文章，front matter 提供标题、日期、标签和摘要
  assets/                 会被 Vite 处理和打包的图片、样式资源
public/                   原样复制到 dist 的 Cloudflare Pages 文件
  _redirects              SPA 路由回退规则
  _headers                安全响应头和缓存规则
```

新增文章时，将 Markdown 文件放入 `src/posts/`，并在文件顶部填写 front matter。页面会在构建时通过 `import.meta.glob` 收集这些文件。

页面组件负责布局和交互，`components/ui` 只负责可复用的视觉交互，避免把页面业务逻辑散落在动画组件中。
