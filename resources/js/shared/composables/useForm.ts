import { ApiResponse } from '@/shared/types/api';
import { FormDataKeys, FormDataType } from '@inertiajs/core';
import { useForm as inertiaUseForm } from '@inertiajs/vue3';
import { watch } from 'vue';
import { SubmitEventPromise } from 'vuetify';
import { findKeysForChangedValues } from '../lib/helpers';

export const useForm = <TForm extends FormDataType<TForm>>(data: TForm) => {
    const form = inertiaUseForm(data);

    watch(
        () => form.data(),
        (newFormData, oldFormData) => {
            const changedFields = findKeysForChangedValues(oldFormData, newFormData);

            changedFields.forEach((field) => {
                if (field in form.data()) {
                    form.clearErrors(field as FormDataKeys<TForm>);
                }
            });
        },
        { deep: true },
    );

    const validateForm = async (event: SubmitEventPromise): Promise<boolean> => {
        const { valid } = await event;

        return valid && !form.hasErrors;
    };

    const setErrorsFromApiResponse = (response: ApiResponse): void => {
        const validationErrors = response.transformedValidationErrors;

        if (validationErrors) {
            for (const [field, errors] of Object.entries(validationErrors)) {
                if (field in form.data()) {
                    form.setError(field as FormDataKeys<TForm>, errors[0]);
                }
            }
        }
    };

    return {
        form,
        validateForm,
        setErrorsFromApiResponse,
    };
};
