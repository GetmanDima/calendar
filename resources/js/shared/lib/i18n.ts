import { createI18n, I18n } from 'vue-i18n';
import { defaultLanguage } from './constants';
import { getCookie } from './helpers';

const initI18n = (): I18n => {
    const i18n = createI18n({
        legacy: false,
        locale: getCookie('language') ?? defaultLanguage,
        fallbackLocale: 'en',
        messages: {},
    });

    return i18n;
};

const loadLangFiles = (i18n: I18n) => {
    const messages: { [lang: string]: any } = {};
    const langFiles: { [path: string]: any } = import.meta.glob('../../lang/*/*.json', { eager: true });

    for (const path in langFiles) {
        const matches = path.match(/\/lang\/([^/]+)\/([^/]+)\.json$/);
        const [, lang, filename] = matches ?? [];

        if (!lang || !filename) {
            continue;
        }

        messages[lang] = messages[lang] ?? {};
        messages[lang][filename] = langFiles[path].default || langFiles[path];
    }

    for (const lang in messages) {
        i18n.global.setLocaleMessage(lang, messages[lang]);
    }
};

const i18n = initI18n();
loadLangFiles(i18n);

export default i18n;
export const t: (key: string) => string = i18n.global.t;
