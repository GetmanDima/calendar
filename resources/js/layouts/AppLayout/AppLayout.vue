<template>
    <v-app>
        <div>
            <slot />
        </div>

        <div>
            <alert-snackbar :alert="alert" @clear-alert="clearAlert" />
        </div>
    </v-app>
</template>

<script setup lang="ts">
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import AlertSnackbar from '@/shared/ui/AlertSnackbar';

const { alert, clearAlert } = useGlobalAlert();
</script>
