import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { gunzipSync } from 'node:zlib';

const read = (file) => readFileSync(file, 'utf8');
function files(dir, extension) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(resolve(dir, entry.name), extension) : entry.name.endsWith(extension) ? [resolve(dir, entry.name)] : []);
}
const books = JSON.parse(read('src/data/books.json'));
assert.equal(books.length, 4);
assert.ok(books.every((book) => book.chapters.length === 8));
const published = books.flatMap((book) => book.chapters.filter((c) => c.status === 'published'));
const planned = books.flatMap((book) => book.chapters.filter((c) => c.status === 'planned'));
const allChapters = books.flatMap((book) => book.chapters);
assert.equal(published.length + planned.length, allChapters.length, 'Unknown chapter status');
assert.equal(new Set(books.map((b) => b.id)).size, books.length);
for (const book of books) {
  assert.deepEqual(book.chapters.map((c) => c.number), [1,2,3,4,5,6,7,8]);
  for (const c of book.chapters) {
    if (c.status === 'published') assert.ok(c.file?.startsWith(`${book.id}/`) && !c.file.includes('..') && c.file.endsWith('.md'), c.title);
    else assert.ok(!c.file, `Planned chapter must not have a clickable file: ${c.title}`);
  }
}
const markdown = files('src/content/docs', '.md');
const sourceFiles = published.map((c) => `src/content/docs/${c.file}`);
assert.equal(new Set(sourceFiles).size, sourceFiles.length, 'Duplicate published file');
assert.deepEqual(markdown.filter((file) => !file.endsWith('index.md')).sort(), sourceFiles.map((f) => resolve(f)).sort(), 'Unregistered or missing article');
for (const file of sourceFiles) {
  assert.ok(existsSync(file), file);
  const text = read(file);
  const chapter = published.find((c) => file.endsWith(c.file));
  assert.ok(text.startsWith('---\n') || text.startsWith('---\r\n'), `Frontmatter: ${file}`);
  assert.ok(text.includes(`title: "${String(chapter.number).padStart(2, '0')} ${chapter.title}"`), `Title: ${file}`);
  assert.match(text, /description: "[^"\n]+"/);
  assert.match(text, new RegExp(`sidebar:\\r?\\n  order: ${chapter.number}\\r?\\n`));
  assert.ok(text.includes('## 参考资料'), `References: ${file}`);
}
// The immutable Step 1 corpus is derived from its Git tree, not today's published list.
const baselineFiles = execFileSync('git', ['ls-tree', '-r', '--name-only', 'c5fa910', 'src/content/docs'], { encoding: 'utf8' }).trim().split('\n').filter((f) => f.endsWith('.md') && !f.endsWith('index.md'));
assert.ok(baselineFiles.length > 0);
for (const file of baselineFiles) {
  const current = read(file).replaceAll('\r\n', '\n');
  const original = execFileSync('git', ['show', `c5fa910:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n');
  assert.equal(current, original, `Published article changed: ${file}`);
}
// Protect the complete V0.4 corpus during the V0.5 expansion.
const priorBooks = JSON.parse(execFileSync('git', ['show', 'eb740d25a6d2334d43b4c7675d376b8651bc49aa:src/data/books.json'], { encoding: 'utf8' }));
const priorArticles = priorBooks.flatMap((b) => b.chapters.filter((c) => c.status === 'published'));
for (const c of priorArticles) {
  const file = `src/content/docs/${c.file}`;
  assert.equal(read(file).replaceAll('\r\n', '\n'), execFileSync('git', ['show', `eb740d25a6d2334d43b4c7675d376b8651bc49aa:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n'), `V0.4 article changed: ${file}`);
}
// Keep the earlier guards and also protect all articles published before V0.6.
const v05Ref = 'ed5ed7f4b55ca17c085a2c6d8675dd7bbed39a38';
const v05Books = JSON.parse(execFileSync('git', ['show', `${v05Ref}:src/data/books.json`], { encoding: 'utf8' }));
const v05Articles = v05Books.flatMap((b) => b.chapters.filter((c) => c.status === 'published'));
for (const c of v05Articles) {
  const file = `src/content/docs/${c.file}`;
  assert.equal(read(file).replaceAll('\r\n', '\n'), execFileSync('git', ['show', `${v05Ref}:${file}`], { encoding: 'utf8' }).replaceAll('\r\n', '\n'), `V0.5 article changed: ${file}`);
}
const faviconPath = '/favicon-flex-v060.svg';
const favicon = read(`public${faviconPath}`);
assert.ok(favicon.includes('💪') && !favicon.includes('>A.</text>'), 'Flex emoji favicon');
assert.equal(read('public/favicon.svg'), favicon, 'Legacy icon path must not serve the old logo');
let markdownLinks = 0;
for (const file of [resolve('README.md'), resolve('sources/references.md'), ...markdown]) {
  for (const [, href] of read(file).matchAll(/\[[^\]\n]*\]\(([^)]+)\)/g)) {
    if (/^https?:/i.test(href)) {
      const url = new URL(href);
      assert.ok(url.protocol === 'https:' && url.hostname.includes('.') && !url.username && !url.password, `Reference URL: ${href}`);
      continue;
    }
    if (/^(?:[a-z]+:|#)/i.test(href)) continue;
    assert.ok(existsSync(resolve(dirname(file), href.split('#')[0])), `${file}: ${href}`);
    markdownLinks++;
  }
}
const htmlFiles = files('dist', '.html');
const routeFiles = ['index.html', 'books/index.html', 'read/index.html', ...books.map((b) => `${b.id}/index.html`), ...published.map((c) => `${c.file.replace(/\.md$/, '')}/index.html`)];
assert.deepEqual(htmlFiles.map((f) => relative(resolve('dist'), f).replaceAll('\\', '/')).sort(), [...routeFiles, '404.html'].sort(), 'Unexpected or missing built routes');
for (const file of routeFiles) assert.ok(existsSync(resolve('dist',file)),file);
let siteLinks = 0;
for (const file of htmlFiles) {
  const html = read(file);
  const iconLinks = [...html.matchAll(/<link\b[^>]*\brel="(?:shortcut )?icon"[^>]*>/g)].map((m) => m[0]);
  assert.equal(iconLinks.length, 1, `Single favicon: ${file}`);
  assert.ok(iconLinks[0].includes(`href="${faviconPath}"`) && iconLinks[0].includes('image/svg+xml'), `Versioned SVG favicon: ${file}`);
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
  for (const c of book.chapters) {
    const label = `${String(c.number).padStart(2,'0')} ${c.title}`;
    for (const file of ['README.md', 'src/content/docs/index.md', `src/content/docs/${book.id}/index.md`]) {
      const line = read(file).split('\n').find((line) => line.startsWith('- ') && line.includes(label));
      assert.ok(line, `Missing catalog entry: ${file}: ${label}`);
      assert.ok(line.includes(c.status === 'published' ? '已发布' : '计划中'), `Catalog status: ${file}: ${label}`);
      assert.equal(line.includes(']('), c.status === 'published', `Catalog clickability: ${file}: ${label}`);
      if (c.status === 'published') assert.ok(line.includes(file.endsWith(`${book.id}/index.md`) ? c.file.split('/')[1] : c.file), `Catalog destination: ${file}`);
    }
    if (c.status === 'planned') {
      for (const anchor of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g)) assert.ok(!anchor[0].includes(c.title), `Clickable planned chapter: ${c.title}`);
    }
  }
}
for (const [i, c] of published.entries()) {
  const html = read(`dist/${c.file.replace(/\.md$/, '')}/index.html`);
  assert.ok(html.includes(`https://github.com/danielsxujiacong-cell/abs-guide/blob/main/src/content/docs/${c.file}`), `GitHub source: ${c.file}`);
  for (const [rel, neighbor] of [['prev', published[i-1]], ['next', published[i+1]]]) {
    if (neighbor) assert.ok(html.includes(`href="/${neighbor.file.replace(/\.md$/, '')}/" rel="${rel}"`), `Pagination ${rel}: ${c.file}`);
  }
}
for (const name of ['02-push-ups', '03-pull-ups', '04-dips']) {
  const text = read(`src/content/docs/volume-03/${name}.md`);
  const fields = ['动作名称','难度','目标肌群','起始姿势','动作过程','常见错误','下一难度'];
  assert.ok(text.includes(`| ${fields.join(' | ')} |`), `Seven-column movement table: ${name}`);
}
assert.ok(existsSync('dist/pagefind/pagefind.js'));
assert.ok(files('dist/pagefind', '.pf_index').length > 0, 'Search index shards missing');
const searchEntry = JSON.parse(read('dist/pagefind/pagefind-entry.json'));
assert.equal(searchEntry.languages['zh-cn']?.page_count, markdown.length, 'Chinese search page count');
const fragments = files('dist/pagefind', '.pf_fragment').map((f) => JSON.parse(gunzipSync(readFileSync(f)).toString().replace(/^pagefind_dcd/, '')));
for (const c of published) {
  const fragment = fragments.find((f) => f.url === `/${c.file.replace(/\.md$/, '')}/`);
  assert.ok(fragment, `Not indexed: ${c.file}`);
  assert.ok(fragment.content.replaceAll('\u200b', '').includes(c.title), `Search title: ${c.file}`);
}
for (const route of ['books', 'read']) {
  const html = read(`dist/${route}/index.html`);
  assert.ok(html.includes(`${allChapters.length} 章规划`), `Total count: ${route}`);
  assert.ok(html.includes(route === 'books' ? `已发布 ${published.length} 章` : `${published.length} 章已发布`), `Published count: ${route}`);
  assert.ok(html.includes(`${planned.length} 章计划中`), `Planned count: ${route}`);
}
assert.ok(read('dist/index.html').includes('好身材，'));
assert.equal(read('dist/read/index.html').includes('class="chapter-planned"'), planned.length > 0);
console.log(JSON.stringify({ publishedArticles: published.length, articlesUnchanged: v05Articles.length, plannedChapters: planned.length, markdownLinks, htmlPages: htmlFiles.length, siteLinks, searchIndex: true, faviconPages: htmlFiles.length }, null, 2));
