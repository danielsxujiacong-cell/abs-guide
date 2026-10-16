import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const read = (file) => readFileSync(file, 'utf8');
function files(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(resolve(dir, entry.name), extension) : entry.name.endsWith(extension) ? [resolve(dir, entry.name)] : []);
}
const books = JSON.parse(read('src/data/books.json'));
assert.equal(books.length, 4);
assert.ok(books.every((book) => book.chapters.length === 8));
const published = books.flatMap((book) => book.chapters.filter((c) => c.status === 'published'));
assert.equal(published.length, 5);
const markdown = files('src/content/docs', '.md');
const sourceFiles = published.map((c) => `src/content/docs/${c.file}`);
assert.equal(markdown.filter((file) => !file.endsWith('index.md')).length, 5);
for (const file of sourceFiles) {
  assert.ok(existsSync(file), file);
  const current = read(file).replaceAll('\r\n', '\n');
  const original = execFileSync('git', ['show', `c5fa910:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n');
  assert.equal(current, original, `Published article changed: ${file}`);
}
let markdownLinks = 0;
for (const file of [resolve('README.md'), ...markdown]) {
  for (const [, href] of read(file).matchAll(/\[[^\]\n]*\]\(([^)]+)\)/g)) {
    if (/^(?:[a-z]+:|#)/i.test(href)) continue;
    assert.ok(existsSync(resolve(dirname(file), href.split('#')[0])), `${file}: ${href}`);
    markdownLinks++;
  }
}
const htmlFiles = files('dist', '.html');
assert.equal(htmlFiles.length, 13);
const routeFiles = ['index.html', 'books/index.html', 'read/index.html', ...books.map((b) => `${b.id}/index.html`), ...published.map((c) => `${c.file.replace(/\.md$/, '')}/index.html`)];
for (const file of routeFiles) assert.ok(existsSync(resolve('dist',file)),file);
let siteLinks = 0;
for (const file of htmlFiles) {
  const html = read(file);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate IDs: ${file}`);
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(href)) continue;
    assert.ok(!/\.md(?:#|$)/.test(href), `Unconverted Markdown link: ${file}: ${href}`);
    const url = new URL(href.replaceAll('&amp;', '&'), `http://local/${relative(resolve('dist'), file).replaceAll('\\','/').replace(/index\.html$/,'')}`);
    let target = resolve('dist', `.${decodeURIComponent(url.pathname)}`);
    if (!/\.[a-z0-9]+$/i.test(target)) target = resolve(target,'index.html');
    assert.ok(existsSync(target), `${file}: ${href}`);
    if (url.hash && target.endsWith('.html')) assert.ok(read(target).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing heading: ${href}`);
    siteLinks++;
  }
}
for (const book of books) {
  const html = read(`dist/${book.id}/index.html`);
  assert.equal((html.match(/class="chapter-planned"/g)||[]).length, book.chapters.filter((c) => c.status === 'planned').length);
  assert.equal((html.match(/class="volume-intro"/g)||[]).length, 1);
}
assert.ok(existsSync('dist/pagefind/pagefind.js'));
assert.ok(read('dist/index.html').includes('好身材，'));
assert.ok(read('dist/read/index.html').includes('计划中'));
console.log(JSON.stringify({ articlesUnchanged: 5, plannedChapters: 27, markdownLinks, htmlPages: htmlFiles.length, siteLinks, searchIndex: true }, null, 2));
