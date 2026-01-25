<template>
    <v-snackbar v-model="visible" :timeout="3000" location="bottom right" color="transparent" class="global-error-snackbar">
        <v-alert :text="props.alert.text" :type="alert.type" density="compact" max-width="400px"></v-alert>
    </v-snackbar>
</template>

<script setup lang="ts">
import { GlobalAlert } from '@/shared/types/layout';
import { ref, watch } from 'vue';

const emit = defineEmits(['clearAlert']);
const props = defineProps<{ alert: GlobalAlert }>();

const visible = ref(false);

watch(
    () => props.alert,
    (newAlert) => {
        visible.value = !!newAlert.text;
    },
);

watch(visible, (newVisible) => {
    if (!newVisible) {
        emit('clearAlert');
    }
});
</script>

<style>
.global-error-snackbar .v-snackbar__wrapper {
    box-shadow: none;
}
</style>
