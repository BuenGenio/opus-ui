/*
 * Example Inertia entry for projects using opus-ui.
 *
 * Drop this at resources/js/app.ts. Imports the opus-ui tokens + base styles
 * once at boot, then sets up Inertia as usual.
 */
import 'opus-ui/tokens.css';
import 'opus-ui/styles.css';
import '../css/app.css'; // your own Tailwind entry

import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createApp, h, type DefineComponent } from 'vue';

const appName = import.meta.env.VITE_APP_NAME || 'App';

createInertiaApp({
    title: (title) => (title ? `${title} — ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.vue`,
            import.meta.glob<DefineComponent>('./Pages/**/*.vue'),
        ),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .mount(el);
    },
    progress: { color: '#6366f1' },
});
