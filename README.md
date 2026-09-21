# つくりて / Tsukurite

`tsukurite.dev` のソース。Astro + Cloudflare Pages、外部プラグインなし。

---

## 1. 起動する

Node.js 18以上が必要です（`node -v` で確認）。

```bash
npm install
npm run dev
```

`http://localhost:4321` が開きます。ファイルを保存すると自動で再読み込みされます。

```bash
npm run build     # dist/ に本番用ファイルを出力
npm run preview   # ビルド結果をローカルで確認
```

---

## 2. 最初にやること

`src/consts.ts` を開いて、以下を埋めてください。**ここが空のままだと構造化データが機能しません。**

```ts
export const AUTHOR = {
  name: 'あなたの名前',        // ← 必須。実名または一貫した筆名
  jobTitle: 'B2Bマーケター',   // ← 専門性の明示。E-E-A-Tに直結
  sameAs: [                    // ← SNSのURL。AIが同一人物と紐づける手がかり
    'https://x.com/yourhandle',
  ],
};
```

あわせて `src/pages/about.astro` の中身も書き換えます。**著者情報の厚さが、そのままAIからの信頼度になります。**

---

## 3. ファイル構成

```
src/
├── consts.ts              サイト設定と実験スイッチ（まずここを見る）
├── types.ts               共有の型定義
├── lib/posts.ts           記事一覧の取得ロジック
├── components/
│   ├── Seo.astro          ★ メタタグとJSON-LD構造化データの心臓部
│   ├── Header.astro
│   └── Footer.astro
├── layouts/
│   ├── BaseLayout.astro   全ページ共通の骨格
│   └── PostLayout.astro   記事ページ（要約ブロック・FAQ）
├── pages/
│   ├── index.astro        記事一覧
│   ├── about.astro
│   ├── blog/*.md          ★ 記事はここに置く
│   ├── sitemap.xml.ts     サイトマップ自動生成
│   ├── rss.xml.ts         RSS自動生成
│   └── llms.txt.ts        llms.txt自動生成
└── styles/global.css      デザイントークンと全体スタイル

public/                    そのまま配信されるファイル
├── robots.txt
└── favicon.svg
```

---

## 4. 記事を書く

`src/pages/blog/_template.md` をコピーして、`_` を外したファイル名で保存するだけです。

```
src/pages/blog/gas-line-bot.md  →  https://tsukurite.dev/blog/gas-line-bot
```

ファイル名がそのままURLになります。**英数字とハイフンのみ**にしてください。

### frontmatter の項目

| 項目 | 必須 | 役割 |
|---|:--:|---|
| `layout` | ● | `../../layouts/PostLayout.astro` 固定 |
| `title` | ● | 記事タイトル。`<h1>` と JSON-LD の headline になる |
| `description` | ● | 検索結果とAI要約に出る説明文。80〜120文字 |
| `summary` | | 冒頭の結論ブロック。**AIが最初に読む場所** |
| `publishedAt` | ● | 公開日（`2026-09-21` 形式） |
| `updatedAt` | | 更新日。更新したら必ず入れる |
| `tags` | | タグの配列 |
| `faq` | | `q`/`a` の配列。**FAQPage構造化データになる** |
| `draft` | | `true` で一覧・サイトマップ・RSSから除外 |

### 書き方のルール

1. **結論を最初の1〜2文で言い切る**
2. **見出し階層を飛ばさない**（`##` → `###` → `####`）
3. **一次情報を必ず1つ以上入れる**（実測時間、費用、エラー全文、失敗した内容）
4. **比較は表にする**（AIが抽出しやすい）

3番が最重要です。これが無い記事は、AIが自分で書けてしまうので引用されません。

---

## 5. AI検索対策の対照実験

`src/consts.ts` の `EXPERIMENT` が実験用スイッチです。

```ts
export const EXPERIMENT = {
  jsonLd: true,        // 構造化データを出力するか
  llmsTxt: true,       // llms.txt を出力するか
  summaryBlock: true,  // 結論ファーストの要約ブロックを出すか
  faqSchema: true,     // FAQ構造化データを出力するか
};
```

`false` にして再ビルドすると、その施策だけを外したサイトになります。

### 実験の手順

1. 全部 `true` で公開する
2. 想定される質問リストを決めて、ChatGPT / Claude / Gemini に毎週投げて**引用されたか記録する**
3. 1ヶ月後、`jsonLd` を `false` にして再ビルド
4. さらに1ヶ月計測して、差分を記事にする

**「構造化データはAI引用に効くのか」「llms.txt に意味はあるのか」の実測データは、現時点で誰も公開していません。** そこが狙いどころです。

計測用の質問リストは、別ファイルに書き出して管理してください。

---

## 6. Cloudflare Pages にデプロイ

### 6-1. GitHubにpush

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/<あなた>/tsukurite.git
git push -u origin main
```

### 6-2. Cloudflare Pagesと接続

1. Cloudflareダッシュボード → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. リポジトリを選択
3. ビルド設定:

| 項目 | 値 |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |

4. **Save and Deploy**

### 6-3. 独自ドメインを割り当て

Pages のプロジェクト → **Custom domains** → **Set up a custom domain** → `tsukurite.dev`

Cloudflareでドメインを取得しているので、DNSは自動設定されます。

以降は **`git push` するたびに自動デプロイ**されます。

---

## 7. 公開後に確認すること

| 確認項目 | 方法 |
|---|---|
| 構造化データが正しいか | [Schema Markup Validator](https://validator.schema.org/) にURLを入れる |
| リッチリザルト対応 | [リッチリザルトテスト](https://search.google.com/test/rich-results) |
| 表示速度 | [PageSpeed Insights](https://pagespeed.web.dev/) |
| インデックス状況 | Google Search Console にサイト登録 → サイトマップ送信 |
| 生成物の確認 | `/sitemap.xml` `/rss.xml` `/llms.txt` `/robots.txt` を直接開く |

**Search Console の登録は公開直後にやってください。** インデックスされるまでの日数も記事のネタになります。

---

## 8. 次に手を入れるとよい場所

- **OGP画像**: `public/og-default.png`（1200×630px）を置く。現在は未配置
- **記事ごとのOGP画像**: frontmatter の `image` で個別指定できる
- **目次（TOC）**: 長い記事では `PostLayout.astro` に見出しリストを追加
- **コンテンツコレクション**: 記事が増えたら Astro の Content Collections に移行すると frontmatter の型チェックが効く

---

## メモ

- ランニングコストはドメイン代のみ（Cloudflare Pagesは無料枠で十分）
- 外部プラグインを使っていないので、Astroのバージョンアップで壊れにくい
- sitemap / RSS / llms.txt は全部 `src/pages/` の `.ts` ファイルが生成している。中身を読めば仕組みが分かる
