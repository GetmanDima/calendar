<template>
    <a :href="href" class="text-sm text-gray-400 hover:text-gray-100">
        {{ text }}
    </a>
</template>

<script setup lang="ts">
defineProps<{
    href: string;
    text: string;
}>();
</script>
