import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const run = promisify(execFile);
const prefix = `series-check-${randomUUID()}`;
const topic = `${prefix}-topic`;
const outputParent = path.resolve(root, 'node_modules/.cache');
const output = path.resolve(outputParent, prefix);
const created = [];
const articleId = number => `${prefix}-${number}`;
const readPage = url => readFile(path.join(output, url, 'index.html'), 'utf8');
const articleLinks = html => [...html.matchAll(/class="glass post-row[^\"]*"[^>]*href="([^"]+)"/g)].map(match => match[1]);

async function fixture(relative, content) {
  const filename = path.resolve(root, relative);
  await writeFile(filename, content, { flag: 'wx' });
  created.push(filename);
  return filename;
}
function markdown(number, extra = '') {
  return `---\ntitle: 验证篇章 ${number}\npubDate: 2026-10-01\nseries: ${topic}\nseriesOrder: ${number}\n${extra}---\n\n这是临时测试内容。\n`;
}
async function build(expectedError) {
  let error;
  try {
    await run(process.execPath, ['node_modules/astro/astro.js', 'build', '--outDir', output], {
      cwd: root, windowsHide: true, maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, NO_COLOR: '1', ASTRO_TELEMETRY_DISABLED: '1' },
    });
  } catch (caught) { error = caught; }
  if (expectedError) {
    assert.ok(error, 'Invalid content must fail the build');
    assert.match(`${error.stdout}\n${error.stderr}`, expectedError);
  } else if (error) throw new Error(`${error.stdout}\n${error.stderr}`, { cause: error });
}

try {
  await mkdir(outputParent, { recursive: true });
  await fixture(`src/content/series/${topic}.md`, `---\ntitle: 验证专题\ndescription: 临时集成验证\norder: 99\n---\n`);
  await fixture(`src/content/series/${topic}-empty.md`, '---\ntitle: 验证空专题\ndescription: 临时空目录验证\norder: 100\n---\n');
  for (let number = 1; number <= 31; number++) {
    await fixture(`src/content/posts/${articleId(number)}.md`, markdown(number));
  }
  const draft = await fixture(`src/content/posts/${articleId(32)}.md`, markdown(32, 'draft: true\n'));
  await build();
  const first = await readPage(`posts/series/${topic}`);
  const second = await readPage(`posts/series/${topic}/page/2`);
  assert.deepEqual(articleLinks(first), Array.from({ length: 30 }, (_, i) => `/posts/${articleId(i + 1)}`));
  assert.deepEqual(articleLinks(second), [`/posts/${articleId(31)}`]);
  assert.match(first, new RegExp(`href="/posts/series/${topic}/page/2" rel="next"`));
  assert.match(second, new RegExp(`href="/posts/series/${topic}" rel="prev"`));
  for (const missing of [`posts/series/${topic}/page/1`, `posts/series/${topic}/page/3`, `posts/${articleId(32)}`]) {
    assert.ok(!existsSync(path.join(output, missing, 'index.html')));
  }
  const penultimate = await readPage(`posts/${articleId(30)}`);
  const last = await readPage(`posts/${articleId(31)}`);
  assert.match(penultimate, new RegExp(`href="/posts/${articleId(31)}" rel="next"`));
  assert.match(last, new RegExp(`href="/posts/${articleId(30)}" rel="prev"`));
  assert.doesNotMatch(last, /rel="next"/);
  assert.match(last, /aria-label="当前位置"/);
  const archive = await readPage('posts');
  assert.match(archive, /验证专题/);
  assert.doesNotMatch(archive, new RegExp(articleId(32)));
  const archivePaths = [];
  let archivePage = 1;
  while (existsSync(path.join(output, archivePage === 1 ? 'posts' : `posts/page/${archivePage}`, 'index.html'))) {
    const html = await readPage(archivePage === 1 ? 'posts' : `posts/page/${archivePage}`);
    const links = articleLinks(html);
    assert.ok(links.length <= 10);
    archivePaths.push(...links);
    assert.match(html, /全部文章分页/);
    archivePage++;
  }
  assert.ok(archivePage > 3);
  assert.equal(new Set(archivePaths).size, archivePaths.length);
  for (let number = 1; number <= 31; number++) assert.ok(archivePaths.includes(`/posts/${articleId(number)}`));
  assert.ok(!archivePaths.includes(`/posts/${articleId(32)}`));
  for (const size of [20, 50, 100]) {
    const collected = [];
    const count = Math.ceil(archivePaths.length / size);
    for (let page = 1; page <= count; page++) {
      const html = await readPage(`posts/size/${size}/page/${page}`);
      const links = articleLinks(html);
      assert.ok(links.length <= size);
      collected.push(...links);
    }
    assert.deepEqual(collected, archivePaths);
    assert.ok(!existsSync(path.join(output, `posts/size/${size}/page/${count + 1}/index.html`)));
  }
  const homeLinks = articleLinks(await readPage(''));
  assert.deepEqual(homeLinks, archivePaths.slice(0, 5));
  for (const emptyTopic of [`${topic}-empty`]) {
    const html = await readPage(`posts/series/${emptyTopic}`);
    assert.match(html, /文章正在整理中/);
    assert.doesNotMatch(html, /aria-label="专题目录分页"/);
  }
  console.log('PASS: generated pages, 30/1 pagination, draft exclusion, cross-page navigation, breadcrumbs, original article and empty series');
  if (process.env.CHECK_ARCHIVE_BROWSER === '1') {
    const browserResult = await run(process.execPath, ['tests/series-browser.mjs'], {
      cwd: root, windowsHide: true, maxBuffer: 4 * 1024 * 1024,
      env: { ...process.env, SERIES_TEST_DIST: output },
    });
    console.log(browserResult.stdout);
  }
  const invalid = [
    ['unknown draft reference', markdown(32, 'draft: true\n').replace(`series: ${topic}`, 'series: definitely-missing-series'), /不存在的专题|does not exist/i],
    ['missing paired order', markdown(32, 'draft: true\n').replace('seriesOrder: 32\n', ''), /seriesOrder|同时提供/],
    ['missing paired series', markdown(32, 'draft: true\n').replace(`series: ${topic}\n`, ''), /seriesOrder|同时提供/],
    ['zero order', markdown(0, 'draft: true\n'), /seriesOrder|greater than 0/],
    ['fractional order', markdown(1.5, 'draft: true\n'), /seriesOrder|integer/],
    ['duplicate draft order', markdown(1, 'draft: true\n'), /序号 1 重复/],
  ];
  for (const [name, content, expected] of invalid) {
    await writeFile(draft, content);
    await build(expected);
    console.log(`PASS: rejects ${name}`);
  }
} finally {
  for (const filename of created) await rm(filename, { force: true });
  // Verify the absolute target before recursively deleting this run's output.
  if (path.dirname(output) !== outputParent || path.basename(output) !== prefix) {
    throw new Error('Refusing to remove an unexpected build directory');
  }
  await rm(output, { recursive: true, force: true });
}
