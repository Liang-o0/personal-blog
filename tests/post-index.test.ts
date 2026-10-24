import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node 22 executes this TypeScript test directly.
import { createPostIndex, seriesUrl } from '../src/lib/post-index.ts';

const series = [{ id: 'a', data: { order: 1 } }, { id: 'b', data: { order: 1 } }];
const post = (id: string, order?: number, draft = false, topic = 'a') => ({
  id, data: { pubDate: new Date('2026-10-01'), draft,
    ...(order === undefined ? {} : { series: { id: topic }, seriesOrder: order }) },
});

test('31 entries paginate without losing order; drafts do not count', () => {
  const entries = Array.from({ length: 31 }, (_, i) => post(`p-${i + 1}`, i + 1)).reverse();
  const index = createPostIndex([...entries, post('draft', 32, true)], series);
  const first = index.getSeriesPage('a');
  const second = index.getSeriesPage('a', 2);
  assert.equal(first.posts.length, 30);
  assert.equal(first.total, 31);
  assert.equal(first.pageCount, 2);
  assert.deepEqual(second.posts.map(p => p.id), ['p-31']);
  assert.equal(index.getAdjacentPosts(entries[1]).next?.id, 'p-31');
  assert.equal(index.getAdjacentPosts(entries[0]).previous?.id, 'p-30');
  assert.equal(index.getAdjacentPosts(entries[0]).next, undefined);
  assert.throws(() => index.getSeriesPage('a', 3), /不存在第 3 页/);
});

test('series navigation skips drafts and gaps and never enters another series', () => {
  const first = post('first', 1);
  const last = post('last', 10);
  const index = createPostIndex([last, post('hidden', 5, true), first, post('other', 2, false, 'b')], series);
  assert.equal(index.getAdjacentPosts(first).previous, undefined);
  assert.equal(index.getAdjacentPosts(first).next?.id, 'last');
  assert.equal(index.getAdjacentPosts(last).previous?.id, 'first');
  assert.equal(index.getAdjacentPosts(last).next, undefined);
});

test('empty series has one empty page and unknown series is rejected', () => {
  const index = createPostIndex([], series);
  assert.deepEqual(index.getSeriesPage('a').posts, []);
  assert.equal(index.getSeriesPage('a').pageCount, 1);
  for (const page of [0, -1, 1.5, 2]) assert.throws(() => index.getSeriesPage('a', page));
  assert.throws(() => index.getSeriesPage('missing'), /不存在的专题/);
});

test('all content including drafts is validated and errors identify affected posts', () => {
  assert.throws(() => createPostIndex([post('bad-reference', 1, true, 'missing')], series), /bad-reference.*missing/);
  assert.throws(() => createPostIndex([post('published', 1), post('draft', 1, true)], series), /published.*draft/);
  for (const order of [0, -1, 1.5]) assert.throws(() => createPostIndex([post('invalid', order)], series), /正整数/);
  assert.throws(() => createPostIndex([{ id: 'unpaired', data: { ...post('base').data, series: { id: 'a' } } }], series), /同时提供/);
});

test('ties are stable, independent navigation retains global date order, and input is unchanged', () => {
  const entries = [post('z'), post('a', 1)];
  const index = createPostIndex(entries, [...series].reverse());
  assert.deepEqual(index.posts.map(p => p.id), ['a', 'z']);
  assert.deepEqual(index.series.map(s => s.id), ['a', 'b']);
  assert.deepEqual(entries.map(p => p.id), ['z', 'a']);
  assert.equal(index.getAdjacentPosts(entries[0]).next?.id, 'a');
  assert.equal(index.getAdjacentPosts(entries[0]).previous, undefined);
  assert.equal(seriesUrl('a'), '/posts/series/a');
  assert.equal(seriesUrl('a', 2), '/posts/series/a/page/2');
});
