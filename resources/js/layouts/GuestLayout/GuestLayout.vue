<template>
    <app-layout>
        <div class="fixed top-3 right-2">
            <select-language />
        </div>

        <div class="px-3">
            <slot />
        </div>
    </app-layout>
</template>

<script setup lang="ts">
import SelectLanguage from '@/features/layout/SelectLanguage';
import AppLayout from '@/layouts/AppLayout';
</script>
