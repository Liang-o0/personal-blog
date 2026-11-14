import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node executes TypeScript directly.
import { filterSeriesPosts, readSearchParams, searchUrl } from '../src/lib/series-search.ts';
// @ts-ignore Node executes TypeScript directly.
import { paginateArchive } from '../src/lib/archive-pagination.ts';

const posts = [
  { id: 'one', title: 'Vue 学习', description: '组件设计', tags: ['前端'], date: '2026-05-01', body: '不可检索正文' },
  { id: 'two', title: '阅读', description: '经济学笔记', tags: ['思考'], date: '2026-05-31' },
  { id: 'three', title: '其他', tags: [], date: '2026-06-01' },
];
const filters = { keyword: '', start: '', end: '' };
test('only title, description and tags match, ignoring case, width and surrounding spaces', () => {
  for (const keyword of [' ｖＵＥ ', '组件', '前端']) assert.deepEqual(filterSeriesPosts(posts, { ...filters, keyword }).map(p => p.id), ['one']);
  assert.deepEqual(filterSeriesPosts(posts, { ...filters, keyword: '不可检索正文' }), []);
});
test('dates include both boundary days and combine with keywords without changing order', () => {
  assert.deepEqual(filterSeriesPosts(posts, { ...filters, start: '2026-05-01', end: '2026-05-31' }).map(p => p.id), ['one', 'two']);
  assert.deepEqual(filterSeriesPosts(posts, { keyword: '思考', start: '2026-05-01', end: '2026-05-31' }).map(p => p.id), ['two']);
  assert.deepEqual(filterSeriesPosts(posts, { ...filters, start: '2026-06-01', end: '2026-05-01' }), []);
  assert.equal(filterSeriesPosts(posts, filters).length, 3);
});
test('search state round trips, invalid URL values fall back safely', () => {
  const selection = { keyword: '经济 & 思考', start: '2026-05-01', end: '2026-05-31' };
  const url = new URL(searchUrl('/posts/series/a', selection, 2, 20), 'https://example.com');
  assert.equal(url.pathname, '/posts/series/a');
  assert.deepEqual(readSearchParams(url.searchParams), { filters: selection, page: 2, pageSize: 20 });
  assert.deepEqual(readSearchParams(new URLSearchParams('page=-1&size=30&start=2026-02-30&end=invalid')), { filters, page: 1, pageSize: 10 });
});
test('either single date searches exactly that day, while two dates search the full range', () => {
  for (const selected of [{ start: '2026-05-31', end: '' }, { start: '', end: '2026-05-31' }]) {
    assert.deepEqual(filterSeriesPosts(posts, { keyword: '', ...selected }).map(p => p.id), ['two']);
    assert.deepEqual(filterSeriesPosts(posts, { keyword: '前端', ...selected }), []);
    const url = new URL(searchUrl('/posts/series/a', { keyword: '', ...selected }, 1, 10), 'https://example.com');
    assert.deepEqual(filterSeriesPosts(posts, readSearchParams(url.searchParams).filters).map(p => p.id), ['two']);
  }
  assert.deepEqual(filterSeriesPosts(posts, { keyword: '', start: '2026-05-31', end: '2026-06-01' }).map(p => p.id), ['two', 'three']);
});
test('hundreds of results paginate without losing articles or ordering', () => {
  const entries = Array.from({ length: 305 }, (_, i) => ({ ...posts[0], id: String(i + 1) }));
  const found = filterSeriesPosts(entries, { ...filters, keyword: '前端' });
  assert.equal(paginateArchive(found).pageCount, 31);
  assert.deepEqual(paginateArchive(found, 31).posts.map(p => p.id), ['301', '302', '303', '304', '305']);
  assert.equal(paginateArchive(found, 2, 100).posts[0].id, '101');
});
