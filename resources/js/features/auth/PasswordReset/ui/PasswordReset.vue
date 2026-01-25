<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.email"
            :label="t('password_reset.fields.email')"
            :rules="[validationRules.required, validationRules.email]"
            :error-messages="form.errors.email"
            type="email"
            class="mb-3"
            readonly
        ></v-text-field>

        <password-field
            v-model="form.password"
            :label="t('password_reset.fields.password')"
            :rules="[validationRules.required, validationRules.password]"
            :error-messages="form.errors.password"
            class="mb-3"
        ></password-field>

        <password-field
            v-model="form.passwordConfirmation"
            :label="t('password_reset.fields.password_confirmation')"
            :rules="[(v: string) => v === form.password || t('validation.auth.password_confirmation')]"
            :error-messages="form.errors.passwordConfirmation"
            class="mb-3"
        ></password-field>

        <v-btn :loading="submitLoading" :disabled="submitLoading" color="primary" type="submit" block>{{ t('password_reset.submit') }}</v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { useForm } from '@/shared/composables/useForm';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { redirect } from '@/shared/lib/helpers';
import validationRules from '@/shared/lib/validationRules';
import { ApiResponse } from '@/shared/types/api';
import PasswordField from '@/shared/ui/PasswordField';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { resetPassword } from '../api';
import { PasswordResetFormData } from '../model/types';

const { t } = useI18n();

const props = defineProps<{
    token: string;
    email: string;
}>();

const { showErrorAlert, showSuccessAlert } = useGlobalAlert();

const { form, validateForm, setErrorsFromApiResponse } = useForm<PasswordResetFormData>({
    email: '',
    token: '',
    password: '',
    passwordConfirmation: '',
});

const submitLoading = ref(false);

onMounted(() => {
    form.email = props.email;
    form.token = props.token;
});

const submit = async (event: SubmitEventPromise) => {
    submitLoading.value = true;
    const isValidForm = await validateForm(event);

    if (!isValidForm) {
        submitLoading.value = false;
        return;
    }

    const response = await resetPassword(form.data());

    if (response.error) {
        submitLoading.value = false;
        handleApiError(response);
    } else {
        showSuccessAlert(t('password_reset.success'));
        setTimeout(() => {
            redirect('/login');
        }, 2000);
    }
};

const handleApiError = (response: ApiResponse) => {
    if (response.hasValidationErrors) {
        setErrorsFromApiResponse(response);
    } else {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    }
};
</script>
