<template>
    <inertia-head :title="t('password_reset.title')" />
    <div class="flex min-h-screen items-center">
        <content-block>
            <password-reset :token="token" :email="email" class="mt-4" />

            <div class="mt-4 text-right">
                <custom-link href="/login" :text="t('password_reset.back_to_login')" />
            </div>
        </content-block>
    </div>
</template>

<script setup lang="ts">
import PasswordReset from '@/features/auth/PasswordReset';
import GuestLayout from '@/layouts/GuestLayout';
import ContentBlock from '@/shared/ui/ContentBlock';
import CustomLink from '@/shared/ui/Link';
import { Head as InertiaHead } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';
import { getEmailFromUrl, getTokenFromUrl } from './lib/helpers';

const { t } = useI18n();

const email = getEmailFromUrl();
const token = getTokenFromUrl();

defineOptions({
    layout: GuestLayout,
});
</script>
