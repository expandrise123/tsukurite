/**
 * サイトマップを自前生成する。
 * プラグインを使わないのは、中身を理解するため。実質これだけで足りる。
 *
 * 出力先: /sitemap.xml
 */
import type { APIRoute } from 'astro';
import { SITE } from '../consts';
import { posts, escapeXml } from '../lib/posts';

/** 記事以外の固定ページ */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
];

export const GET: APIRoute = () => {
  const now = new Date().toISOString();

  const urls = [
    ...STATIC_PAGES.map(
      (p) => `  <url>
    <loc>${escapeXml(SITE.url + (p.path === '/' ? '' : p.path))}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
    ),
    ...posts.map((p) => {
      const lastmod = new Date(
        p.frontmatter.updatedAt ?? p.frontmatter.publishedAt
      ).toISOString();
      return `  <url>
    <loc>${escapeXml(SITE.url + p.url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }),
  ].join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
