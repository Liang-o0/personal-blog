<script setup lang="ts">
import { ref, computed } from 'vue';
import Pagination from 'ant-design-vue/es/pagination';
import ConfigProvider from 'ant-design-vue/es/config-provider';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ARCHIVE_PAGE_SIZES, archiveUrl, type PaginationTarget } from '../../lib/archive-pagination';
import '../../styles/archive-pagination.css';

const props = withDefaults(defineProps<{ current: number; total: number; pageSize: number; target?: PaginationTarget; label?: string; controlled?: boolean; urlForPage?: (page: number, size: number) => string }>(), { label: '全部文章分页' });
const emit = defineEmits<{ change: [page: number, size: number] }>();
const pageUrl = (page: number, size = props.pageSize) => props.urlForPage?.(page, size) ?? archiveUrl(page, size, props.target);
const jumpPage = ref<number | string>('');
const pageCount = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
function navigate(page: number, size = props.pageSize) {
  const target = size === props.pageSize ? page : 1;
  if (props.controlled) {
    jumpPage.value = '';
    emit('change', target, size);
    return;
  }
  window.location.assign(pageUrl(target, size));
}
function changeSize(event: Event) {
  navigate(1, Number((event.target as HTMLSelectElement).value));
}
function jump() {
  const page = Number(jumpPage.value);
  if (Number.isInteger(page) && page >= 1 && page <= pageCount.value) navigate(page);
}
</script>

<template>
  <nav class="archive-pagination" :aria-label="label">
    <ConfigProvider :locale="zhCN" :theme="{ token: { colorPrimary: '#9ee5cc', colorText: '#edf7f3', colorTextDisabled: '#9cafaa', colorBgContainer: '#182b2c', controlHeight: 40, fontFamily: 'inherit' } }">
      <Pagination :current="current" :total="total" :page-size="pageSize" :show-size-changer="false" :show-quick-jumper="false" show-less-items @change="navigate">
        <template #itemRender="{ page, type, originalElement }">
          <a v-if="type === 'page'" :href="pageUrl(page)" :aria-label="`第 ${page} 页`" :aria-current="page === current ? 'page' : undefined" @click="event => { if (controlled && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) { event.preventDefault(); event.stopPropagation(); navigate(page); } }">{{ page }}</a>
          <component :is="originalElement" v-else />
        </template>
      </Pagination>
    </ConfigProvider>
    <div class="archive-pagination__controls">
      <label class="archive-pagination__size">
        <span class="sr-only">每页文章数量</span>
        <select :value="pageSize" aria-label="每页文章数量" @change="changeSize">
          <option v-for="size in ARCHIVE_PAGE_SIZES" :key="size" :value="size" :selected="size === pageSize">{{ size }} 篇/页</option>
        </select>
      </label>
      <form class="archive-pagination__jump" @submit.prevent="jump">
        <label>
          <span>跳至</span>
          <input v-model="jumpPage" type="number" inputmode="numeric" min="1" :max="pageCount" required aria-label="跳转页码" :placeholder="String(current)" @keydown.enter.prevent="jump" />
          <span>页</span>
        </label>
        <button type="submit">跳转</button>
      </form>
    </div>
  </nav>
</template>
