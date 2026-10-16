import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import books from './src/data/books.json' with { type: 'json' };
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Transform links for the website only; source Markdown keeps its GitHub links.
function githubMarkdownLinks() {
  return (tree, file) => {
    const source = file.history?.[0] || '';
    const walk = (node) => {
      if (node.type === 'link' && node.url && !/^(?:[a-z]+:|#|\/)/i.test(node.url)) {
        const target = new URL(node.url, `file://${source.replaceAll('\\', '/')}`);
        const path = decodeURIComponent(target.pathname).replaceAll('\\', '/');
        const marker = '/src/content/docs/';
        if (path.includes(marker) && path.endsWith('.md')) {
          let route = path.split(marker)[1].replace(/\.md$/, '').replace(/(?:^|\/)index$/, '');
          node.url = `/${route || 'read'}/${target.hash}`;
        } else if (path.includes('/abs-guide/')) {
          node.url = `https://github.com/danielsxujiacong-cell/abs-guide/blob/main/${path.split('/abs-guide/')[1]}${target.hash}`;
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export default defineConfig({
  site: 'https://abs.danielxu.cn',
  output: 'static',
  trailingSlash: 'always',
  markdown: { remarkPlugins: [githubMarkdownLinks] },
  integrations: [starlight({
    title: 'ABS GUIDE',
    description: '免费开源的中文街头健身指南。',
    defaultLocale: 'root',
    locales: { root: { label: '简体中文', lang: 'zh-CN' } },
    customCss: ['./src/styles/site.css'],
    favicon: '/favicon.svg',
    routeMiddleware: './src/route-data.ts',
    social: [{ icon: 'github', label: 'GitHub 开源书籍', href: 'https://github.com/danielsxujiacong-cell/abs-guide' }],
    components: {
      SiteTitle: './src/components/SiteTitle.astro',
      Footer: './src/components/ReaderFooter.astro',
      Pagination: './src/components/ChapterPagination.astro',
      MarkdownContent: './src/components/MarkdownContent.astro',
    },
    sidebar: [
      { label: '首页', link: '/' },
      { label: '书架', link: '/books/' },
      { label: '全书目录', slug: 'read' },
      ...books.map((book) => ({
        label: `第${['一','二','三','四'][book.number-1]}册 · ${book.title}`,
        items: [
          { label: '本册目录', link: `/${book.id}/` },
          ...book.chapters.filter((c) => c.status === 'published' && c.file && existsSync(fileURLToPath(new URL(`./src/content/docs/${c.file}`, import.meta.url)))).map((c) => ({ label: `${String(c.number).padStart(2,'0')} ${c.title}`, link: `/${c.file.replace(/\.md$/, '')}/` })),
        ],
      })),
    ],
  })],
});
