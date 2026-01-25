<template>
    <inertia-head :title="t('personal_data.title')" />
    <div class="flex min-h-screen items-center">
        <content-block>
            <v-tabs v-model="tab" color="primary" class="mb-8">
                <v-tab value="personal-data">{{ t('personal_data.title') }}</v-tab>
                <v-tab value="email">{{ t('email.title') }}</v-tab>
            </v-tabs>

            <personal-data-update-form class="mb-2" />
        </content-block>
    </div>
</template>

<script setup lang="ts">
import PersonalDataUpdateForm from '@/features/profile/PersonalDataUpdateForm';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { redirect } from '@/shared/lib/helpers';
import ContentBlock from '@/shared/ui/ContentBlock';
import { Head as InertiaHead } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
    layout: AuthenticatedLayout,
});

const tab = ref('personal-data');

watch(tab, (newTab) => {
    if (newTab !== 'personal-data') {
        redirect('/profile/' + newTab);
    }
});
</script>
