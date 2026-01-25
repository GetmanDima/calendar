import { insertFieldNameIntoString } from '@/shared/lib/helpers';
import { t } from './i18n';

export default {
    required: (value: string | any[] | Date | null) => {
        if (typeof value === 'string' && !!value.trim()) {
            return true;
        }

        if (Array.isArray(value) && value.length > 0) {
            return true;
        }

        if (value instanceof Date) {
            return true;
        }

        return t('validation.required');
    },

    email: (value: string) => {
        const pattern = /^[a-zA-Zа-яА-Я0-9._%+-]+@[a-zA-Zа-яА-Я0-9.-]+\.[a-zA-Zа-яА-Я]{2,}$/u;

        return pattern.test(value) || t('validation.auth.email');
    },

    name: (fieldName: string) => (value: string) => {
        const pattern = /^[A-Za-zА-Яа-яЁё\s'-]+$/u;

        return value.length === 0 || pattern.test(value) || insertFieldNameIntoString(fieldName, t('validation.auth.name'));
    },

    password: (value: string) => value.length >= 8 || t('validation.auth.password'),

    maxLenght: (length: number) => (value: string) => value.length <= length || t('validation.max_length') + ' ' + length,
};
