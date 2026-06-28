import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectDir = dirname(fileURLToPath(import.meta.url));
const accessibilityFirstCssPath = resolve(projectDir, '../public/assets/styles.css');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'a11yfirst-shared-css',
      configureServer(server) {
        server.middlewares.use('/assets/styles.css', (_request, response) => {
          response.setHeader('Content-Type', 'text/css; charset=utf-8');
          response.end(readFileSync(accessibilityFirstCssPath, 'utf8'));
        });
      },
      transformIndexHtml() {
        return [
          {
            tag: 'link',
            attrs: {
              rel: 'stylesheet',
              href: './assets/styles.css'
            },
            injectTo: 'head'
          }
        ];
      },
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'assets/styles.css',
          source: readFileSync(accessibilityFirstCssPath, 'utf8')
        });
      }
    }
  ],
  base: './',
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/tests/setup.ts'],
    css: true
  }
});
