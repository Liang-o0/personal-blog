<script setup lang="ts">
import type { PostSummary } from '../../lib/post-summary';
import { postUrl } from '../../lib/post-index';
import '../../styles/post-reveal.css';
withDefaults(defineProps<{ posts: PostSummary[]; numbered?: boolean; offset?: number; tagsPlacement?: 'summary' | 'date' }>(), { numbered: false, offset: 0, tagsPlacement: 'summary' });
</script>
<template>
  <div :class="['post-list', { 'post-list--archive': tagsPlacement === 'date' }]">
    <a v-for="(post, index) in posts" :key="post.id" class="glass post-row post-reveal" :href="postUrl(post.id)">
      <span class="eyebrow">{{ String(numbered ? post.order : offset + index + 1).padStart(2, '0') }}</span>
      <div class="post-summary">
        <p v-if="post.seriesTitle" class="post-series-label">{{ post.seriesTitle }}</p>
        <h2>{{ post.title }}</h2><p v-if="post.description" class="muted">{{ post.description }}</p>
        <div v-if="tagsPlacement === 'summary' && post.tags.length" class="muted post-tags">{{ post.tags.map(tag => `#${tag}`).join('  ') }}</div>
      </div>
      <div v-if="tagsPlacement === 'date'" class="post-date-meta"><div v-if="post.tags.length" class="muted post-tags"><span v-for="tag in post.tags" :key="tag">#{{ tag }}</span></div></div>
      <time v-else class="muted" :datetime="post.date">{{ new Date(post.date).toLocaleDateString('zh-CN', { timeZone: 'UTC' }) }}</time>
    </a>
  </div>
</template>
<style scoped>
.post-date-meta { min-width: 0; max-width: 260px; text-align: right; justify-self: end; }
.post-date-meta .post-tags { display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 4px 10px; }
.post-date-meta .post-tags span { overflow-wrap: anywhere; }
@media (max-width: 640px) { .post-date-meta { grid-column: 2; max-width: 100%; } }
</style>
