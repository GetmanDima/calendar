<template>
    <v-tabs v-model="selectedNavigationKey" color="primary" :mandatory="false" @update:model-value="updateNavigationItem">
        <v-tab v-for="item in props.items" :value="item.key" :key="item.key" @click="() => onNavigationItemClick(item)">{{ item.title }}</v-tab>
    </v-tabs>
</template>

<script setup lang="ts">
import { redirect } from '@/shared/lib/helpers';
import { NavigationItem, NavigationItems } from '@/shared/types/navigation';
import { computed, onMounted } from 'vue';

const props = defineProps<{ items: NavigationItems; selectedItem: NavigationItem | null }>();
const emit = defineEmits(['selectItem']);

const selectedNavigationKey = computed(() => {
    return props.selectedItem?.key;
});

onMounted(() => {
    const navigationItemForUrl = Object.values(props.items).find((item) => item.link === window.location.pathname);

    if (navigationItemForUrl) {
        emit('selectItem', navigationItemForUrl);
    }
});

const updateNavigationItem = (key: string) => {
    const navigationItemForKey = Object.values(props.items).find((item) => item.key === key);

    if (navigationItemForKey) {
        emit('selectItem', navigationItemForKey);
    }
};

const onNavigationItemClick = (navigationItem: NavigationItem) => {
    redirect(navigationItem.link);
};
</script>
