/**
 * サイト全体の設定。ここだけ直せば全ページに反映される。
 */
export const SITE = {
  /** サイト名（日本語表記） */
  name: 'つくりて',
  /** サイト名（英語表記・ドメインと揃える） */
  nameEn: 'Tsukurite',
  /** 本番URL（末尾スラッシュなし） */
  url: 'https://tsukurite.dev',
  /** サイトの説明。検索結果とAIの要約に使われるので、1〜2文で言い切る */
  description:
    '非エンジニアがAIを使って業務ツールとWebサイトを自作する記録。作った手順、詰まった箇所、かかった時間をそのまま公開しています。',
  lang: 'ja',
  locale: 'ja_JP',
} as const;

/**
 * 著者情報。JSON-LD の author / publisher に使われる。
 * E-E-A-T（経験・専門性・権威性・信頼性）の土台なので、必ず埋めること。
 */
export const AUTHOR = {
  name: 'つくりて',
  /** 肩書き。専門性の明示に効く */
  jobTitle: 'B2Bマーケター',
  /** プロフィールページ */
  url: `${SITE.url}/about`,
  /** SNS等のプロフィールURL。AIが同一人物と紐づける手がかりになる */
  sameAs: [
    // 'https://x.com/yourhandle',
    // 'https://github.com/yourhandle',
  ] as string[],
} as const;

/** ナビゲーション */
export const NAV = [
  { href: '/', label: 'ホーム' },
  { href: '/about', label: 'このサイトについて' },
] as const;

/**
 * ── AI検索対策の対照実験スイッチ ──
 *
 * ここを false にしてビルドすると、その施策だけを外したサイトが出力される。
 * 「構造化データはAI引用に効くのか」を自分で実測するための仕組み。
 *
 * 使い方の例:
 *   1. 全部 true で公開 → 1ヶ月AI引用を計測
 *   2. jsonLd を false にして再ビルド → もう1ヶ月計測
 *   3. 差分を記事にする（この実測データは誰も持っていない）
 */
export const EXPERIMENT = {
  /** JSON-LD 構造化データを出力する */
  jsonLd: true,
  /** llms.txt を出力する */
  llmsTxt: true,
  /** 記事冒頭に結論ファーストの要約ブロックを出す */
  summaryBlock: true,
  /** FAQ の構造化データを出力する */
  faqSchema: true,
} as const;
