import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import '../css/app.css';

import i18n from '@/shared/lib/i18n';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp, h } from 'vue';
import { createVuetify } from 'vuetify';

const appName = import.meta.env.VITE_APP_NAME || 'Calendar';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(App, props) })
            .use(
                createVuetify({
                    theme: {
                        defaultTheme: 'dark',
                    },
                }),
            )
            .use(i18n)
            .use(plugin)
            .mount(el);
    },
});
