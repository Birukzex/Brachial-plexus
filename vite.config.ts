import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          manifest: require('./manifest.json'),
          srcDir: '.',
          filename: 'sw.js',
          strategies: 'injectManifest',
          injectRegister: 'auto',
          workbox: {
            globPatterns: ['**/*.{js,css,html,png,svg,ico,json,ts,tsx}'],
          },
        })
      ],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
