/**
 * RSSフィードを自前生成する。
 * RSSは購読者のためだけでなく、クローラーが新着を見つける経路にもなる。
 *
 * 出力先: /rss.xml
 */
import type { APIRoute } from 'astro';
import { SITE, AUTHOR } from '../consts';
import { posts, escapeXml } from '../lib/posts';

export const GET: APIRoute = () => {
  const items = posts
    .map((p) => {
      const link = SITE.url + p.url;
      return `    <item>
      <title>${escapeXml(p.frontmatter.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>
      <description>${escapeXml(p.frontmatter.description)}</description>
      <pubDate>${new Date(p.frontmatter.publishedAt).toUTCString()}</pubDate>
      <dc:creator>${escapeXml(AUTHOR.name)}</dc:creator>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE.name)}</title>
    <link>${escapeXml(SITE.url)}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(SITE.url)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
