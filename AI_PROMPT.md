# 生成 / 重构这个博客的 AI 提示词

你是一名资深前端架构师、UI/UX 设计师和 Astro 开发者。请帮我构建一个高质量的个人博客网站。

## 项目背景

网站域名：britliang.top

这是一个软件工程专业学生的个人网站，主要用于：
1. 展示个人信息和兴趣爱好
2. 记录技术学习、项目实践、生活和思考
3. 长期维护数百篇甚至上千篇文章
4. 作为个人作品集和技术主页

## 技术要求

必须使用：
- Astro
- Vue 3
- TypeScript
- Markdown / MDX
- Astro Content Collections
- GitHub
- Cloudflare Pages

架构要求：
- Astro 负责页面、路由、静态生成、SEO 和文章内容
- Vue 只用于有真实交互需求的组件
- 不要把整个网站做成 Vue SPA
- 文章必须与页面模板分离
- 新增 Markdown 文章后，无需手动修改首页即可自动出现在文章列表
- 使用静态站点生成（SSG）
- 不依赖数据库
- 页面必须支持移动端和桌面端
- 保持组件化、可维护、可扩展

## 网站结构

首页 `/`
- 顶部导航
- 个人名字/Logo
- 简短自我介绍
- 打招呼区域
- 兴趣爱好
- 一句话/语录
- 生活记录
- 最近文章
- 页脚

文章 `/posts`
- 文章列表
- 发布时间
- 标签
- 摘要
- 后续可扩展搜索、分类、标签筛选和分页

文章详情 `/posts/[slug]`
- 标题
- 发布时间
- 更新时间
- 标签
- Markdown 正文
- 代码高亮
- 图片
- 上一篇/下一篇
- 返回文章列表

关于 `/about`
- 关于我
- 联系方式
- 想说的话
- GitHub 等外部链接

## 设计风格

整体风格：
- 极简
- 高级
- 干净
- 有个人气质
- 不要模板化、廉价感
- 留白充足
- 排版优先
- 适合长期阅读

可以参考现代独立开发者、设计师和技术博客的视觉语言，但不要直接复制任何网站。


交互：
- 导航栏
- 深色模式
- 文章标签
- 搜索（可以作为第二阶段）
- 平滑动画
- hover 微交互

## 代码质量

请：
1. 使用 TypeScript
2. 清晰划分 Astro Components、Vue Components、Layouts、Pages、Content
3. 给关键逻辑添加必要注释
4. 避免重复代码
5. 保持 SEO 友好
6. 支持 Open Graph / Twitter Card
7. 生成 sitemap
8. 文章 URL 使用稳定 slug
9. 正确处理 draft 文章
10. 保证 Cloudflare Pages 可以直接构建

## 最重要的架构原则

不要为每篇文章手写 HTML。

正确方式：

Markdown 文件
→ Astro Content Collection
→ 统一文章模板
→ `[slug].astro`
→ 构建时自动生成所有文章页面

例如：

src/content/posts/java.md
→ /posts/java

src/content/posts/my-life.md
→ /posts/my-life

未来即使有 500 篇文章，也只需要维护 Markdown 文件和统一页面模板。

## 输出要求

请按照以下顺序工作：

1. 先设计完整项目架构
2. 给出项目目录树
3. 创建 Astro 配置
4. 创建 Content Collection
5. 创建页面 Layout
6. 创建首页
7. 创建文章列表页
8. 创建动态文章详情页
9. 创建 About 页面
10. 创建必要的 Vue 交互组件
11. 配置 Tailwind
12. 配置 SEO
13. 添加示例文章
14. 给出 npm 安装和启动命令
15. 给出 Cloudflare Pages 部署配置
16. 最后检查整个项目是否可以正常构建

不要为了展示技术而加入不必要的后端、数据库、Redis、Spring Boot 或 API。

这是一个个人博客，优先考虑：
**简单、快速、稳定、可维护、长期扩展。**
