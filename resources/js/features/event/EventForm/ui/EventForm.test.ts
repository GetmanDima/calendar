import { Event } from '@/entities/event/model/types';
import * as api from '@/shared/lib/api';
import { convertToUTCDateTimeString, getDatePart, getTimePart } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testNotRequired, testRequired } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import EventForm from './EventForm.vue';

type FieldKey =
    | 'title'
    | 'description'
    | 'startAtDate'
    | 'startAtTime'
    | 'finishAtDate'
    | 'finishAtTime'
    | 'remindAboutStartAtDate'
    | 'remindAboutStartAtTime'
    | 'remindAboutFinishAtDate'
    | 'remindAboutFinishAtTime';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 200 })));

describe('Event form validation', () => {
    beforeEach(() => {
        render(EventForm, {
            props: {
                mode: 'create',
            },
        });
    });

    test('Title validation', async () => {
        const { title: titleInput } = getInputsFromScreen();

        await testRequired(titleInput);
    });

    test('Description validation', async () => {
        const { description: descriptionInput } = getInputsFromScreen();

        await testNotRequired(descriptionInput);
    });

    test('Start at date validation', async () => {
        const { startAtDate: startAtDateInput } = getInputsFromScreen();

        expect(startAtDateInput.value).toBe(getDatePart(new Date()));

        await testRequired(startAtDateInput);
    });

    test('Start at time validation', async () => {
        const { startAtTime: startAtTimeInput } = getInputsFromScreen();

        expect(startAtTimeInput.value).toBe('00:00');

        await testRequired(startAtTimeInput);
    });

    test('Finish at date validation', async () => {
        const { finishAtDate: finishAtDateInput } = getInputsFromScreen();

        expect(finishAtDateInput.value).toBe(getDatePart(new Date()));

        await testRequired(finishAtDateInput);
    });

    test('Finish at time validation', async () => {
        const { finishAtTime: finishAtTimeInput } = getInputsFromScreen();

        expect(finishAtTimeInput.value).toBe('23:59');

        await testRequired(finishAtTimeInput);
    });

    test('Remind about start at date validation', async () => {
        const { remindAboutStartAtDate: remindAboutStartAtDateInput } = getInputsFromScreen();

        await testNotRequired(remindAboutStartAtDateInput);
    });

    test('Remind about start at time validation', async () => {
        const { remindAboutStartAtTime: remindAboutStartAtTimeInput, remindAboutStartAtDate: remindAboutStartAtDateInput } = getInputsFromScreen();

        await testNotRequired(remindAboutStartAtTimeInput);

        await fireEvent.focus(remindAboutStartAtDateInput);
        await fireEvent.update(remindAboutStartAtDateInput, getDatePart(new Date()));
        await fireEvent.blur(remindAboutStartAtDateInput);

        await testRequired(remindAboutStartAtTimeInput);
    });

    test('Remind about finish at date validation', async () => {
        const { remindAboutFinishAtDate: remindAboutFinishAtDateInput } = getInputsFromScreen();

        testNotRequired(remindAboutFinishAtDateInput);
    });

    test('Remind about finish at time validation', async () => {
        const { remindAboutFinishAtTime: remindAboutFinishAtTimeInput, remindAboutFinishAtDate: remindAboutFinishAtDateInput } =
            getInputsFromScreen();

        await testNotRequired(remindAboutFinishAtTimeInput);

        await fireEvent.focus(remindAboutFinishAtDateInput);
        await fireEvent.update(remindAboutFinishAtDateInput, getDatePart(new Date()));
        await fireEvent.blur(remindAboutFinishAtDateInput);

        await testRequired(remindAboutFinishAtTimeInput);
    });

    test('Finish date must be later than start date validation', async () => {
        const {
            startAtDate: startAtDateInput,
            finishAtDate: finishAtDateInput,
            startAtTime: startAtTimeInput,
            finishAtTime: finishAtTimeInput,
        } = getInputsFromScreen();

        const datePart = getDatePart(new Date());

        await fireEvent.focus(startAtDateInput);
        await fireEvent.update(startAtDateInput, datePart);
        await fireEvent.blur(startAtDateInput);

        await fireEvent.focus(finishAtDateInput);
        await fireEvent.update(startAtDateInput, datePart);
        await fireEvent.blur(finishAtDateInput);

        await fireEvent.update(startAtTimeInput, '23:00');
        await fireEvent.update(finishAtTimeInput, '00:00');

        await screen.findByText(t('validation.event.finish_must_later_than_start'));
    });

    test('Remind about start date must be earlier than now', async () => {
        const { remindAboutStartAtDate: remindAboutStartAtDateInput, remindAboutStartAtTime: remindAboutStartAtTimeInput } = getInputsFromScreen();

        const date = new Date();
        date.setDate(date.getDate() - 1);
        const datePart = getDatePart(date);

        await fireEvent.focus(remindAboutStartAtDateInput);
        await fireEvent.update(remindAboutStartAtDateInput, datePart);
        await fireEvent.blur(remindAboutStartAtDateInput);

        await fireEvent.update(remindAboutStartAtTimeInput, '00:00');

        await screen.findByText(t('validation.event.remind_must_earlier_than_now'));
    });

    test('Remind about finish date must be earlier than now', async () => {
        const { remindAboutFinishAtDate: remindAboutFinishAtDateInput, remindAboutFinishAtTime: remindAboutFinishAtTimeInput } =
            getInputsFromScreen();

        const date = new Date();
        date.setDate(date.getDate() - 1);
        const datePart = getDatePart(date);

        await fireEvent.focus(remindAboutFinishAtDateInput);
        await fireEvent.update(remindAboutFinishAtDateInput, datePart);
        await fireEvent.blur(remindAboutFinishAtDateInput);

        await fireEvent.update(remindAboutFinishAtTimeInput, '00:00');

        await screen.findByText(t('validation.event.remind_must_earlier_than_now'));
    });

    test('Remind abot start date must be earlier than start date validation', async () => {
        const {
            startAtDate: startAtDateInput,
            remindAboutStartAtDate: remindAboutStartAtDateInput,
            startAtTime: startAtTimeInput,
            remindAboutStartAtTime: remindAboutStartAtTimeInput,
        } = getInputsFromScreen();

        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        const startDatePart = getDatePart(startDate);

        const remindDate = new Date();
        remindDate.setDate(remindDate.getDate() + 2);
        const remindDatePart = getDatePart(remindDate);

        await fireEvent.focus(startAtDateInput);
        await fireEvent.update(startAtDateInput, startDatePart);
        await fireEvent.blur(startAtDateInput);

        await fireEvent.focus(remindAboutStartAtDateInput);
        await fireEvent.update(remindAboutStartAtDateInput, remindDatePart);
        await fireEvent.blur(remindAboutStartAtDateInput);

        await fireEvent.update(startAtTimeInput, '23:00');
        await fireEvent.update(remindAboutStartAtTimeInput, '00:00');

        await screen.findByText(t('validation.event.remind_must_earlier_than_start'));
    });

    test('Remind about finish date must be earlier than finish date validation', async () => {
        const {
            finishAtDate: finishAtDateInput,
            remindAboutFinishAtDate: remindAboutFinishAtDateInput,
            finishAtTime: finishAtTimeInput,
            remindAboutFinishAtTime: remindAboutFinishAtTimeInput,
        } = getInputsFromScreen();

        const finishDate = new Date();
        finishDate.setDate(finishDate.getDate() + 1);
        const finishDatePart = getDatePart(finishDate);

        const remindDate = new Date();
        remindDate.setDate(remindDate.getDate() + 2);
        const remindDatePart = getDatePart(remindDate);

        await fireEvent.focus(finishAtDateInput);
        await fireEvent.update(finishAtDateInput, finishDatePart);
        await fireEvent.blur(finishAtDateInput);

        await fireEvent.focus(remindAboutFinishAtDateInput);
        await fireEvent.update(remindAboutFinishAtDateInput, remindDatePart);
        await fireEvent.blur(remindAboutFinishAtDateInput);

        await fireEvent.update(finishAtTimeInput, '23:00');
        await fireEvent.update(remindAboutFinishAtTimeInput, '00:00');

        await screen.findByText(t('validation.event.remind_must_earlier_than_finish'));
    });
});

