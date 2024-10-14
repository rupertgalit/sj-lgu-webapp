import { fileURLToPath, URL } from 'node:url';

import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        noDiscovery: true
    },
    plugins: [
        vue(),
        Components({
            resolvers: [PrimeVueResolver()]
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    define: {
        'process.env': {
            API_URL: 'http://sj-lgu-api.test/'
        }
    },
    server: {
        proxy: {
            '^/api/([a-zA-Z0-9/-]+)(/[0-9]+)?$': {
                target: 'http://sj-lgu-api.test/api/',
                headers: {
                    'Content-Type': 'application/json'
                },
                changeOrigin: true,
                rewrite: (path) => {
                    return path.replace(/^\/api/, '');
                }
            }
        }
    }
});
