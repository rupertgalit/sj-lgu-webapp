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
        ws: false,
        proxy: {
            // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
            // '/foo': 'http://localhost:5173',
            // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
            '/api': {
                target: 'http://sj-lgu-api.test/api/',
                headers: {
                    contentType: ['application/json', 'text/xml']
                },
                changeOrigin: true,
                rewrite: (path) => {
                    return path.replace(/^\/api/, '');
                }

                // configure: (proxy, options) => {
                //     console.log(proxy, options);
                // }
            }
            // Using the proxy instance
            // '/api': {
            //     target: 'http://jsonplaceholder.typicode.com',
            //     changeOrigin: true,
            //     configure: (proxy, options) => {
            //         // proxy will be an instance of 'http-proxy'
            //     }
            // }
        }
    }
});
