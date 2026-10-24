import { test } from 'node:test';
import assert from 'node:assert/strict';
// @ts-ignore Node runs TypeScript directly.
import { paginateArchive, archiveUrl } from '../src/lib/archive-pagination.ts';

test('archive uses ten entries per page and preserves numbering and ordering', () => {
  const entries = Array.from({ length: 21 }, (_, index) => index + 1);
  assert.deepEqual(paginateArchive(entries).posts, entries.slice(0, 10));
  assert.deepEqual(paginateArchive(entries, 2).posts, entries.slice(10, 20));
  assert.deepEqual(paginateArchive(entries, 3).posts, [21]);
  assert.equal(paginateArchive(entries, 2).offset, 10);
  assert.equal(paginateArchive(entries).pageCount, 3);
  assert.equal(paginateArchive(entries).total, 21);
});
test('empty and exact-size lists have one page; invalid pages are rejected', () => {
  assert.equal(paginateArchive([]).pageCount, 1);
  assert.equal(paginateArchive(Array(10)).pageCount, 1);
  for (const value of [0, -1, 1.5, NaN, 2]) assert.throws(() => paginateArchive([], value));
  assert.equal(archiveUrl(1), '/posts#all-posts');
  assert.equal(archiveUrl(2), '/posts/page/2#all-posts');
});
test('selectable page sizes slice correctly and remain in navigation URLs', () => {
  const entries = Array.from({ length: 105 }, (_, i) => i + 1);
  for (const size of [10, 20, 50, 100]) {
    const first = paginateArchive(entries, 1, size);
    const second = paginateArchive(entries, 2, size);
    assert.equal(first.posts.length, size);
    assert.equal(second.posts[0], size + 1);
    assert.equal(second.offset, size);
    assert.equal(first.pageCount, Math.ceil(105 / size));
  }
  assert.equal(archiveUrl(2, 20), '/posts/size/20/page/2#all-posts');
  for (const size of [0, 15, -1, NaN]) assert.throws(() => paginateArchive(entries, 1, size));
});
