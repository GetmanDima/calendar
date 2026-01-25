<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">{{ t('event.table.actions') }}</th>
                <th class="text-left">ID</th>
                <th class="text-left">{{ t('event.table.title') }}</th>
                <th class="text-left">{{ t('event.table.description') }}</th>
                <th class="text-left">{{ t('event.table.start_at') }}</th>
                <th class="text-left">{{ t('event.table.finish_at') }}</th>
                <th class="text-left">{{ t('event.table.remind_about_start_at') }}</th>
                <th class="text-left">{{ t('event.table.remind_about_finish_at') }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="event in props.events" :key="event.id">
                <td>
                    <div class="flex flex-nowrap gap-x-2">
                        <v-btn
                            icon
                            color="info"
                            :size="40"
                            :loading="readLoading && lastClickedEventId === event.id"
                            :disabled="allButtonsDisabled"
                            @click="() => clickRead(event.id)"
                        >
                            <v-icon>mdi-eye</v-icon>
                        </v-btn>

                        <v-btn
                            icon
                            color="primary"
                            :size="40"
                            :loading="updateLoading && lastClickedEventId === event.id"
                            :disabled="allButtonsDisabled"
                            @click="() => clickUpdate(event.id)"
                        >
                            <v-icon>mdi-pencil</v-icon>
                        </v-btn>

                        <v-btn icon color="error" :size="40" :disabled="allButtonsDisabled" @click="() => clickDelete(event.id)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </td>
                <td>{{ event.id }}</td>
                <td class="min-w-3xs">{{ event.title }}</td>
                <td class="min-w-3xs">{{ formatDescription(event.limitedDescription, event.descriptionRealLength) }}</td>
                <td class="text-nowrap">{{ formatDate(event.startAt) }}</td>
                <td class="text-nowrap">{{ formatDate(event.finishAt) }}</td>
                <td class="text-nowrap">{{ formatDate(event.remindAboutStartAt) }}</td>
                <td class="text-nowrap">{{ formatDate(event.remindAboutFinishAt) }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script setup lang="ts">
import { EventItem } from '@/entities/event/model/types';
import { convertToDateTimeString } from '@/shared/lib/helpers';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    events: EventItem[];
    readLoading?: boolean;
    updateLoading?: boolean;
}>();

const emit = defineEmits(['clickRead', 'clickUpdate', 'clickDelete']);

const lastClickedEventId = ref<number | null>(null);

const allButtonsDisabled = computed(() => props.readLoading || props.updateLoading);

const formatDate = (date: Date | null) => {
    if (!date) {
        return '';
    }

    return convertToDateTimeString(date);
};

const formatDescription = (description: string | null, descriptionRealLength: number): string => {
    if (!description) {
        return '';
    }

    if (descriptionRealLength > description.length) {
        return description + '...';
    }

    return description;
};

const clickRead = (id: number) => {
    lastClickedEventId.value = id;
    emit('clickRead', id);
};

const clickUpdate = (id: number) => {
    lastClickedEventId.value = id;
    emit('clickUpdate', id);
};

const clickDelete = (id: number) => {
    lastClickedEventId.value = id;
    emit('clickDelete', id);
};
</script>
