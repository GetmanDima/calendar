import { getDatePart } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testRequired } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import EventFilter from './EventFilter.vue';

type FieldKey = 'title' | 'startAtRange' | 'finishAtRange';

const defaultFilters = {
    title: 'title',
    startAtRange: [new Date(), new Date()],
    finishAtRange: [new Date(), new Date()],
};

const onApply = vi.fn();

beforeEach(() => {
    render(EventFilter, {
        props: {
            defaultFilters,
            onApply,
        },
    });
});

test('Filled by default data on mount', async () => {
    const { title: titleInput, startAtRange: startAtRangeInput, finishAtRange: finishAtRangeInput } = getInputsFromScreen();

    expect(titleInput.value).toBe(defaultFilters.title);
    expect(startAtRangeInput.value).toBe(getDatePart(defaultFilters.startAtRange[0]) + ' - ' + getDatePart(defaultFilters.startAtRange[1]));
    expect(finishAtRangeInput.value).toBe(getDatePart(defaultFilters.finishAtRange[0]) + ' - ' + getDatePart(defaultFilters.finishAtRange[1]));
});

test('Start at range validation', async () => {
    const { startAtRange: startAtRangeInput } = getInputsFromScreen();

    await testRequired(startAtRangeInput);
});

test('Finish must be later than start validation', async () => {
    const { startAtRange: startAtRangeInput, finishAtRange: finishAtRangeInput } = getInputsFromScreen();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);
    const startDatePart = getDatePart(startDate);

    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + 1);
    const finishDatePart = getDatePart(finishDate);

    await fireEvent.focus(startAtRangeInput);
    await fireEvent.update(startAtRangeInput, startDatePart + ' - ' + startDatePart);
    await fireEvent.blur(startAtRangeInput);

    await fireEvent.focus(finishAtRangeInput);
    await fireEvent.update(finishAtRangeInput, finishDatePart + ' - ' + finishDatePart);
    await fireEvent.blur(finishAtRangeInput);

    await screen.findByText(t('validation.event.finish_must_later_than_start'));
});

test('Successful submit', async () => {
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('event.apply_filter'), 'i'),
    });

    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(onApply).toHaveBeenCalledWith(defaultFilters);
    });
});

const getInputsFromScreen = (): { [fieldKey in FieldKey]: any } => {
    return {
        title: screen.getByLabelText(new RegExp('^' + t('event.filters.title') + '$', 'i')),
        startAtRange: screen.getByLabelText(new RegExp('^' + t('event.filters.start_at') + '$', 'i')),
        finishAtRange: screen.getByLabelText(new RegExp('^' + t('event.filters.finish_at') + '$', 'i')),
    };
};
