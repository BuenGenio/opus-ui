/*
 * Example Vite config for a Laravel + Inertia + Vue 3 project using opus-ui.
 *
 * Drop this at the project root as `vite.config.js`. The Smart-TV-safe
 * build target mirrors OpusOS's own — feel free to bump if you don't need
 * to support older TV browsers.
 */
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    // Smart-TV reach: older Tizen/webOS Chromium (~69+) can't parse newer
    // syntax — esbuild down-levels to this baseline at build time.
    build: {
        target: ['es2019', 'chrome69', 'edge79', 'firefox68', 'safari12'],
        cssTarget: ['chrome69', 'safari12'],
    },
    plugins: [
        laravel({
            input: 'resources/js/app.ts',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: { base: null, includeAbsolute: false },
            },
        }),
    ],
});
