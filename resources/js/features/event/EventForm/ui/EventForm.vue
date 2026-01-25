<template>
    <v-form fast-fail @submit.prevent="submit">
        <v-text-field
            v-model="form.title"
            :label="t('event.create.fields.title') + ' *'"
            :rules="[validationRules.required]"
            :error-messages="form.errors.title"
            :readonly="isReadMode"
            class="mb-3"
        ></v-text-field>

        <v-textarea
            v-model="form.description"
            :label="t('event.create.fields.description')"
            :rules="[validationRules.maxLenght(1000)]"
            :error-messages="form.errors.description"
            :readonly="isReadMode"
            class="mb-3"
        ></v-textarea>

        <v-date-input
            v-model="form.startAtDate"
            :label="t('event.create.fields.start_at_date') + ' *'"
            :rules="[validationRules.required]"
            :error-messages="form.errors.startAtDate"
            :readonly="isReadMode"
            input-format="yyyy-mm-dd"
            prepend-icon=""
            class="mb-3"
        ></v-date-input>

        <v-text-field
            v-model="form.startAtTime"
            :label="t('event.create.fields.start_at_time')"
            :rules="[validationRules.required]"
            :readonly="isReadMode"
            type="time"
            class="mb-3"
        />

        <v-date-input
            v-model="form.finishAtDate"
            :label="t('event.create.fields.finish_at_date') + ' *'"
            :rules="[validationRules.required]"
            :error-messages="form.errors.finishAtDate"
            :readonly="isReadMode"
            input-format="yyyy-mm-dd"
            prepend-icon=""
            class="mb-3"
        ></v-date-input>

        <v-text-field
            v-model="form.finishAtTime"
            :label="t('event.create.fields.finish_at_time')"
            :rules="[validationRules.required]"
            :readonly="isReadMode"
            type="time"
            class="mb-3"
        />

        <v-date-input
            v-model="form.remindAboutStartAtDate"
            :label="t('event.create.fields.remind_about_start_at_date')"
            :error-messages="form.errors.remindAboutStartAtDate"
            :readonly="isReadMode"
            input-format="yyyy-mm-dd"
            prepend-icon=""
            class="mb-3"
            clearable
        ></v-date-input>

        <v-text-field
            v-model="form.remindAboutStartAtTime"
            :label="t('event.create.fields.remind_about_start_at_time')"
            :rules="form.remindAboutStartAtDate ? [validationRules.required] : []"
            :disabled="!form.remindAboutStartAtDate && !isReadMode"
            :readonly="isReadMode"
            type="time"
            class="mb-3"
            clearable
        />

        <v-date-input
            v-model="form.remindAboutFinishAtDate"
            :label="t('event.create.fields.remind_about_finish_at_date')"
            :error-messages="form.errors.remindAboutFinishAtDate"
            :readonly="isReadMode"
            input-format="yyyy-mm-dd"
            prepend-icon=""
            class="mb-3"
            clearable
        ></v-date-input>

        <v-text-field
            v-model="form.remindAboutFinishAtTime"
            :label="t('event.create.fields.remind_about_finish_at_time')"
            :rules="form.remindAboutFinishAtDate ? [validationRules.required] : []"
            :disabled="!form.remindAboutFinishAtDate && !isReadMode"
            :readonly="isReadMode"
            type="time"
            :class="{
                'mb-3': !isReadMode,
            }"
            clearable
        />

        <v-btn v-if="!isReadMode" :loading="submitLoading" :disabled="submitLoading" color="primary" type="submit" block>
            {{ isCreateMode ? t('event.create.submit') : t('event.update.submit') }}
        </v-btn>
    </v-form>
</template>

<script setup lang="ts">
import { Event } from '@/entities/event/model/types';
import { useForm } from '@/shared/composables/useForm';
import { useGlobalAlert } from '@/shared/composables/useGlobalAlert';
import { getTimePart, insertTimeIntoDate } from '@/shared/lib/helpers';
import validationRules from '@/shared/lib/validationRules';
import { ApiResponse } from '@/shared/types/api';
import { FormDataKeys } from '@inertiajs/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { SubmitEventPromise } from 'vuetify';
import { VDateInput } from 'vuetify/labs/VDateInput';
import { createEvent as apiCreateEvent, updateEvent as apiUpdateEvent } from '../api';
import { EventFormData } from '../model/types';

const { t } = useI18n();
const { showErrorAlert, showSuccessAlert } = useGlobalAlert();

const defaultFormData: EventFormData = {
    title: '',
    description: '',
    startAtDate: new Date(),
    startAtTime: '00:00',
    finishAtDate: new Date(),
    finishAtTime: '23:59',
    remindAboutStartAtDate: null,
    remindAboutStartAtTime: null,
    remindAboutFinishAtDate: null,
    remindAboutFinishAtTime: null,
};

const { form, validateForm } = useForm<EventFormData>(defaultFormData);

const props = defineProps<{ mode: 'create' | 'update' | 'read'; event?: Event | null }>();
const emit = defineEmits(['submitted']);

const submitLoading = ref(false);

const isReadMode = computed(() => props.mode === 'read');
const isCreateMode = computed(() => props.mode === 'create');

const fillForm = (data: EventFormData) => {
    form.resetAndClearErrors();

    for (const field in data) {
        form[field as keyof EventFormData] = data[field as keyof EventFormData] as any;
    }
};

