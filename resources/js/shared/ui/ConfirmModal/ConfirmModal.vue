<template>
    <v-dialog v-model="visibility" :max-width="maxWidth">
        <v-card>
            <v-card-title class="d-flex justify-space-between align-center px-5 pt-3">
                <span>{{ props.title }}</span>
                <v-btn icon @click="visibility = false" variant="tonal" size="small">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>
            <div class="pa-5 pt-3">
                <slot></slot>
            </div>
            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn :text="closeText" variant="plain" @click="close"></v-btn>

                <v-btn :loading="confirmLoading" :text="confirmText" color="primary" @click="() => emit('clickConfirm')"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = withDefaults(
    defineProps<{
        title: string;
        maxWidth?: number;
        closeText?: string;
        confirmText?: string;
        confirmLoading?: boolean;
    }>(),
    {
        maxWidth: 600,
        confirmLoading: false,
    },
);

const closeText = computed(() => {
    return props.closeText ?? t('layout.modals.actions.close');
});

const confirmText = computed(() => {
    return props.confirmText ?? t('layout.modals.actions.confirm');
});

const emit = defineEmits(['clickConfirm']);

const visibility = ref(false);

const open = () => {
    visibility.value = true;
};

const close = () => {
    visibility.value = false;
};

defineExpose({
    open,
    close,
});
</script>