describe('Event form read', () => {
    beforeEach(() => {
        render(EventForm, {
            props: {
                mode: 'read',
                event: getFakeEvent(),
            },
        });
    });

    test('Filled by event data on mount', async () => {
        const {
            title: titleInput,
            description: descriptionInput,
            startAtDate: startAtDateInput,
            startAtTime: startAtTimeInput,
            finishAtDate: finishAtDateInput,
            finishAtTime: finishAtTimeInput,
            remindAboutStartAtDate: remindAboutStartAtDateInput,
            remindAboutStartAtTime: remindAboutStartAtTimeInput,
            remindAboutFinishAtDate: remindAboutFinishAtDateInput,
            remindAboutFinishAtTime: remindAboutFinishAtTimeInput,
        } = getInputsFromScreen();

        const event = getFakeEvent();

        expect(titleInput.value).toBe(event.title);
        expect(descriptionInput.value).toBe(event.description);

        expect(startAtDateInput.value).toBe(getDatePart(event.startAt));
        expect(startAtTimeInput.value).toBe(getTimePart(event.startAt));

        expect(finishAtDateInput.value).toBe(getDatePart(event.finishAt));
        expect(finishAtTimeInput.value).toBe(getTimePart(event.finishAt));

        if (event.remindAboutStartAt) {
            expect(remindAboutStartAtDateInput.value).toBe(getDatePart(event.remindAboutStartAt));
            expect(remindAboutStartAtTimeInput.value).toBe(getTimePart(event.remindAboutStartAt));
        }

        if (event.remindAboutFinishAt) {
            expect(remindAboutFinishAtDateInput.value).toBe(getDatePart(event.remindAboutFinishAt));
            expect(remindAboutFinishAtTimeInput.value).toBe(getTimePart(event.remindAboutFinishAt));
        }

        expect(screen.queryByText(t('event.create.submit'))).toBeNull();
        expect(screen.queryByText(t('event.update.submit'))).toBeNull();
    });
});