watch(
    () => props.event,
    (newEvent) => {
        if (!newEvent) {
            fillForm(defaultFormData);

            return;
        }

        const newFormData: EventFormData = {
            title: newEvent.title,
            description: newEvent.description ?? '',
            startAtDate: insertTimeIntoDate(newEvent.startAt, '00:00'),
            startAtTime: getTimePart(newEvent.startAt),
            finishAtDate: insertTimeIntoDate(newEvent.finishAt, '00:00'),
            finishAtTime: getTimePart(newEvent.finishAt),
            remindAboutStartAtDate: newEvent.remindAboutStartAt ? insertTimeIntoDate(newEvent.remindAboutStartAt, '00:00') : null,
            remindAboutStartAtTime: newEvent.remindAboutStartAt ? getTimePart(newEvent.remindAboutStartAt) : null,
            remindAboutFinishAtDate: newEvent.remindAboutFinishAt ? insertTimeIntoDate(newEvent.remindAboutFinishAt, '00:00') : null,
            remindAboutFinishAtTime: newEvent.remindAboutFinishAt ? getTimePart(newEvent.remindAboutFinishAt) : null,
        };

        fillForm(newFormData);
    },
    { immediate: true },
);

watch(
    () => [form.startAtDate, form.startAtTime, form.finishAtDate, form.finishAtTime],
    () => {
        const isValid = compareInputDates('startAt', 'finishAt');

        if (!isValid) {
            form.setError('finishAtDate', t('validation.event.finish_must_later_than_start'));
        }
    },
);

watch(
    () => [form.startAtDate, form.startAtTime, form.remindAboutStartAtDate, form.remindAboutStartAtTime],
    () => {
        const isValid = compareInputDates('remindAboutStartAt', 'startAt');

        if (!isValid) {
            form.setError('remindAboutStartAtDate', t('validation.event.remind_must_earlier_than_start'));
        }
    },
);

watch(
    () => [form.finishAtDate, form.finishAtTime, form.remindAboutFinishAtDate, form.remindAboutFinishAtTime],
    () => {
        const isValid = compareInputDates('remindAboutFinishAt', 'finishAt');

        if (!isValid) {
            form.setError('remindAboutFinishAtDate', t('validation.event.remind_must_earlier_than_finish'));
        }
    },
);

watch(
    () => [form.remindAboutStartAtDate, form.remindAboutStartAtTime],
    () => {
        const isValid = compareInputDateWithNow('remindAboutStartAt');

        if (!isValid) {
            form.setError('remindAboutStartAtDate', t('validation.event.remind_must_earlier_than_now'));
        }
    },
);

watch(
    () => [form.remindAboutFinishAtDate, form.remindAboutFinishAtTime],
    () => {
        const isValid = compareInputDateWithNow('remindAboutFinishAt');

        if (!isValid) {
            form.setError('remindAboutFinishAtDate', t('validation.event.remind_must_earlier_than_now'));
        }
    },
);

const submit = async (event: SubmitEventPromise) => {
    submitLoading.value = true;

    const isValidForm = await validateForm(event);

    if (!isValidForm) {
        submitLoading.value = false;
        return;
    }

    let response = null;

    if (isCreateMode.value) {
        response = await apiCreateEvent(form.data());
    } else if (props.event) {
        response = await apiUpdateEvent(props.event.id, form.data());
    }

    if (response?.error) {
        handleApiError(response);
    } else {
        showSuccessAlert(isCreateMode.value ? t('event.create.success') : t('event.update.success'));
    }

    submitLoading.value = false;
    emit('submitted');
};

const handleApiError = async (response: ApiResponse) => {
    if (response.hasValidationErrors) {
        const validationErrors = response.transformedValidationErrors;

        if (validationErrors) {
            const validationFieldsToFormFields = {
                title: 'title',
                description: 'description',
                startAt: 'startAtDate',
                finishAt: 'finishAtDate',
                remindAboutStartAt: 'remindAboutStartAtDate',
                remindAboutFinishAt: 'remindAboutFinishAtDate',
            };

            for (const [field, errors] of Object.entries(validationErrors)) {
                const formField = validationFieldsToFormFields[field as keyof typeof validationFieldsToFormFields] ?? null;

                if (formField in form.data()) {
                    form.setError(formField as FormDataKeys<EventFormData>, errors[0]);
                }
            }
        }
    } else {
        showErrorAlert(response.errorMessage ?? t('error.unknown'));
    }
};

const compareInputDates = (
    earlyKey: 'startAt' | 'remindAboutStartAt' | 'remindAboutFinishAt',
    lateKey: 'finishAt' | 'remindAboutFinishAt' | 'startAt',
): boolean => {
    const earlyDateKey = (earlyKey + 'Date') as keyof EventFormData;
    const earlyTimeKey = (earlyKey + 'Time') as keyof EventFormData;
    const lateDateKey = (lateKey + 'Date') as keyof EventFormData;
    const lateTimeKey = (lateKey + 'Time') as keyof EventFormData;

    if (form[earlyDateKey] && form[earlyTimeKey] && form[lateDateKey] && form[lateTimeKey]) {
        const earlyDate = insertTimeIntoDate(form[earlyDateKey] as Date, form[earlyTimeKey] as string);
        const lateDate = insertTimeIntoDate(form[lateDateKey] as Date, form[lateTimeKey] as string);

        return earlyDate <= lateDate;
    }

    return true;
};

const compareInputDateWithNow = (key: 'remindAboutStartAt' | 'remindAboutFinishAt'): boolean => {
    const dateKey = (key + 'Date') as keyof EventFormData;
    const timeKey = (key + 'Time') as keyof EventFormData;

    if (form[dateKey] && form[timeKey]) {
        const date = insertTimeIntoDate(form[dateKey] as Date, form[timeKey] as string);

        return date >= new Date();
    }

    return true;
};
</script>
