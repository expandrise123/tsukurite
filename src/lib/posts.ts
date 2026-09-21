/**
 * 記事一覧の取得。一覧ページ・RSS・サイトマップ・llms.txt が全部これを使う。
 *
 * import.meta.glob は Vite の機能で、ビルド時にファイルをまとめて読み込む。
 * src/pages/blog/ に .md を置くだけで自動的に記事として認識される。
 */

export interface PostFrontmatter {
  title: string;
  description: string;
  summary?: string;
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  faq?: { q: string; a: string }[];
  image?: string;
  /** true にすると一覧・サイトマップ・RSS から除外される（下書き用） */
  draft?: boolean;
}

export interface Post {
  url: string;
  frontmatter: PostFrontmatter;
}

const modules = import.meta.glob<{ frontmatter: PostFrontmatter; url?: string }>(
  '../pages/blog/*.md',
  { eager: true }
);

export const posts: Post[] = Object.values(modules)
  .filter((m) => m.url && !m.frontmatter.draft)
  .map((m) => ({ url: m.url as string, frontmatter: m.frontmatter }))
  .sort(
    (a, b) =>
      new Date(b.frontmatter.publishedAt).getTime() -
      new Date(a.frontmatter.publishedAt).getTime()
  );

/** XML に文字列を埋め込むときのエスケープ */
export const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const formatDate = (d: string | Date) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(d));
