import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/image-generator/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api-proxy': {
            target: 'https://api-aigw.corp.hongsong.club',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api-proxy/, ''),
            secure: true,
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
