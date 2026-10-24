# Article Series Implementation Plan

> **For agentic workers:** Use executing-plans to implement this plan task-by-task in the current workspace. Steps use checkbox syntax for tracking.

**Goal:** 实现文章专题入口、每页 30 篇的目录、专题内连续阅读和严格内容校验。

**Architecture:** Astro 内容集合负责文章与专题定义；纯函数内容索引负责关系校验、排序、分页与相邻文章；独立的 Astro 组件负责列表和目录展示。保留现有独立文章地址。

**Tech Stack:** Astro 5、TypeScript、Markdown、现有 CSS 变量、Node 内置测试工具。

## Global Constraints

- 三个初始专题为空，不虚构已发表文章。
- 草稿不公开，但仍参与引用及序号唯一性校验。
- 不增加运行时依赖，不更改用户其他既有变动。
- 沿用深色玻璃质感与非对称布局，移动端单列。

### Task 1: 内容模型与索引

Files: `src/content.config.ts`, `src/content/series/*.md`, `src/lib/post-index.ts`, `src/lib/posts.ts`, `tests/post-index.test.ts`。

- [x] 扩展文章 schema：`series: reference('series').optional()` 与 `seriesOrder: z.number().int().positive().optional()` 必须配对。
- [x] 新建专题 schema：非空标题、简介、正整数排序。
- [x] 实现 `createPostIndex(allPosts, allSeries)`，返回 `posts`, `series`, `getSeriesPosts(id)`, `getSeriesPage(id, page)`, `getAdjacentPosts(post)`。
- [x] 检查包括草稿在内的未知引用与重复序号，错误列出文章标识；排序使用标识打破平局。
- [x] 测试 31 篇跨页、草稿隐藏、同专题导航、不连续序号、未知引用及重复序号。
- [x] `src/lib/posts.ts` 使用 `getCollection` 加载两个集合并调用索引；首页最近文章也使用统一入口。

### Task 2: 页面与阅读路径

Files: `src/components/posts/{PostList,SeriesDirectory}.astro`, `src/pages/posts/index.astro`, `src/pages/posts/[slug].astro`, `src/pages/posts/series/[id]/index.astro`, `src/pages/posts/series/[id]/page/[page].astro`, `src/styles/posts.css`。

- [x] 总览页组合专题纵向列表和全部文章列表；显示准确计数和专题名称。
- [x] `PostList` 复用条目展示，专题目录显示实际序号。
- [x] `SeriesDirectory` 组合标题、返回链接、空态、列表和分页。
- [x] 首页目录生成全部专题；分页路由只生成第 2 页至最后一页。
- [x] 正文面包屑显示专题和文章名称，使用索引获取同专题上一篇与下一篇。
- [x] 增加作用于文章模块的响应式 CSS，处理长标题、移动端单列、键盘焦点和减弱动画。

### Task 3: 文档与验证

Files: `README.md`, `ARCHITECTURE.md`, `tests/series-build.mjs`。

- [x] README 提供专题、文章 frontmatter 模板、平铺命名和草稿规则。
- [x] 更新架构说明，列明内容校验与组件边界。
- [x] 临时内容构建测试检查分页输出、正文导航、草稿路由缺失；独立失败构建覆盖未知引用、字段缺失、无效和重复序号；finally 删除本脚本创建的临时文件。
- [x] 运行 `node --experimental-strip-types --test tests/post-index.test.ts`。
- [x] 运行 `node tests/series-build.mjs`。
- [x] 运行 `npm run build`，最终产物仅含真实内容。
- [x] 检查浏览器桌面与窄屏布局（浏览器工具可用时），否则明确报告验证限制。

