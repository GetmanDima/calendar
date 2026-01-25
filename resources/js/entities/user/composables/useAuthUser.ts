import { inject, provide, ref, Ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useGlobalAlert } from '../../../shared/composables/useGlobalAlert';
import { getUser } from '../api';
import { User } from '../model/types';

export const useAuthUser = () => {
    const { t } = useI18n();
    const { showErrorAlert } = useGlobalAlert();

    let user = inject('authenticatedUser') as Ref<User | null> | undefined;
    let userLoading = inject('authenticatedUserLoading') as Ref<boolean> | undefined;

    if (!user || !userLoading) {
        user = ref<User | null>(null);
        userLoading = ref(false);

        provide<typeof user>('authenticatedUser', user);
        provide<typeof userLoading>('authenticatedUserLoading', userLoading);
    }

    const updateUser = async () => {
        userLoading.value = true;

        const response = await getUser();

        if (response.error) {
            showErrorAlert(response.errorMessage ?? t('error.unknown'));
        } else {
            user.value = response.transformedData ?? null;
        }

        userLoading.value = false;
    };

    return {
        user,
        userLoading,
        updateUser,
    };
};
