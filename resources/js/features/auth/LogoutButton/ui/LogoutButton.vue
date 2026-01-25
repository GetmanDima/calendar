<template>
    <v-btn icon color="primary" :loading="loading" @click="logout">
        <v-icon>mdi-logout</v-icon>
    </v-btn>
</template>
<script setup lang="ts">
import { logout as apiLogout } from '@/entities/user/api';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { redirect } from '@/shared/lib/helpers';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { showErrorAlert } = useGlobalAlert();

const loading = ref(false);

const logout = async () => {
    loading.value = true;

    const response = await apiLogout();

    if (response?.error) {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));

        loading.value = false;

        return;
    }

    redirect('/');
};
</script>
