import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { once } from 'node:events';

const root = fileURLToPath(new URL('../', import.meta.url));
const cache = path.resolve(root, 'node_modules/.cache');
const profile = path.join(cache, `series-browser-${randomUUID()}`);
const screenshots = path.join(cache, 'series-review');
const dist = path.resolve(root, process.env.SERIES_TEST_DIST ?? 'dist');
const mime = { '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = createServer(async (request, response) => {
  try {
    // Make navigation latency reproducible without depending on the network.
    if (new URL(request.url, 'http://localhost').pathname.replace(/\/$/, '') === '/about') {
      await new Promise(resolve => setTimeout(resolve, 700));
    }
    let filename = path.resolve(dist, `.${decodeURIComponent(new URL(request.url, 'http://localhost').pathname)}`);
    if (filename !== dist && !filename.startsWith(`${dist}${path.sep}`)) throw new Error('Invalid path');
    if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html');
    response.setHeader('Content-Type', mime[path.extname(filename)] ?? 'text/html; charset=utf-8');
    response.end(await readFile(filename));
  } catch { response.writeHead(404).end('Not found'); }
});
await mkdir(screenshots, { recursive: true });
server.listen(0, '127.0.0.1');
await once(server, 'listening');
const base = `http://127.0.0.1:${server.address().port}`;
const browser = spawn(process.env.BROWSER_EXECUTABLE ?? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
  '--headless', '--disable-gpu', '--disable-extensions', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: ['ignore', 'ignore', 'pipe'] });
let socket;
let counter = 0;
const pending = new Map();
const exceptions = [];
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

