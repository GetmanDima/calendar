<template>
    <app-layout>
        <v-app-bar :elevation="2">
            <template v-slot:prepend>
                <a href="/" class="me-5 hidden sm:block">
                    <v-icon icon="mdi-calendar-check" :size="40" class="ml-2"></v-icon>
                </a>
                <div>
                    <navigation :items="navigationItems" :selectedItem="selectedNavigationItem" @select-item="selectNavigationItem" />
                </div>
            </template>

            <template v-slot:append>
                <div class="hidden sm:block">
                    <v-btn @click="() => redirect('/profile/personal-data')">
                        <v-icon icon="mdi-account" :size="25" class="me-1"></v-icon>
                        <span class="normal-case">{{ userFullName }}</span>
                    </v-btn>
                </div>
                <div class="pt-6">
                    <select-language variant="undefined" label="" width="90" />
                </div>
                <div>
                    <logout-button />
                </div>
            </template>
        </v-app-bar>

        <div class="px-3">
            <slot />
        </div>
    </app-layout>
</template>

<script setup lang="ts">
import { useAuthUser } from '@/entities/user/composables/useAuthUser';
import LogoutButton from '@/features/auth/LogoutButton';
import SelectLanguage from '@/features/layout/SelectLanguage';
import AppLayout from '@/layouts/AppLayout';
import { useNavigation } from '@/shared/composables/useNavigation';
import { redirect } from '@/shared/lib/helpers';
import { getDefaultNavigationItems } from '@/shared/lib/navigation';
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Navigation from './Navigation.vue';

const { t } = useI18n();

const { user, updateUser } = useAuthUser();
const { selectedNavigationItem, selectNavigationItem } = useNavigation();

const navigationItems = computed(() => getDefaultNavigationItems(t));

onMounted(() => {
    updateUser();
});

const userFullName = computed(() => {
    if (!user.value) {
        return '';
    }

    const lastName = user.value.lastName;
    const firstName = user.value.firstName;
    const middleName = user.value.middleName;

    if (lastName && firstName && middleName) {
        return `${lastName} ${firstName} ${middleName}`;
    }

    if (lastName && firstName) {
        return `${lastName} ${firstName}`;
    }

    return firstName;
});
</script>
