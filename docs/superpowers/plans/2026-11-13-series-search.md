# 专题搜索实施步骤

**目标：** 完成已确认的专题内关键词与日期搜索，复用列表和分页。

**架构：** 纯搜索模块只依赖文章摘要和筛选条件；专题 Vue 模块统一管理状态；Astro 传入已发布摘要，不传正文。分页支持受控事件，原有链接导航作为默认行为保留。

1. 新建 `src/lib/series-search.ts` 和 `tests/series-search.test.ts`：定义摘要及过滤条件，验证字段范围、日期边界、查询恢复和大列表。
2. 抽取 `src/components/posts/PostRows.vue`，由现有 `PostList.astro` 和专题浏览器共享；保留 DOM、样式和默认文章展示行为。
3. 扩展 `ArchivePagination.vue` 的受控翻页事件与链接生成接口；实现 `SeriesBrowser.vue` 的图标入口、弹性展开、筛选、结果、清空和 URL 状态。
4. `SeriesDirectory.astro` 接入浏览器模块；日期按发布日期 UTC 日期，空专题保留原文案，静态翻页保留。
5. 执行 Node 单元测试、Astro 构建、静态集成和浏览器检查；检查 320/390/1440px、减少动态效果和键盘操作。沿用用户此前不提交 Git 的选择。
