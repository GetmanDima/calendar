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
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(defineProps<{ title: string; maxWidth?: number }>(), {
    maxWidth: 600,
});

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
