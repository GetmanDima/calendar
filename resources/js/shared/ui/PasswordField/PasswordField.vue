<template>
    <v-text-field
        v-bind="$attrs"
        :append-inner-icon="passwordVisibility ? 'mdi-eye-off' : 'mdi-eye'"
        :type="passwordVisibility ? 'text' : 'password'"
        class="mb-3"
        @click:append-inner="passwordVisibility = !passwordVisibility"
    ></v-text-field>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const passwordVisibility = ref(false);
</script>
