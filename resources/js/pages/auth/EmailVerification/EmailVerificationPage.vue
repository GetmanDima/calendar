<template>
    <inertia-head :title="t('email_verification.title')" />
    <div class="flex min-h-screen items-center">
        <content-block>
            <email-verification
                :verificationData="{
                    userId,
                    hash,
                    expires,
                    signature,
                }"
            />
        </content-block>
    </div>
</template>

<script setup lang="ts">
import EmailVerification from '@/features/auth/EmailVerification/ui/EmailVerification.vue';
import GuestLayout from '@/layouts/GuestLayout';
import ContentBlock from '@/shared/ui/ContentBlock';
import { Head as InertiaHead } from '@inertiajs/vue3';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const pathnameParts = window.location.pathname.split('/');
const userId = pathnameParts[3] ?? null;
const hash = pathnameParts[4] ?? null;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const expires = urlParams.get('expires');
const signature = urlParams.get('signature');

defineOptions({
    layout: GuestLayout,
});
</script>
