import { inject, provide, ref, Ref } from 'vue';
import { GlobalAlert } from '../types/layout';

export const useGlobalAlert = () => {
    let alert = inject('globalAlert') as Ref<GlobalAlert>;

    if (!alert) {
        alert = ref<GlobalAlert>({
            text: '',
            type: 'error',
        });

        provide<typeof alert>('globalAlert', alert);
    }

    const clearAlert = () => {
        alert.value = {
            ...alert.value,
            text: '',
        };
    };

    const showErrorAlert = (text: string) => {
        alert.value = {
            text: text,
            type: 'error',
        };
    };

    const showSuccessAlert = (text: string) => {
        alert.value = {
            text: text,
            type: 'success',
        };
    };

    const showInfoAlert = (text: string) => {
        alert.value = {
            text: text,
            type: 'info',
        };
    };

    const showWarningAlert = (text: string) => {
        alert.value = {
            text: text,
            type: 'warning',
        };
    };

    return {
        alert,
        clearAlert,
        showErrorAlert,
        showSuccessAlert,
        showInfoAlert,
        showWarningAlert,
    };
};
