import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import { rehypeAnswerReveal } from './src/lib/answer-reveal.ts';

export default defineConfig({
  site: 'https://britliang.top',
  vite: {
    ssr: { noExternal: ['ant-design-vue', '@ant-design/icons-vue', '@ant-design/icons-svg'] },
    plugins: [tailwindcss()],
  },
  integrations: [
    vue(),
    mdx(),
  ],
  markdown: {
    rehypePlugins: [rehypeAnswerReveal],
  },
  devToolbar: {
  enabled: false,
   },
});