describe('Event form update', () => {
    beforeEach(() => {
        render(EventForm, {
            props: {
                mode: 'update',
                event: getFakeEvent(),
            },
        });
    });

    test('Successful update submit', async () => {
        const submitButton = screen.getByRole('button', {
            name: new RegExp(t('event.update.submit'), 'i'),
        });
        await fireEvent.click(submitButton);

        const event = getFakeEvent();

        await waitFor(() => {
            expect(api.sendApiRequest).toHaveBeenCalledWith(`/api/events/${event.id}`, 'PUT', {
                title: event.title,
                description: event.description,
                start_at: convertToUTCDateTimeString(event.startAt),
                finish_at: convertToUTCDateTimeString(event.finishAt),
                remind_about_start_at: event.remindAboutStartAt ? convertToUTCDateTimeString(event.remindAboutStartAt) : null,
                remind_about_finish_at: event.remindAboutFinishAt ? convertToUTCDateTimeString(event.remindAboutFinishAt) : null,
            });
        });
    });
});

describe('Event form create', () => {
    beforeEach(() => {
        render(EventForm, {
            props: {
                mode: 'update',
                event: getFakeEvent(),
            },
        });
    });

    test('Successful create submit', async () => {
        const {
            title: titleInput,
            description: descriptionInput,
            startAtDate: startAtDateInput,
            startAtTime: startAtTimeInput,
            finishAtDate: finishAtDateInput,
            finishAtTime: finishAtTimeInput,
            remindAboutStartAtDate: remindAboutStartAtDateInput,
            remindAboutStartAtTime: remindAboutStartAtTimeInput,
            remindAboutFinishAtDate: remindAboutFinishAtDateInput,
            remindAboutFinishAtTime: remindAboutFinishAtTimeInput,
        } = getInputsFromScreen();

        const submitButton = screen.getByRole('button', {
            name: new RegExp(t('event.update.submit'), 'i'),
        });

        const event = getFakeEvent();

        await fireEvent.update(titleInput, event.title);
        await fireEvent.update(descriptionInput, event.description);

        await fireEvent.focus(startAtDateInput);
        await fireEvent.update(startAtDateInput, getDatePart(event.startAt));
        await fireEvent.blur(startAtDateInput);

        await fireEvent.update(startAtTimeInput, getTimePart(event.startAt));

        await fireEvent.focus(finishAtDateInput);
        await fireEvent.update(finishAtDateInput, getDatePart(event.finishAt));
        await fireEvent.blur(finishAtDateInput);

        await fireEvent.update(finishAtTimeInput, getTimePart(event.finishAt));

        if (event.remindAboutStartAt) {
            await fireEvent.focus(remindAboutStartAtDateInput);
            await fireEvent.update(remindAboutStartAtDateInput, getDatePart(event.remindAboutStartAt));
            await fireEvent.blur(remindAboutStartAtDateInput);

            await fireEvent.update(remindAboutStartAtTimeInput, getTimePart(event.remindAboutStartAt));
        }

        if (event.remindAboutFinishAt) {
            await fireEvent.focus(remindAboutFinishAtDateInput);
            await fireEvent.update(remindAboutFinishAtDateInput, getDatePart(event.remindAboutFinishAt));
            await fireEvent.blur(remindAboutFinishAtDateInput);

            await fireEvent.update(remindAboutFinishAtTimeInput, getTimePart(event.remindAboutFinishAt));
        }

        await fireEvent.click(submitButton);

        await waitFor(() => {
            expect(api.sendApiRequest).toHaveBeenCalledWith(`/api/events/${event.id}`, 'PUT', {
                title: event.title,
                description: event.description,
                start_at: convertToUTCDateTimeString(event.startAt),
                finish_at: convertToUTCDateTimeString(event.finishAt),
                remind_about_start_at: event.remindAboutStartAt ? convertToUTCDateTimeString(event.remindAboutStartAt) : null,
                remind_about_finish_at: event.remindAboutFinishAt ? convertToUTCDateTimeString(event.remindAboutFinishAt) : null,
            });
        });
    });
});

