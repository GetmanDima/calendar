<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.email"
            :label="t('password_forgot.fields.email')"
            :rules="[validationRules.required, validationRules.email]"
            :error-messages="form.errors.email"
            type="email"
            class="mb-3"
        ></v-text-field>

        <v-btn :loading="submitLoading" :disabled="submitLoading || isSubmitTimerActive" color="primary" type="submit" block>
            <template v-if="isSubmitTimerActive"> {{ t('password_forgot.submit') }} ({{ currentSubmitTimerSeconds }}) </template>
            <template v-else>
                {{ t('password_forgot.submit') }}
            </template>
        </v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { useForm } from '@/shared/composables/useForm';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { useTimer } from '@/shared/composables/useTimer';
import { findKeysForChangedValues } from '@/shared/lib/helpers';
import validationRules from '@/shared/lib/validationRules';
import { ApiResponse } from '@/shared/types/api';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { forgotPassword } from '../api';
import { PasswordForgotFormData } from '../model/types';

const { t } = useI18n();
const { showErrorAlert, showSuccessAlert } = useGlobalAlert();
const { currentSeconds: currentSubmitTimerSeconds, startTimer: startSubmitTimer, isTimerActive: isSubmitTimerActive } = useTimer();

const { form, validateForm, setErrorsFromApiResponse } = useForm<PasswordForgotFormData>({
    email: '',
});

const submitLoading = ref(false);

watch(
    () => form.data(),
    (newFormData, oldFormData) => {
        const changedFields = findKeysForChangedValues(oldFormData, newFormData);

        changedFields.forEach((field) => {
            form.clearErrors(field);
        });
    },
    { deep: true },
);

const submit = async (event: SubmitEventPromise) => {
    submitLoading.value = true;

    const isValidForm = await validateForm(event);

    if (!isValidForm) {
        submitLoading.value = false;
        return;
    }

    const response = await forgotPassword(form.data());

    if (response.error) {
        handleApiError(response);
    } else {
        showSuccessAlert(t('password_forgot.reset_message_sent'));
    }

    startSubmitTimer(60);
    submitLoading.value = false;
};

const handleApiError = (response: ApiResponse) => {
    if (response.hasValidationErrors) {
        setErrorsFromApiResponse(response);
    } else {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    }
};
</script>
