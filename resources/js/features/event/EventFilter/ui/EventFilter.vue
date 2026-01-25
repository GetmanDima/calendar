<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-row dense>
            <v-col cols="12" lg="4" class="px-4">
                <v-text-field v-model="filters.title" :label="t('event.filters.title')" prepend-icon="mdi-magnify" clearable />
            </v-col>

            <v-col cols="12" lg="4" class="px-4">
                <v-date-input
                    v-model="filters.startAtRange"
                    :label="t('event.filters.start_at')"
                    :rules="[validationRules.required]"
                    input-format="yyyy-mm-dd"
                    multiple="range"
                    clearable
                ></v-date-input>
            </v-col>

            <v-col cols="12" lg="4" class="px-4">
                <v-date-input
                    v-model="filters.finishAtRange"
                    :label="t('event.filters.finish_at')"
                    :rules="[finishLaterThanStartValidationRule]"
                    input-format="yyyy-mm-dd"
                    multiple="range"
                    clearable
                ></v-date-input>
            </v-col>
            <v-col cols="0" lg="10"></v-col>
            <v-col cols="12" lg="2" class="px-4">
                <v-btn :loading="loading" :disabled="loading || disabled" color="primary" type="submit" block>{{ t('event.apply_filter') }}</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup lang="ts">
import validationRules from '@/shared/lib/validationRules';
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { EventFilters } from '../model/types';

const { t } = useI18n();

const props = defineProps<{ defaultFilters: EventFilters; loading?: boolean; disabled?: boolean }>();
const emit = defineEmits(['apply']);

const filters = ref<EventFilters>({
    title: props.defaultFilters.title,
    startAtRange: props.defaultFilters.startAtRange,
    finishAtRange: props.defaultFilters.finishAtRange,
});

watch(
    () => props.defaultFilters,
    () => {
        filters.value = { ...props.defaultFilters };
    },
);

const submit = async (event: SubmitEventPromise) => {
    const { valid } = await event;

    if (!valid) {
        return;
    }

    emit('apply', filters.value);
};

const finishLaterThanStartValidationRule = () => {
    if (filters.value.startAtRange?.length && filters.value.finishAtRange?.length) {
        return filters.value.finishAtRange[0] >= filters.value.startAtRange[0] || t('validation.event.finish_must_later_than_start');
    }

    return true;
};
</script>
