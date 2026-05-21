import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const stripCrossoriginOnStylesheet = () => ({
  name: 'strip-crossorigin-stylesheet',
  transformIndexHtml(html) {
    return html.replace(/<link\s+[^>]*?>/g, (tag) =>
      tag.includes('rel="stylesheet"')
        ? tag.replace(/\s+crossorigin(?:="[^"]*")?/g, '')
        : tag,
    );
  },
});

export default defineConfig({
  plugins: [react(), stripCrossoriginOnStylesheet()],
  base: './',
});
