<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.email"
            :label="t('email.fields.email')"
            :rules="[validationRules.required, validationRules.email]"
            :error-messages="form.errors.email"
            :loading="userLoading"
            type="email"
            class="mb-3"
        ></v-text-field>

        <v-btn
            v-if="!userLoading"
            :loading="submitLoading"
            :disabled="submitLoading || initialEmail === form.email"
            color="primary"
            type="submit"
            block
        >
            {{ t('email.submit') }}
        </v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { useAuthUser } from '@/entities/user/composables/useAuthUser';
import { useForm } from '@/shared/composables/useForm';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import validationRules from '@/shared/lib/validationRules';
import { ApiResponse } from '@/shared/types/api';
import { ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { updateEmail as apiUpdateEmail } from '../api';
import { UpdateEmailFormData } from '../model/types';

const { t } = useI18n();
const { showErrorAlert, showSuccessAlert } = useGlobalAlert();
const { user, userLoading, updateUser } = useAuthUser();

const { form, validateForm, setErrorsFromApiResponse } = useForm<UpdateEmailFormData>({
    email: '',
});

const submitLoading = ref(false);
const initialEmail = ref('');

watchEffect(() => {
    if (user.value) {
        initialEmail.value = user.value.email;
        form.email = user.value.email;
    }
});

const submit = async (event: SubmitEventPromise) => {
    submitLoading.value = true;

    const isValidForm = await validateForm(event);

    if (!isValidForm) {
        submitLoading.value = false;
        return;
    }

    const response = await apiUpdateEmail(form.data());

    if (response.error) {
        handleApiError(response);
    } else {
        showSuccessAlert(t('email.successful_update'));
    }

    submitLoading.value = false;

    updateUser();
};

const handleApiError = async (response: ApiResponse) => {
    if (response.hasValidationErrors) {
        setErrorsFromApiResponse(response);
    } else {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    }
};
</script>
