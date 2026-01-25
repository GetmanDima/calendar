<template>
    <inertia-head :title="t('register.title')" />
    <div class="flex min-h-screen items-center">
        <content-block>
            <v-tabs v-model="tab" color="primary" class="mb-8">
                <v-tab value="register">{{ t('register.title') }}</v-tab>
                <v-tab value="login">{{ t('login.title') }}</v-tab>
            </v-tabs>

            <register />

            <div class="mt-4 text-right">
                <custom-link href="/login" :text="t('register.already_registered')" />
            </div>
        </content-block>
    </div>
</template>

<script setup lang="ts">
import Register from '@/features/auth/Register';
import GuestLayout from '@/layouts/GuestLayout';
import { redirect } from '@/shared/lib/helpers';
import ContentBlock from '@/shared/ui/ContentBlock';
import CustomLink from '@/shared/ui/Link';
import { Head as InertiaHead } from '@inertiajs/vue3';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
    layout: GuestLayout,
});

const tab = ref('register');

watch(tab, (newTab) => {
    if (newTab === 'login') {
        redirect('/login');
    }
});
</script>
