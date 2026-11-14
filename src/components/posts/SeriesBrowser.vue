<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import ArchivePagination from '../ui/ArchivePagination.vue';
import PostRows from './PostRows.vue';
import { archiveUrl, paginateArchive } from '../../lib/archive-pagination';
import { filterSeriesPosts, readSearchParams, searchUrl } from '../../lib/series-search';
import type { PostSummary } from '../../lib/post-summary';
import '../../styles/series-search.css';
const props = defineProps<{ posts: PostSummary[]; basePath: string; title: string; initialPage: number; initialPageSize: number }>();
const open = ref(false);
const ready = ref(false);
const keywordInput = ref<HTMLInputElement>();
const filters = ref({ keyword: '', start: '', end: '' });
const page = ref(props.initialPage);
const pageSize = ref(props.initialPageSize);
const active = computed(() => !!(filters.value.keyword.trim() || filters.value.start || filters.value.end));
const invalidRange = computed(() => !!(filters.value.start && filters.value.end && filters.value.start > filters.value.end));
const filtered = computed(() => filterSeriesPosts(props.posts, filters.value));
const results = computed(() => paginateArchive(filtered.value, Math.min(page.value, Math.max(1, Math.ceil(filtered.value.length / pageSize.value))), pageSize.value));
const pageUrl = (next: number, size: number) => active.value ? searchUrl(props.basePath, filters.value, next, size) : archiveUrl(next, size, { basePath: props.basePath });
function saveUrl() {
  // Preserve Astro's history metadata while recording this directory's state.
  window.history.replaceState(window.history.state, '', pageUrl(results.value.page, pageSize.value));
}
function changeFilters() { page.value = 1; saveUrl(); }
function clear() { filters.value = { keyword: '', start: '', end: '' }; changeFilters(); }
async function toggle() {
  open.value = !open.value;
  if (open.value) { await nextTick(); keywordInput.value?.focus({ preventScroll: true }); }
}
function changePage(next: number, size: number) { page.value = next; pageSize.value = size; saveUrl(); }
onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  if (['q', 'start', 'end'].some(key => params.has(key))) {
    const state = readSearchParams(params);
    filters.value = state.filters; page.value = state.page; pageSize.value = state.pageSize;
    open.value = active.value;
    saveUrl();
  }
  ready.value = true;
});
</script>
<template>
  <div class="series-browser">
    <div class="series-tools">
      <p class="series-count">已发布 <strong>{{ posts.length }}</strong> 篇 <span class="muted">· 按篇章顺序阅读</span></p>
      <button class="series-search-toggle" type="button" :disabled="!ready" :aria-label="open ? '收起搜索' : '搜索本专题'" :title="open ? '收起搜索' : '搜索本专题'" :aria-expanded="open" aria-controls="series-search-panel" @click="toggle">
        <!-- Iconify / Lucide search: https://api.iconify.design/lucide/search.svg (ISC). -->
        <svg v-if="!open" viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21 21l-4.34-4.34" /><circle cx="11" cy="11" r="8" /></svg>
        <svg v-else viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" /></svg>
        <span v-if="active" class="series-search-dot" aria-hidden="true" />
      </button>
    </div>
    <div id="series-search-panel" class="series-search-panel" :class="{ 'is-open': open }" :inert="!open" :aria-hidden="!open">
      <div class="series-search-clip">
        <form class="series-search-form glass" role="search" aria-label="搜索本专题" @submit.prevent="changeFilters">
          <label class="series-search-keyword"><input ref="keywordInput" v-model="filters.keyword" type="search" aria-label="关键词" placeholder="搜索标题、简介和标签" @input="changeFilters" /></label>
          <label class="series-search-date" :class="{ 'is-empty': !filters.start }"><input v-model="filters.start" type="date" aria-label="开始日期" :max="filters.end || undefined" :aria-invalid="invalidRange" :aria-describedby="invalidRange ? 'series-search-date-error' : undefined" @input="changeFilters" /><span v-if="!filters.start" class="series-date-placeholder" aria-hidden="true">开始日期</span></label>
          <label class="series-search-date" :class="{ 'is-empty': !filters.end }"><input v-model="filters.end" type="date" aria-label="结束日期" :min="filters.start || undefined" :aria-invalid="invalidRange" :aria-describedby="invalidRange ? 'series-search-date-error' : undefined" @input="changeFilters" /><span v-if="!filters.end" class="series-date-placeholder" aria-hidden="true">结束日期</span></label>
          <div class="series-search-actions"><span class="muted">选一个日期查当天，选两个日期查范围（含起止当天）</span><button type="button" @click="clear">清空筛选</button></div>
          <p v-if="invalidRange" id="series-search-date-error" class="series-search-error" role="alert">开始日期不能晚于结束日期。</p>
        </form>
      </div>
    </div>
    <p v-if="active" class="series-search-status" role="status">找到 <strong>{{ results.total }}</strong> 篇文章<span v-if="!open" class="muted"> · 筛选条件已保留</span></p>
    <section :aria-label="`${title}文章目录`">
      <PostRows v-if="results.total" :key="`${filters.keyword}|${filters.start}|${filters.end}|${results.page}|${pageSize}`" :posts="results.posts" numbered />
      <div v-else-if="active" class="glass series-empty"><h2>没有找到匹配的文章</h2><p class="muted">试试其他关键词，或调整日期范围。</p><button class="series-search-clear" type="button" @click="clear">清空筛选</button></div>
      <div v-else class="glass series-empty"><p class="eyebrow">To be continued</p><h2>文章正在整理中</h2><p class="muted">这个专题的第一篇文章发布后，会出现在这里。</p><a href="/posts" class="directory-back">先看看其他文章 →</a></div>
    </section>
    <ArchivePagination v-if="results.total" :current="results.page" :total="results.total" :page-size="pageSize" :target="{ basePath }" label="专题目录分页" :controlled="active" :url-for-page="pageUrl" @change="changePage" />
    <noscript><p class="muted">启用 JavaScript 后可使用关键词和日期搜索。</p></noscript>
  </div>
</template>
