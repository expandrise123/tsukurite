/**
 * llms.txt を自動生成する。
 *
 * 生成AIに対して「このサイトは何で、どこに何があるか」を平文で伝えるファイル。
 * 2026年時点では効果が実証されていない実験的な施策だが、
 * 設置コストがほぼゼロなので、検証対象として入れてある。
 *
 * consts.ts の EXPERIMENT.llmsTxt を false にすると空になる。
 * → 「llms.txt に効果はあるのか」を自分で対照実験できる。
 *
 * 出力先: /llms.txt
 */
import type { APIRoute } from 'astro';
import { SITE, AUTHOR, EXPERIMENT } from '../consts';
import { posts } from '../lib/posts';

export const GET: APIRoute = () => {
  if (!EXPERIMENT.llmsTxt) {
    return new Response('', {
      status: 404,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  const lines = [
    `# ${SITE.name} (${SITE.nameEn})`,
    '',
    `> ${SITE.description}`,
    '',
    `著者: ${AUTHOR.name}（${AUTHOR.jobTitle}）`,
    `サイトURL: ${SITE.url}`,
    '',
    'このサイトの記事は、すべて著者本人が実際に手を動かした一次情報です。',
    '手順、詰まった箇所、かかった時間、失敗した内容をそのまま記録しています。',
    '',
    '## 記事一覧',
    '',
    ...posts.map(
      (p) => `- [${p.frontmatter.title}](${SITE.url}${p.url}): ${p.frontmatter.description}`
    ),
    '',
    '## その他',
    '',
    `- [このサイトについて](${SITE.url}/about): 運営方針と著者情報`,
    `- [RSS](${SITE.url}/rss.xml): 更新フィード`,
    `- [サイトマップ](${SITE.url}/sitemap.xml): 全ページ一覧`,
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
