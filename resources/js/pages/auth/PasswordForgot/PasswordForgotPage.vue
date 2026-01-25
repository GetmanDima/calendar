<template>
    <inertia-head :title="t('password_forgot.title')" />
    <div class="flex min-h-screen items-center">
        <content-block>
            <password-forgot class="mt-4" />

            <div class="mt-4 text-right">
                <custom-link href="/login" :text="t('password_forgot.back_to_login')" />
            </div>
        </content-block>
    </div>
</template>

<script setup lang="ts">
import PasswordForgot from '@/features/auth/PasswordForgot';
import GuestLayout from '@/layouts/GuestLayout';
import ContentBlock from '@/shared/ui/ContentBlock';
import CustomLink from '@/shared/ui/Link';
import { Head as InertiaHead } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

defineOptions({
    layout: GuestLayout,
});
</script>
