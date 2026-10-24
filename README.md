# britliang.top — Astro Personal Blog

一个面向个人主页、技术博客和生活记录的 Astro + Vue 博客架构。

## 技术栈

- Astro 5+
- Vue 3
- TypeScript
- Tailwind CSS 4
- Markdown / MDX
- Astro Content Collections
- GitHub + Cloudflare Pages

## 目录

```text
britliang-astro-blog/
├─ public/                 # 静态资源
├─ src/
│  ├─ components/          # Astro/Vue UI 组件
│  ├─ content/
│  │  └─ posts/            # Markdown/MDX 文章
│  ├─ layouts/             # 页面布局
│  ├─ pages/               # Astro 路由
│  ├─ styles/              # 全局样式
│  └─ content.config.ts    # 内容集合定义
├─ astro.config.mjs
├─ package.json
├─ tsconfig.json
└─ .gitignore
```

## 路由

- `/` 首页
- `/about` 关于
- `/posts` 文章列表
- `/posts/[slug]` 文章详情
- `/posts/series/[id]` 专题目录（第 1 页）
- `/posts/series/[id]/page/[page]` 专题目录分页（第 2 页起）
- `/tags/[tag]` 标签页（后续扩展）



## 架构原则

1. Astro 负责页面、路由、静态生成和内容。
2. Vue 只用于真正需要交互的组件。
3. 文章内容与文章页面模板分离。
4. 不使用数据库保存普通博客文章。
5. GitHub 是内容和代码的版本库。
6. Cloudflare Pages 负责自动构建和部署。

## 文章专题与写作

### 滚动渐显

首页最近文章、全部文章列表、专题入口和专题目录使用统一的视口触发渐显。`src/scripts/post-reveal.ts` 使用一个 IntersectionObserver 逐项观察，进入视口后播放一次；同批可见条目以 0.08 秒间隔呈现，后续批次重新计算延迟。`src/styles/post-reveal.css` 集中配置 0.5 秒时长、10px 位移和动画曲线。

正文和摘要仍静态输出（首页 5 篇、列表按页生成），没有 JavaScript 时直接可见；开启减少动态效果时取消动画。键盘聚焦会立即显示对应条目。分页 Vue 交互模块采用 `client:visible`，滚动到分页区域再加载。

### 全部文章分页

全部文章默认每页显示 10 篇，用户可以选择每页 10／20／50／100 篇。默认首屏地址为 `/posts`，后续页为 `/posts/page/2` 等；其他篇数使用 `/posts/size/20/page/1` 等地址，刷新保留选择。切换篇数回到第 1 页。页码使用 Ant Design Vue Pagination，篇数选择和跳页表单独立布局；控件统一为 40px 高，使用深色实色底与清晰边框，支持 Enter 或点击“跳转”；跳转后定位到全部文章列表。总数来自实际已发布文章，不包含草稿。单页也展示篇数选择与跳页入口。首页最近文章仅展示最新 5 篇。

- `src/lib/archive-pagination.ts`：默认每页篇数 `ARCHIVE_PAGE_SIZE`、可选篇数 `ARCHIVE_PAGE_SIZES`、分页切片、页码范围和 URL。默认值必须包含在可选值中，修改后重新构建。
- `src/components/posts/ArchivePage.astro`：组合专题入口与当前页文章。
- `src/components/ui/ArchivePagination.vue`：Ant Design Vue 页码和快速跳页交互。
- `src/styles/archive-pagination.css`：分页独立样式，控件统一高度、实色背景与清晰边框。
- `src/pages/posts/page/[page].astro`：生成有效的后续分页地址；文章列表条目复用 PostList。

单页内容仍显示当前页码；没有文章时不显示分页。无需为占位增加文章。文章序号跨页连续，专题目录仍保持每页 30 篇。

### 专题入口按钮

专题篇数和“进入专题”复用 `src/components/ui/SlideButton.vue`，两者均跳转到专题目录。文字由 `text1`（默认）、`text2`（悬停或键盘聚焦）指定，`href` 指定链接，`arrow` 控制箭头，`label` 提供完整的无障碍名称。