const getInputsFromScreen = (): { [fieldKey in FieldKey]: any } => {
    return {
        title: screen.getByLabelText(new RegExp(t('event.create.fields.title'), 'i')),
        description: screen.getByLabelText(new RegExp(t('event.create.fields.description'), 'i')),
        startAtDate: screen.getByLabelText(new RegExp(t('event.create.fields.start_at_date'), 'i')),
        startAtTime: screen.getByLabelText(new RegExp(t('event.create.fields.start_at_time'), 'i')),
        finishAtDate: screen.getByLabelText(new RegExp(t('event.create.fields.finish_at_date'), 'i')),
        finishAtTime: screen.getByLabelText(new RegExp(t('event.create.fields.finish_at_time'), 'i')),
        remindAboutStartAtDate: screen.getByLabelText(new RegExp('^' + t('event.create.fields.remind_about_start_at_date') + '$', 'i')),
        remindAboutStartAtTime: screen.getByLabelText(new RegExp('^' + t('event.create.fields.remind_about_start_at_time') + '$', 'i')),
        remindAboutFinishAtDate: screen.getByLabelText(new RegExp('^' + t('event.create.fields.remind_about_finish_at_date') + '$', 'i')),
        remindAboutFinishAtTime: screen.getByLabelText(new RegExp('^' + t('event.create.fields.remind_about_finish_at_time') + '$', 'i')),
    };
};

let fakeEvent: Event | null = null;

const getFakeEvent = (): Event => {
    if (fakeEvent) {
        return fakeEvent;
    }

    const startAt = new Date();
    startAt.setDate(startAt.getDate() + 1);
    startAt.setHours(1);
    startAt.setMinutes(0);

    const finishAt = new Date();
    finishAt.setDate(finishAt.getDate() + 4);
    finishAt.setHours(2);
    finishAt.setMinutes(1);

    const remindAboutStartAt = new Date();
    remindAboutStartAt.setDate(remindAboutStartAt.getDate() + 2);
    remindAboutStartAt.setDate(finishAt.getDate() + 4);
    remindAboutStartAt.setHours(3);
    remindAboutStartAt.setMinutes(2);

    const remindAboutFinishAt = new Date();
    remindAboutFinishAt.setDate(remindAboutFinishAt.getDate() + 3);
    remindAboutFinishAt.setHours(4);
    remindAboutFinishAt.setMinutes(3);

    fakeEvent = {
        id: 1,
        title: 'title',
        description: 'description',
        startAt,
        finishAt,
        remindAboutStartAt,
        remindAboutFinishAt,
    };

    return fakeEvent;
};
