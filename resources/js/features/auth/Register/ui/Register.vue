<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.email"
            :label="t('register.fields.email') + ' *'"
            :rules="[validationRules.required, validationRules.email]"
            :error-messages="form.errors.email"
            type="email"
            class="mb-3"
        ></v-text-field>

        <v-text-field
            v-model="form.firstName"
            :label="t('register.fields.first_name') + ' *'"
            :rules="[validationRules.required, validationRules.name(t('register.fields.first_name'))]"
            :error-messages="form.errors.firstName"
            class="mb-3"
        ></v-text-field>

        <v-text-field
            v-model="form.lastName"
            :label="t('register.fields.last_name')"
            :rules="[validationRules.name(t('register.fields.last_name'))]"
            :error-messages="form.errors.lastName"
            class="mb-3"
        ></v-text-field>

        <v-text-field
            v-model="form.middleName"
            :label="t('register.fields.middle_name')"
            :rules="[validationRules.name(t('register.fields.middle_name'))]"
            :error-messages="form.errors.middleName"
            class="mb-3"
        ></v-text-field>

        <password-field
            v-model="form.password"
            :label="t('register.fields.password') + ' *'"
            :rules="[validationRules.required, validationRules.password]"
            :error-messages="form.errors.password"
            class="mb-3"
        ></password-field>

        <password-field
            v-model="form.passwordConfirmation"
            :label="t('register.fields.password_confirmation') + ' *'"
            :rules="[(v: string) => v === form.password || t('validation.auth.password_confirmation')]"
            :error-messages="form.errors.passwordConfirmation"
            class="mb-3"
        ></password-field>

        <v-btn :loading="submitLoading" :disabled="submitLoading" color="primary" type="submit" block>{{ t('register.submit') }}</v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { useForm } from '@/shared/composables/useForm';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { redirect } from '@/shared/lib/helpers';
import validationRules from '@/shared/lib/validationRules';
import { ApiResponse } from '@/shared/types/api';
import PasswordField from '@/shared/ui/PasswordField';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { register as apiRegister } from '../api';
import { RegisterFormData } from '../model/types';

const { t } = useI18n();
const { showErrorAlert } = useGlobalAlert();

const { form, validateForm, setErrorsFromApiResponse } = useForm<RegisterFormData>({
    email: '',
    firstName: '',
    lastName: '',
    middleName: '',
    password: '',
    passwordConfirmation: '',
});

const submitLoading = ref(false);

const submit = async (event: SubmitEventPromise) => {
    submitLoading.value = true;

    const isValidForm = await validateForm(event);

    if (!isValidForm) {
        submitLoading.value = false;
        return;
    }

    const { passwordConfirmation: _, ...requestData } = form.data();

    const response = await apiRegister(requestData);

    if (response.error) {
        submitLoading.value = false;
        handleApiError(response);
    } else {
        redirect('/');
    }
};

const handleApiError = async (response: ApiResponse) => {
    if (response.hasValidationErrors) {
        setErrorsFromApiResponse(response);
    } else {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    }
};
</script>
