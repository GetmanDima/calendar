<template>
    <inertia-head :title="t('login.title')" />
    <div class="flex min-h-screen items-center">
        <content-block>
            <v-tabs v-model="tab" color="primary" class="mb-8">
                <v-tab value="register">{{ t('register.title') }}</v-tab>
                <v-tab value="login">{{ t('login.title') }}</v-tab>
            </v-tabs>

            <login />
            <div class="mt-4 text-right">
                <div>
                    <custom-link href="/forgot-password" :text="t('login.forgot_password')" />
                </div>
                <div>
                    <custom-link href="/register" :text="t('login.not_registered')" />
                </div>
            </div>
        </content-block>
    </div>
</template>

<script setup lang="ts">
import Login from '@/features/auth/Login/ui/Login.vue';
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

const tab = ref('login');

watch(tab, (newTab) => {
    if (newTab === 'register') {
        redirect('/register');
    }
});
</script>
