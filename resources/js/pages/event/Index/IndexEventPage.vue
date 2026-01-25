<template>
    <inertia-head :title="t('event.title')" />
    <div class="mt-5 flex justify-center">
        <div class="mt-15 flex w-full flex-col gap-4" style="max-width: 1500px">
            <content-block :max-width="'100%'" class="py-5">
                <event-filter :defaultFilters="filters" :loading="applyFiltersLoading" :disabled="eventsLoading" class="my-1" @apply="applyFilters" />
            </content-block>
            <content-block ref="tableRef" :max-width="'100%'" class="mb-5">
                <div>
                    <event-list
                        :events="events"
                        :readLoading="eventForReadLoading"
                        :updateLoading="eventForUpdateLoading"
                        @clickRead="onClickReadEvent"
                        @clickUpdate="onClickUpdateEvent"
                        @clickDelete="onClickDeleteEvent"
                    />
                    <v-row class="mt-3 items-center" dense>
                        <v-col cols="12" sm="10" lg="11">
                            <v-pagination
                                v-if="pagesCount > 1"
                                v-model="page"
                                :length="pagesCount"
                                :total-visible="10"
                                :disabled="eventsLoading"
                                rounded="circle"
                                density="compact"
                            ></v-pagination>
                        </v-col>

                        <v-col cols="12" sm="2" lg="1" class="flex justify-end">
                            <v-select
                                v-model="perPage"
                                :label="t('event.pagination.per_page')"
                                :items="[5, 10, 20, 50]"
                                :disabled="eventsLoading"
                                variant="outlined"
                                hide-details
                            ></v-select>
                        </v-col>
                    </v-row>
                </div>
            </content-block>
        </div>
    </div>

    <div class="fixed right-5 bottom-5">
        <v-btn icon color="primary" @click="onClickCreateEvent">
            <v-icon>mdi-plus</v-icon>
        </v-btn>
    </div>

    <modal :title="formModalTitle" ref="formModalRef">
        <event-form :mode="formMode" :event="formEvent" @submitted="onFormSubmitted" />
    </modal>

    <confirm-modal :title="deleteModalTitle" ref="deleteModalRef" :confirmLoading="deleteEventLoading" @clickConfirm="onClickConfirmDeleteEvent">
        {{ deleteModalDescription }}
    </confirm-modal>
</template>

<script setup lang="ts">
import { deleteEvent as apiDeleteEvent, getEvents as apiGetEvents, getSingleEvent as apiGetSingleEvent } from '@/entities/event/api';
import { Event, EventItem } from '@/entities/event/model/types';
import EventFilter from '@/features/event/EventFilter';
import { EventFilters } from '@/features/event/EventFilter/model/types';
import EventForm from '@/features/event/EventForm';
import EventList from '@/features/event/EventList/ui/EventList.vue';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { ApiResponse } from '@/shared/types/api';
import ConfirmModal from '@/shared/ui/ConfirmModal';
import ContentBlock from '@/shared/ui/ContentBlock';
import Modal from '@/shared/ui/Modal';
import { Head as InertiaHead } from '@inertiajs/vue3';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { getFiltersFromUrl, getPageFromUrl, getPerPageFromUrl, updateUrlParams } from './lib/helpers';

const { t } = useI18n();
const { showErrorAlert } = useGlobalAlert();

defineOptions({
    layout: AuthenticatedLayout,
});

const formModalRef = ref<any>(null);
const formEvent = ref<Event | null>(null);
const formMode = ref<'create' | 'update' | 'read'>('create');

const deleteModalRef = ref<any>(null);
const selectedForDeleteEventId = ref<number | null>(null);

const deleteEventLoading = ref(false);

const filters = ref<EventFilters>(getFiltersFromUrl());
const applyFiltersLoading = ref(false);
const eventsLoading = ref(false);
const events = ref<EventItem[]>([]);

const page = ref(getPageFromUrl());
const perPage = ref(getPerPageFromUrl());
const pagesCount = ref(1);

const eventForReadLoading = ref(false);
const eventForUpdateLoading = ref(false);

const formModalTitle = computed(() => {
    if (formMode.value === 'read') {
        return t('event.read.title') + ' #' + formEvent.value?.id;
    }

    if (formMode.value === 'update') {
        return t('event.update.title') + ' #' + formEvent.value?.id;
    }

    return t('event.create.title');
});

const deleteModalTitle = computed(() => {
    return t('event.delete.title') + ' #' + selectedForDeleteEventId.value;
});

const deleteModalDescription = computed(() => {
    return t('event.delete.description') + ' #' + selectedForDeleteEventId.value;
});

watch(page, (newPage) => {
    updateUrlParams(filters.value, newPage, perPage.value);
    getEvents();
});

watch(perPage, (newPerPage) => {
    if (page.value === 1) {
        updateUrlParams(filters.value, page.value, newPerPage);
        getEvents();
    } else {
        page.value = 1;
    }
});

onMounted(() => {
    getEvents();
});

const applyFilters = async (newFilters: EventFilters) => {
    applyFiltersLoading.value = true;

    updateUrlParams(newFilters, page.value, perPage.value);

    filters.value = newFilters;

    if (page.value === 1) {
        await getEvents();
    } else {
        page.value = 1;
    }

    applyFiltersLoading.value = false;
};

const getEvents = async () => {
    eventsLoading.value = true;

    const response = await apiGetEvents(page.value, perPage.value, filters.value);

    if (response.error) {
        handleApiError(response);
    } else {
        if (response.transformedData) {
            events.value = response.transformedData.data;
            page.value = response.transformedData.meta.currentPage;
            pagesCount.value = response.transformedData.meta.lastPage;
        }
    }

    eventsLoading.value = false;
};

const getSingleEvent = async (eventId: number): Promise<Event | null> => {
    const response = await apiGetSingleEvent(eventId);

    if (response.error) {
        handleApiError(response);

        return null;
    }

    return response.transformedData ?? null;
};

const deleteEvent = async (eventId: number): Promise<void> => {
    deleteEventLoading.value = true;

    const response = await apiDeleteEvent(eventId);

    if (response.error) {
        handleApiError(response);
    }

    deleteEventLoading.value = false;
};

const handleApiError = (response: ApiResponse) => {
    showErrorAlert(response.errorMessage ?? t('error.unknown'));
};

const onClickReadEvent = async (eventId: number) => {
    eventForReadLoading.value = true;

    const event = await getSingleEvent(eventId);

    eventForReadLoading.value = false;

    if (!event) {
        return;
    }

    formEvent.value = event;
    formMode.value = 'read';
    formModalRef.value.open();
};

const onClickUpdateEvent = async (eventId: number) => {
    eventForUpdateLoading.value = true;

    const event = await getSingleEvent(eventId);

    eventForUpdateLoading.value = false;

    if (!event) {
        return;
    }

    formEvent.value = event;
    formMode.value = 'update';
    formModalRef.value.open();
};

const onClickCreateEvent = () => {
    formEvent.value = null;
    formMode.value = 'create';
    formModalRef.value.open();
};

const onClickDeleteEvent = (eventId: number) => {
    selectedForDeleteEventId.value = eventId;
    deleteModalRef.value.open();
};

const onClickConfirmDeleteEvent = async () => {
    if (!selectedForDeleteEventId.value) {
        return;
    }

    await deleteEvent(selectedForDeleteEventId.value);

    getEvents();

    deleteModalRef.value.close();
};

const onFormSubmitted = () => {
    getEvents();

    if (formMode.value === 'create') {
        formModalRef.value.close();
    }
};
</script>
