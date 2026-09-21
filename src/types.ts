/** ページ間で共有する型定義 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface SeoProps {
  title: string;
  description: string;
  /** 'website' = 通常ページ / 'article' = 記事ページ */
  type?: 'website' | 'article';
  publishedAt?: string | Date;
  updatedAt?: string | Date;
  tags?: string[];
  /** OGP画像のパス。未指定なら /og-default.png */
  image?: string;
  faq?: FaqItem[];
}
