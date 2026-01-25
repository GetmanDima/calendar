<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.firstName"
            :label="t('personal_data.fields.first_name') + ' *'"
            :rules="[validationRules.required, validationRules.name(t('personal_data.fields.first_name'))]"
            :error-messages="form.errors.firstName"
            :loading="userLoading"
            class="mb-3"
        ></v-text-field>

        <v-text-field
            v-model="form.lastName"
            :label="t('personal_data.fields.last_name')"
            :rules="[validationRules.name(t('personal_data.fields.last_name'))]"
            :error-messages="form.errors.lastName"
            :loading="userLoading"
            class="mb-3"
        ></v-text-field>

        <v-text-field
            v-model="form.middleName"
            :label="t('personal_data.fields.middle_name')"
            :rules="[validationRules.name(t('personal_data.fields.middle_name'))]"
            :error-messages="form.errors.middleName"
            :loading="userLoading"
            class="mb-3"
        ></v-text-field>

        <v-btn v-if="!userLoading" :loading="submitLoading" :disabled="submitLoading" color="primary" type="submit" block>
            {{ t('personal_data.submit') }}
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
import { updateProfile as apiUpdateProfile } from '../api';
import { UpdatePersonalFormData } from '../model/types';

const { t } = useI18n();
const { showErrorAlert, showSuccessAlert } = useGlobalAlert();
const { user, userLoading, updateUser } = useAuthUser();

const { form, validateForm, setErrorsFromApiResponse } = useForm<UpdatePersonalFormData>({
    firstName: '',
    lastName: '',
    middleName: '',
});

const submitLoading = ref(false);

watchEffect(() => {
    if (user.value) {
        form.firstName = user.value.firstName;
        form.lastName = user.value.lastName;
        form.middleName = user.value.middleName;
    }
});

const submit = async (event: SubmitEventPromise) => {
    submitLoading.value = true;

    const isValidForm = await validateForm(event);

    if (!isValidForm) {
        submitLoading.value = false;
        return;
    }

    const response = await apiUpdateProfile(form.data());

    if (response.error) {
        handleApiError(response);
    } else {
        showSuccessAlert(t('personal_data.successful_update'));
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
