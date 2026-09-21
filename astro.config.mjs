// @ts-check
import { defineConfig } from 'astro/config';

// site は絶対URLの生成（canonical / OGP / sitemap / RSS）に使われる。
// ドメインを変えたらここを直す。
export default defineConfig({
  site: 'https://tsukurite.dev',
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