所有按钮的全局默认参数集中在 `src/styles/slide-button.css` 顶部的 `:root`：
专题目录顶部的“返回文章”也复用此组件，设置 `arrowDirection="left"` 将箭头朝左并放到文字前方；默认 `right` 用于向前进入的按钮。

- `--slide-button-duration`：文字和背景动画时长，默认 `500ms`。
- `--slide-button-arrow-duration`：箭头动画时长，默认 `700ms`。
- `--slide-button-easing`：动画曲线。
- `--slide-button-distance`：文字与箭头滑动距离。
- `--slide-button-hover-scale`：悬停缩放幅度。
- `--slide-button-font-size`：字号，默认 `1rem`（通常为 16px）。
- 同一处也可修改内边距、圆角、颜色、背景、边框和覆盖层。

修改这一处即可更新所有 SlideButton；如需单独调整某一区域，可在其父元素覆盖同名 CSS 变量。动画采用 CSS 实现，文章页无需额外加载 Vue 交互脚本，键盘焦点也能触发效果，并遵循系统“减少动态效果”设置。

文章页已提供“365天思想实验”“《小岛经济学》解读”“《穷爸爸富爸爸》解读”三个专题。空专题正常展示，发表第一篇文章后自动显示篇数及目录。

### 在专题下添加文章

在 `src/content/posts/` 新建一个 Markdown 文件，例如 `thought-experiment-001.md`：

```markdown
---
title: 第一天：你的文章标题
description: 用一两句话介绍本篇内容。
pubDate: 2026-10-02
tags:
  - 思考
series: 365-thought-experiments
seriesOrder: 1
draft: false
---

在这里撰写正文。
```

| 专题标识（填写到 series） | 展示名称 |
| --- | --- |
| `365-thought-experiments` | 365天思想实验 |
| `island-economics` | 《小岛经济学》解读 |
| `rich-dad-poor-dad` | 《穷爸爸富爸爸》解读 |

- `seriesOrder` 是专题内的期数或章节顺序，必须为正整数；允许跳号，同专题内不能重复（包括草稿）。
- `series` 与 `seriesOrder` 必须一起填写。独立文章同时省略这两个字段即可。
- 专题目录按序号升序，每页 30 篇；上一篇与下一篇仅在该专题内连续阅读。全部文章和首页最近文章按发布日期倒序。
- 设置 `draft: true` 后，文章不进入公开列表、篇数统计和上下篇导航，也不生成正文页面；开发预览同样隐藏草稿。草稿仍接受专题引用和序号校验。
- 文件平铺在 `src/content/posts/` 下，使用唯一的小写英文、数字和连字符文件名；不使用嵌套目录。文件名决定 `/posts/文件名` 地址，发布后尽量不要修改。
- 错误专题标识、缺少配对字段、无效或重复序号都会使构建失败，并提示相关文件或文章标识。

### 新增专题

在 `src/content/series/` 新建 `your-series.md`：

```markdown
---
title: 新专题名称
description: 这个专题讨论什么，以及适合怎样阅读。
order: 4
---
```

文件名 `your-series` 就是文章中填写的 `series` 值。专题名称可以修改，标识建议保持稳定。`order` 为正整数，控制文章页中专题的展示顺序；相同时按标识排序。无需新增页面或修改组件。

### 验证

```sh
node --experimental-strip-types --test tests/post-index.test.ts
node tests/series-build.mjs
npm run build
```

测试使用 Node 22.6 或更新版本。集成测试会创建带随机前缀的临时内容，执行实际构建验证分页、导航及错误拦截，并在结束时清理。请避免与开发服务器或其他构建同时运行；最后执行正式构建，刷新内容缓存及生产产物。

Windows 安装 Microsoft Edge 后，还可运行 `node tests/series-browser.mjs` 检查已构建页面在 1440px、390px 和 320px 宽度下的布局、键盘焦点与目录跳转。可通过 `BROWSER_EXECUTABLE` 指定其他 Chromium 浏览器路径；截图保存在 `node_modules/.cache/series-review/`。此检查屏蔽外部字体请求，避免字体服务网络波动影响结果。