try {
  const endpoint = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error(`Browser startup timed out: ${output}`)), 20000);
    browser.on('error', error => { clearTimeout(timer); reject(error); });
    browser.stderr.on('data', chunk => {
      output += chunk;
      const match = output.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (match) { clearTimeout(timer); resolve(match[1]); }
    });
  });
  const endpointUrl = new URL(endpoint);
  const target = await fetch(`http://${endpointUrl.host}/json/new?about:blank`, { method: 'PUT' }).then(response => response.json());
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params);
    if (pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id);
      pending.delete(message.id);
      clearTimeout(timer);
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result);
    }
  };
  function command(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++counter;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`${method} timed out`)); }, 15000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  async function navigate(url) {
    await command('Page.navigate', { url: `${base}${url}` });
    for (let attempt = 0; attempt < 50; attempt++) {
      if (await evaluate(`location.pathname === ${JSON.stringify(url)} && (document.readyState === 'complete' || (${JSON.stringify(url)} === '/' && document.readyState === 'interactive'))`)) return;
      await delay(100);
    }
    throw new Error(`Navigation timed out: ${url}; ${await evaluate('JSON.stringify({url:location.href,state:document.readyState,title:document.title})')}`);
  }
  async function hydratePagination() {
    await evaluate("document.querySelector('.archive-pagination').scrollIntoView({behavior: 'instant'})");
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate("!document.querySelector('.archive-pagination').closest('astro-island').hasAttribute('ssr')")) return;
      await delay(100);
    }
    throw new Error(`Pagination did not hydrate: ${JSON.stringify(exceptions)}; ${await evaluate("JSON.stringify({url: location.href, rect: document.querySelector('.archive-pagination').getBoundingClientRect().toJSON(), island: document.querySelector('.archive-pagination').closest('astro-island').outerHTML.slice(0, 1800)})")}`);
  }
  await command('Page.enable');
  await command('Runtime.enable');
  await command('Network.enable');
  // Keep layout checks independent of external font service availability.
  await command('Network.setBlockedURLs', { urls: ['*fonts.googleapis.com*', '*fonts.gstatic.com*'] });
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await navigate('/posts');
  await evaluate(`window.navigationBackground = document.querySelector('.glassy-background');
    window.navigationLoads = 0;
    document.addEventListener('astro:page-load', () => window.navigationLoads++);
    document.querySelector('.top-nav-link[href="/about"]').click()`);
  await delay(450);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('main')).opacity"), '1', 'Keep current content visible while the destination is loading');
  async function waitForRoute(route, loads) {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate(`location.pathname.replace(/\\/$/, '') === ${JSON.stringify(route === '/' ? '' : route)} && window.navigationLoads >= ${loads}`)) return;
      await delay(100);
    }
    throw new Error(`Client navigation did not finish: ${route}`);
  }
  await waitForRoute('/about', 1);
  for (const [index, route] of ['/', '/posts', '/about', '/posts'].entries()) {
    await evaluate(`document.querySelector('.top-nav-link[href="${route}"]').click()`);
    await waitForRoute(route, index + 2);
    assert.ok(await evaluate("window.navigationBackground === document.querySelector('.glassy-background')"), 'Background element survives navigation');
    assert.equal(await evaluate("document.querySelector('.top-nav-link[aria-current=page]').getAttribute('href')"), route);
    await evaluate("window.scrollTo({top: 250, behavior: 'instant'})");
    await delay(100);
    assert.ok(await evaluate("document.querySelector('.site-header').classList.contains('is-scaled')"), 'Scroll handler works after navigation');
  }
  await evaluate('history.back()');
  await waitForRoute('/about', 6);
  await evaluate('history.forward()');
  await waitForRoute('/posts', 7);
  await evaluate("document.querySelector('.post-row').scrollIntoView({block: 'center', behavior: 'instant'})");
  await delay(700);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.post-row')).opacity"), '1', 'Article reveal works after client navigation');
  // The following full-page tests expect a fresh visit at the top of the page.
  await evaluate("window.scrollTo({top: 0, behavior: 'instant'})");
  await delay(100);
  console.log('PASS: slow navigation keeps content visible, persistent background, repeated navigation, scroll, back/forward, article reveal');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate('/posts');
  const currentArticle = await evaluate("document.querySelector('.post-row')?.getAttribute('href')");
  for (const route of ['/', '/posts']) {
    await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await navigate(route);
    await delay(200);
    assert.ok(await evaluate("document.querySelector('.post-row').classList.contains('reveal-pending')"), await evaluate("JSON.stringify({route:location.pathname, y:scrollY, cls:document.querySelector('.post-row').className, rect:document.querySelector('.post-row').getBoundingClientRect().toJSON(), ready:document.readyState, reduced:matchMedia('(prefers-reduced-motion: reduce)').matches})"));
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.post-row')).animationName"), 'none');
    await evaluate("document.querySelector('.post-row').scrollIntoView({block: 'start', behavior: 'instant'})");
    for (let attempt = 0; attempt < 30; attempt++) {
      if (await evaluate("document.querySelector('.post-row').classList.contains('reveal-visible')")) break;
      await evaluate("document.querySelector('.post-row').scrollIntoView({block: 'center', behavior: 'instant'})");
      await delay(100);
    }
    assert.ok(await evaluate("document.querySelector('.post-row').classList.contains('reveal-visible')"), await evaluate("JSON.stringify({ route: location.pathname, rect: document.querySelector('.post-row').getBoundingClientRect().toJSON(), cls: document.querySelector('.post-row').className })"));
    const reveal = await evaluate("Array.from(document.querySelectorAll('.post-row.reveal-visible')).map(el => { const s = getComputedStyle(el); return { name: s.animationName, duration: s.animationDuration, delay: parseFloat(s.animationDelay) }; })");
    reveal.forEach(item => { assert.equal(item.name, 'post-reveal'); assert.equal(item.duration, '0.5s'); assert.ok(Math.abs(item.delay / .08 - Math.round(item.delay / .08)) < .001); });
    await delay(700);
    await evaluate("window.scrollTo({top: 0, behavior: 'instant'})");
    await delay(100);
    assert.ok(await evaluate("document.querySelector('.post-row').classList.contains('reveal-visible')"));
    await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    assert.ok(await evaluate("Array.from(document.querySelectorAll('.post-reveal')).every(el => getComputedStyle(el).animationName === 'none' && getComputedStyle(el).opacity === '1')"));
  }
  console.log('PASS: offscreen rows wait, entering viewport triggers stagger once, reduced motion stays visible');
  const routes = ['/posts', '/posts/series/365-thought-experiments', '/posts/series/island-economics', '/posts/series/rich-dad-poor-dad', ...(currentArticle ? [currentArticle] : [])];
  for (const width of [1440, 390, 320]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 500 });
    for (const route of routes) {
      await navigate(route);
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `Horizontal overflow: ${width} ${route}`);
      assert.ok(await evaluate("document.querySelector('main h1')?.textContent.length > 0"));
    }
    await navigate('/posts');
    const geometry = await evaluate(`(() => {
      const selectors = ['.ant-pagination-item', '.archive-pagination select', '.archive-pagination__jump input', '.archive-pagination__jump button'];
      return selectors.map(selector => { const el = document.querySelector(selector); const rect = el.getBoundingClientRect(); const style = getComputedStyle(el); return { selector, width: rect.width, height: rect.height, background: style.backgroundColor, border: style.borderTopWidth }; });
    })()`);
    for (const control of geometry) {
      assert.equal(control.height, 40, JSON.stringify(control));
      assert.ok(control.width >= 40 && control.width <= 126, JSON.stringify(control));
      assert.notEqual(control.background, 'rgba(0, 0, 0, 0)', JSON.stringify(control));
      assert.equal(control.border, '1px', JSON.stringify(control));
    }
    const columns = await evaluate("getComputedStyle(document.querySelector('.series-overview')).gridTemplateColumns.split(' ').length");
    assert.equal(columns, width > 760 ? 2 : 1);
    if (width !== 320) {
      const metrics = await command('Page.getLayoutMetrics');
      const { data } = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y: 0, width, height: metrics.cssContentSize.height, scale: 1 } });
      await writeFile(path.join(screenshots, `articles-${width}.png`), Buffer.from(data, 'base64'));
    }
    console.log(`PASS: ${width}px, all 5 routes render without horizontal overflow, expected column count`);
  }
  await navigate('/posts');
  await hydratePagination();
  assert.ok(await evaluate("document.querySelector('.ant-pagination') && !document.querySelector('astro-island[ssr]')"));
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.archive-pagination select')).backgroundColor"), 'rgb(24, 43, 44)');
  if (await evaluate("!!document.querySelector('.ant-pagination-item-2 a')")) {
    await evaluate("document.querySelector('.ant-pagination-item-2 a').click()");
    await delay(1000);
    assert.equal(await evaluate('location.pathname'), '/posts/page/2');
    assert.equal(await evaluate('location.hash'), '#all-posts');
    assert.ok(await evaluate("document.querySelectorAll('.post-row').length > 0 && document.querySelectorAll('.post-row').length <= 10"));
    assert.equal(await evaluate("document.querySelector('.post-row .eyebrow').textContent.trim()"), '11');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.archive-pagination__jump input')).backgroundColor"), 'rgb(24, 43, 44)');
    await hydratePagination();
    await evaluate("document.querySelector('.archive-pagination__jump input').focus()");
    await command('Input.insertText', { text: '1' });
    await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
    await delay(1000);
    assert.equal(await evaluate('location.pathname'), '/posts');
    console.log('PASS: hydrated Ant pagination, solid controls, page 2 link, continuous numbering, quick jump to page 1');
  }
  await navigate('/posts');
  assert.equal(await evaluate("document.querySelectorAll('.series-actions .slide-button').length"), await evaluate("document.querySelectorAll('.series-row').length * 2"));
  await delay(500);
  await evaluate("document.querySelector('.archive-pagination').scrollIntoView({behavior: 'instant'})");
  await delay(500);
  await evaluate("const select = document.querySelector('.archive-pagination select'); select.value = '20'; select.dispatchEvent(new Event('change', { bubbles: true }))");
  await delay(1000);
  assert.equal(await evaluate('location.pathname'), '/posts/size/20/page/1');
  assert.ok(await evaluate("document.querySelectorAll('.post-row').length <= 20"));
  assert.ok(await evaluate("document.querySelector('.archive-pagination select').value === '20'"));
  await navigate('/posts/size/20/page/1');
  await delay(500);
  assert.ok(await evaluate("document.querySelector('.archive-pagination select').value === '20'"));
  assert.ok(await evaluate("!!document.querySelector('.archive-pagination__jump input, .archive-single-jumper input')"));
  if (await evaluate("!!document.querySelector('.ant-pagination-item-2 a')")) {
    await evaluate("document.querySelector('.ant-pagination-item-2 a').click()");
    await delay(1000);
    assert.equal(await evaluate('location.pathname'), '/posts/size/20/page/2');
    assert.equal(await evaluate("document.querySelector('.post-row .eyebrow').textContent.trim()"), '21');
  }
  for (const topic of ['365-thought-experiments', 'island-economics', 'rich-dad-poor-dad']) {
    const directory = `/posts/series/${topic}`;
    await navigate(directory);
    await hydratePagination();
    assert.equal(await evaluate("document.querySelector('.archive-pagination').getAttribute('aria-label')"), '专题目录分页');
    if (await evaluate("!!document.querySelector('.ant-pagination-item-2 a')")) {
      await evaluate("document.querySelector('.ant-pagination-item-2 a').click()");
      await delay(1000);
      assert.equal(await evaluate('location.pathname'), `${directory}/page/2`);
      assert.equal(await evaluate("document.querySelector('.post-row .eyebrow').textContent.trim()"), '11');
      await hydratePagination();
      await evaluate("document.querySelector('.archive-pagination__jump input').focus()");
      await command('Input.insertText', { text: '1' });
      await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 });
      await delay(1000);
      assert.equal(await evaluate('location.pathname'), directory);
    }
    for (const size of [20, 50, 100, 10]) {
      await hydratePagination();
      await evaluate(`(() => { const select = document.querySelector('.archive-pagination select'); select.value = '${size}'; select.dispatchEvent(new Event('change', { bubbles: true })); })()`);
      await delay(1000);
      assert.equal(await evaluate('location.pathname'), size === 10 ? directory : `${directory}/size/${size}/page/1`);
      assert.equal(await evaluate("document.querySelector('.archive-pagination select').value"), String(size));
    }
  }
  console.log('PASS: all three series share pagination, page links and quick jump stay in series, all page sizes work');
  async function waitForSearch() {
    for (let attempt = 0; attempt < 100; attempt++) {
      if (await evaluate("document.querySelector('.series-search-toggle')?.disabled === false")) return;
      await delay(100);
    }
    throw new Error('Series search did not hydrate');
  }
  async function searchInput(selector, value) {
    await evaluate(`(() => { const input = document.querySelector(${JSON.stringify(selector)}); input.value = ${JSON.stringify(value)}; input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await delay(100);
  }
  for (const topic of ['365-thought-experiments', 'island-economics', 'rich-dad-poor-dad']) {
    await navigate(`/posts/series/${topic}`);
    await waitForSearch();
    assert.equal(await evaluate("document.querySelector('.series-search-toggle').textContent.trim()"), '');
    assert.equal(await evaluate("document.querySelector('.series-search-panel').getBoundingClientRect().height"), 0);
    await evaluate("document.querySelector('.series-search-toggle').click()");
    await delay(300);
    assert.equal(await evaluate("document.activeElement.type"), 'search');
    assert.ok(await evaluate("document.querySelector('.series-search-panel').getBoundingClientRect().height > 100"));
    const title = await evaluate("document.querySelector('.post-row h2').textContent");
    await searchInput('input[type=search]', title);
    assert.ok(await evaluate("Number(document.querySelector('.series-search-status strong').textContent) > 0"));
    await evaluate("document.querySelector('.series-search-toggle').click()");
    await delay(300);
    assert.equal(await evaluate("document.querySelector('.series-search-panel').getBoundingClientRect().height"), 0);
    assert.equal(await evaluate("document.querySelector('input[type=search]').value"), title);
    await evaluate("document.querySelector('.series-search-toggle').click()");
    await delay(300);
    await searchInput('input[type=search]', '无匹配-unique-search-999');
    assert.equal(await evaluate("document.querySelector('.series-search-status strong').textContent"), '0');
    assert.equal(await evaluate("document.querySelectorAll('.archive-pagination').length"), 0);
    await evaluate("document.querySelector('.series-search-clear').click()");
    assert.equal(await evaluate("document.querySelector('input[type=search]').value"), '');
    assert.equal(await evaluate('location.search'), '');
  }
  await navigate('/posts/series/365-thought-experiments');
  await waitForSearch();
  await evaluate("document.querySelector('.series-search-toggle').click()");
  await delay(300);
  await searchInput('input[type=search]', '思想实验');
  assert.equal(await evaluate("document.querySelector('.series-search-status strong').textContent"), '12');
  await evaluate("document.querySelector('.ant-pagination-item-2 a').click()");
  await delay(300);
  assert.equal(await evaluate("new URLSearchParams(location.search).get('page')"), '2');
  assert.equal(await evaluate("document.querySelector('.post-row .eyebrow').textContent"), '11');
  const searchLocation = await evaluate('location.href');
  await command('Page.reload');
  await delay(700);
  await waitForSearch();
  assert.equal(await evaluate('location.href'), searchLocation);
  assert.equal(await evaluate("document.querySelector('input[type=search]').value"), '思想实验');
  assert.equal(await evaluate("document.querySelector('.post-row .eyebrow').textContent"), '11');
  await searchInput('input[type=date]', '2026-05-29');
  assert.equal(await evaluate("document.querySelector('.series-search-status strong').textContent"), '1', 'A single start date searches that day');
  await searchInput('label:nth-child(3) input[type=date]', '2026-05-29');
  assert.equal(await evaluate("new URLSearchParams(location.search).get('page')"), '1');
  assert.equal(await evaluate("document.querySelector('.series-search-status strong').textContent"), '1');
  await searchInput('input[type=date]', '');
  assert.equal(await evaluate("document.querySelector('.series-search-status strong').textContent"), '1', 'A single end date searches that day');
  await evaluate("document.querySelector('.series-search-actions button').click()");
  await searchInput('input[type=search]', '思想实验');
  await evaluate("const size = document.querySelector('.archive-pagination select'); size.value = '20'; size.dispatchEvent(new Event('change', { bubbles: true }))");
  await delay(200);
  assert.equal(await evaluate("document.querySelectorAll('.post-row').length"), 12);
  assert.equal(await evaluate("new URLSearchParams(location.search).get('q')"), '思想实验');
  for (const width of [1440, 390, 320]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 500 });
    await delay(300);
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `Search overflow at ${width}`);
    if (width === 1440) {
      await evaluate("document.querySelector('.series-tools').scrollIntoView({behavior: 'instant', block: 'center'})");
      const { data } = await command('Page.captureScreenshot', { format: 'png' });
      await writeFile(path.join(screenshots, 'series-search-desktop.png'), Buffer.from(data, 'base64'));
    }
  }
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.series-search-panel')).transitionDuration"), '0s');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  assert.ok((await evaluate("getComputedStyle(document.querySelector('.series-search-panel')).transitionDuration")).includes('0.25s'));
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.series-search-toggle')).color"), 'rgb(255, 255, 255)');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  console.log('PASS: icon-only search in all series, open/focus/collapse/clear, no results, date boundaries, preserved filters across pagination and reload, responsive search and reduced motion');
  await navigate('/');
  assert.equal(await evaluate("document.querySelectorAll('.latest-notes .post-row').length"), 5);
  console.log('PASS: 20/page selection, persisted URL, numbering, visible quick jumper, latest 5 homepage posts');
  await navigate('/posts');
  assert.equal(await evaluate("document.querySelectorAll('a a, a button').length"), 0);
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.slide-button')).fontSize"), '16px');
  await evaluate("document.querySelector('.series-summary h3 a').focus()");
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.ok(await evaluate("document.activeElement.matches('.slide-button:focus-visible')"));
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.slide-button__alternate')).opacity"), '1');
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await evaluate("document.documentElement.style.setProperty('--slide-button-duration', '123ms')");
  assert.ok(await evaluate("Array.from(document.querySelectorAll('.slide-button__labels .slide-button__initial')).every(el => getComputedStyle(el).transitionDuration.split(',')[0] === '0.123s')"));
  await evaluate("document.documentElement.style.removeProperty('--slide-button-duration')");
  await command('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate("getComputedStyle(document.querySelector('.slide-button__initial')).transitionDuration"), '0s');
  await navigate('/posts');
  await command('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  await command('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
  assert.ok(await evaluate("document.activeElement.tagName === 'A' && getComputedStyle(document.activeElement).outlineStyle !== 'none'"));
  await evaluate("document.querySelector('.series-actions a').click()");
  await delay(500);
  assert.equal(await evaluate('location.pathname'), '/posts/series/365-thought-experiments');
  await evaluate("document.querySelector('.series-back-action a').click()");
  await delay(500);
  assert.equal(await evaluate('location.pathname'), '/posts');
  await evaluate("document.querySelectorAll('.series-actions a')[1].click()");
  await delay(500);
  assert.equal(await evaluate('location.pathname'), '/posts/series/365-thought-experiments');
  assert.equal(exceptions.length, 0, JSON.stringify(exceptions));
  console.log('PASS: both SlideButton links, no nested links, 16px labels, keyboard animation, shared animation variable, reduced motion, no browser exceptions');
  console.log(`Screenshots: ${screenshots}`);
  await command('Browser.close');
} finally {
  socket?.close();
  browser.kill();
  server.closeAllConnections();
  server.close();
  await delay(1000);
  if (path.dirname(profile) !== cache || !path.basename(profile).startsWith('series-browser-')) throw new Error('Invalid profile cleanup path');
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 500 });
}

