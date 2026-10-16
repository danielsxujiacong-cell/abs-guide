import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import data from '../data/books.json';

export const repository = 'https://github.com/danielsxujiacong-cell/abs-guide';
export const books = data.map((book) => ({
  ...book,
  href: `/${book.id}/`,
  chapters: book.chapters.map((chapter) => ({
    ...chapter,
    published: chapter.status === 'published' && 'file' in chapter && !!chapter.file &&
      existsSync(resolve(process.cwd(), 'src/content/docs', chapter.file)),
    href: 'file' in chapter && chapter.file ? `/${chapter.file.replace(/\.md$/, '')}/` : null,
  })),
}));
export const chapters = books.flatMap((book) => book.chapters.filter((c) => c.published).map((c) => ({ ...c, book })));
export const firstChapter = chapters[0]!;
export function findChapter(path: string) {
  return chapters.find((chapter) => chapter.href === `${path.replace(/\/$/, '')}/`);
}

export const publicationCounts = {
  total: books.reduce((sum, book) => sum + book.chapters.length, 0),
  published: chapters.length,
  planned: books.reduce((sum, book) => sum + book.chapters.filter((c) => c.status === "planned").length, 0),
};
