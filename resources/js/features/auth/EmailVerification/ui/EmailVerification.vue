<template>
    <div class="d-flex flex-column items-center">
        <v-icon icon="mdi-email" size="80" color="primary" class="mb-4" />

        <v-alert
            :text="verifyLoading ? t('email_verification.in_process') : t('email_verification.description')"
            type="info"
            variant="tonal"
            class="mb-5 w-full"
        ></v-alert>

        <div v-if="!verifyLoading" class="d-flex mb-2 w-100 gap-4">
            <v-btn
                :loading="resendLoading"
                :disabled="isResendTimerActive || resendLoading"
                color="primary"
                class="flex-3"
                @click="resendVerification"
            >
                <span v-if="isResendTimerActive" class="text-wrap"> {{ t('email_verification.resend') }} ({{ currentResendTimerSeconds }}) </span>
                <span v-else class="text-wrap">
                    {{ t('email_verification.resend') }}
                </span>
            </v-btn>

            <v-btn :loading="logoutLoading" variant="outlined" color="grey-lighten-1" class="flex-1" @click="logout">
                {{ t('email_verification.logout') }}
            </v-btn>
        </div>
    </div>
</template>

<script setup lang="ts">
import { logout as apiLogout } from '@/entities/user/api';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { useTimer } from '@/shared/composables/useTimer';
import { redirect } from '@/shared/lib/helpers';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { resendVerification as apiResendVerification, verifyEmail as apiVerifyEmail } from '../api';
import { VerificationData, VerificationRequestData } from '../model/types';

const { t } = useI18n();
const { showErrorAlert, showInfoAlert, showSuccessAlert } = useGlobalAlert();
const { currentSeconds: currentResendTimerSeconds, startTimer: startResendTimer, isTimerActive: isResendTimerActive } = useTimer();

const props = defineProps<{ verificationData: VerificationData }>();

const verifyLoading = ref(false);
const resendLoading = ref(false);
const logoutLoading = ref(false);

onMounted(() => {
    verifyEmail();
});

const verifyEmail = async () => {
    for (const [_, value] of Object.entries(props.verificationData)) {
        if (value === null) {
            return;
        }
    }

    verifyLoading.value = true;
    showInfoAlert(t('email_verification.in_process'));

    const response = await apiVerifyEmail(props.verificationData as VerificationRequestData);

    if (response.error) {
        verifyLoading.value = false;
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    } else {
        showSuccessAlert(t('email_verification.success'));

        setTimeout(() => {
            redirect('/');
        }, 2000);
    }
};

const resendVerification = async () => {
    if (isResendTimerActive.value) {
        return;
    }

    resendLoading.value = true;

    const response = await apiResendVerification();

    if (response.error) {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    } else {
        showSuccessAlert(t('email_verification.email_sent'));
    }

    startResendTimer(60);
    resendLoading.value = false;
};

const logout = async () => {
    logoutLoading.value = true;

    const response = await apiLogout();

    if (response.error) {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    } else {
        redirect('/login');
    }
};
</script>
