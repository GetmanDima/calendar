<template>
    <v-select
        v-model="language"
        :label="t('layout.language')"
        :items="languageOptions"
        :width="150"
        variant="outlined"
        @update:model-value="changeLanguage"
    ></v-select>
</template>

<script setup lang="ts">
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { defaultLanguage, languages } from '@/shared/lib/constants';
import { getCookie } from '@/shared/lib/helpers';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { changeLanguage as apiChangeLanguage } from '../api';

const { locale, t } = useI18n();

const { showErrorAlert } = useGlobalAlert();

const languageOptions = languages.map((language) => ({
    title: language.toUpperCase(),
    value: language,
}));

const language = ref<string | null>(null);

onMounted(() => {
    setLanguageFromCookie();
});

const setLanguageFromCookie = () => {
    language.value = getCookie('language') ?? defaultLanguage;
};

const changeLanguage = async () => {
    if (!language.value) {
        return;
    }

    const response = await apiChangeLanguage(language.value);

    if (response.error) {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));

        return;
    }

    locale.value = language.value;
};
</script>
