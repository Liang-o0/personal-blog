# britliang.top 技术架构

## 1. 总体架构

```text
                 GitHub
                   │
                   │ push
                   ↓
            Cloudflare Pages
                   │
                   │ build
                   ↓
          Astro Static Site
                   │
          ┌────────┴────────┐
          ↓                 ↓
     Astro Pages         Vue Islands
          │                 │
          ↓                 ↓
      HTML/CSS/JS      搜索/主题/筛选
          │
          ↓
     Cloudflare CDN
          │
          ↓
     britliang.top
```

## 2. 内容流

```text
Markdown / MDX
      ↓
Content Collection
      ↓
Schema 校验
      ↓
Astro getCollection()
      ↓
页面模板
      ↓
静态 HTML
```

## 3. 页面职责

### 首页
展示个人信息、兴趣、语录、生活记录、最近文章。

### 文章列表
展示专题入口和全部文章。专题可以没有文章；全部文章按发布时间倒序，同日期按标识排序。

全部文章使用独立的静态分页，默认每页 10 篇，可选择 10／20／50／100 篇：`/posts` 为默认首页，`/posts/page/[page]` 为默认后续页；其他篇数由 `/posts/size/[size]/page/[page]` 生成对应页面。`src/lib/archive-pagination.ts` 负责切片、页码校验与 URL；`ArchivePage.astro` 组合专题与当前页条目；`ArchivePagination.vue` 负责 Ant Design Vue 页码、篇数选择和快速跳页，样式在 `src/styles/archive-pagination.css`。Vue 岛不接收文章正文或全量列表，刷新后仍保持正确页码和篇数。无 JavaScript 时保留普通页码链接和上下页降级入口。首页最近文章仅取已发布文章时间倒序的前 5 篇。

### 专题目录

`series` 集合存储专题名称、简介、展示顺序；`posts` 通过 `series` 引用专题，使用 `seriesOrder` 表达期数或章节顺序。每篇文章最多属于一个专题，独立文章省略两个字段。

`/posts/series/[id]` 生成专题首页（含空目录），后续分页使用 `/posts/series/[id]/page/[page]`，每页 30 篇。只生成实际存在的分页。

内容职责分为：

- `src/content.config.ts`：字段类型、正整数、配对字段校验。
- `src/lib/post-index.ts`：不依赖页面框架的关系校验、排序、计数、分页和相邻文章规则。
- `src/lib/posts.ts`：加载 Astro 集合并建立统一索引，供首页和文章页面使用。
- `src/components/posts/PostList.astro`：复用文章条目。
- `src/components/posts/SeriesDirectory.astro`：复用专题首页和分页展示。
- `src/styles/posts.css`：文章模块布局与响应式样式。

所有文章（包括草稿）都校验专题引用存在性与专题内序号唯一性，失败时中断构建。公开查询统一排除草稿，避免草稿出现在计数、分页或导航中。

### 文章详情
使用动态路由 `[slug].astro`，构建时为每篇已发布文章生成独立页面。

专题文章通过面包屑返回目录，上下篇按同专题序号排列，允许跨目录分页。独立文章保留全站时间顺序导航。文章平铺存放，路径保持 `/posts/[slug]`。

### 关于
稳定的个人介绍、联系方式和个人表达。

## 4. Astro 与 Vue 的边界

优先使用 Astro：
- 静态文本
- 页面结构
- 文章正文
- SEO
- 路由
- 内容集合

使用 Vue：
- 搜索
- 主题切换
- 标签筛选
- 评论
- 需要状态管理的交互

原则：

> 能用 Astro 完成，就不要为了“用了 Vue”而使用 Vue。

第一版不需要数据库。

不要提前引入复杂后端。
