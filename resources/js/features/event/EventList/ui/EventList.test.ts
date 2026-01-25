import { convertToDateTimeString } from '@/shared/lib/helpers';
import { render, screen } from '@testing-library/vue';
import EventList from './EventList.vue';

const startAt = new Date();
startAt.setDate(startAt.getDate() + 3);
startAt.setHours(4);
startAt.setMinutes(5);

const finishAt = new Date();
finishAt.setDate(finishAt.getDate() + 4);
finishAt.setHours(5);
finishAt.setMinutes(6);

const remindAboutStartAt = new Date();
finishAt.setDate(remindAboutStartAt.getDate() + 1);
finishAt.setHours(2);
finishAt.setMinutes(3);

const remindAboutFinishAt = new Date();
finishAt.setDate(remindAboutFinishAt.getDate() + 2);
finishAt.setHours(3);
finishAt.setMinutes(4);

const events = [
    {
        id: 1,
        title: 'title',
        limitedDescription: 'description',
        descriptionRealLength: 15,
        startAt,
        finishAt,
        remindAboutStartAt,
        remindAboutFinishAt,
    },
];

beforeEach(() => {
    render(EventList, {
        props: {
            events,
        },
    });
});

test('Filled table data', async () => {
    events.forEach(async (event) => {
        await screen.findByText(event.id);
        await screen.findByText(event.title);
        await screen.findByText(
            event.descriptionRealLength > event.limitedDescription.length ? event.limitedDescription + '...' : event.limitedDescription,
        );
        await screen.findByText(convertToDateTimeString(event.startAt));
        await screen.findByText(convertToDateTimeString(event.finishAt));
        await screen.findByText(convertToDateTimeString(event.remindAboutStartAt));
        await screen.findByText(convertToDateTimeString(event.remindAboutFinishAt));
    });
});
