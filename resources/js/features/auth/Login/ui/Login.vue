<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.email"
            :label="t('login.fields.email')"
            :rules="[validationRules.required, validationRules.email]"
            :error-messages="form.errors.email"
            type="email"
            class="mb-3"
        ></v-text-field>

        <password-field v-model="form.password" :label="t('login.fields.password')" :rules="[validationRules.required]"></password-field>

        <div class="!-mt-5 mb-2 flex justify-end">
            <v-checkbox v-model="form.remember" :label="t('login.fields.remember')" color="primary" hide-details></v-checkbox>
        </div>

        <v-btn :loading="submitLoading" :disabled="submitLoading" color="primary" type="submit" block>{{ t('login.submit') }}</v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { useForm } from '@/shared/composables/useForm';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { redirect } from '@/shared/lib/helpers';
import validationRules from '@/shared/lib/validationRules';
import { ApiResponse } from '@/shared/types/api';
import PasswordField from '@/shared/ui/PasswordField';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { login as apiLogin } from '../api';
import { LoginFormData } from '../model/types';

const { t } = useI18n();

const { showErrorAlert } = useGlobalAlert();

const { form, validateForm, setErrorsFromApiResponse } = useForm<LoginFormData>({
    email: '',
    password: '',
    remember: false,
});

const submitLoading = ref(false);

watch(
    () => form.data(),
    () => {
        form.clearErrors();
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

    const response = await apiLogin(form.data());

    if (response.error) {
        submitLoading.value = false;
        handleApiError(response);
    } else {
        redirect('/');
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
