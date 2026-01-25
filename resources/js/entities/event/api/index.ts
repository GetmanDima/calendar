import { EventFilters } from '@/features/event/EventFilter/model/types';
import { sendApiRequest } from '@/shared/lib/api';
import { convertToUTCDateTimeString, insertTimeIntoDate, parseUTCDateTimeString } from '@/shared/lib/helpers';
import { ApiResponse } from '@/shared/types/api';
import { Event, EventListResponseData } from '../model/types';

interface OriginalEventListResponseData {
    data: {
        id: number;
        title: string;
        limitedDescription: string;
        descriptionRealLength: number;
        startAt: string;
        finishAt: string;
        remindAboutStartAt: string;
        remindAboutFinishAt: string;
    }[];
    meta: {
        currentPage: number;
        lastPage: number;
    };
}

export const getEvents = async (page: number, perPage: number, filters: EventFilters): Promise<ApiResponse<EventListResponseData>> => {
    let startAtFrom: Date | null = null;
    let startAtTo: Date | null = null;
    let finishAtFrom: Date | null = null;
    let finishAtTo: Date | null = null;

    if (filters.startAtRange && filters.startAtRange.length > 0) {
        startAtFrom = insertTimeIntoDate(new Date(filters.startAtRange[0]), '00:00');
        startAtTo = insertTimeIntoDate(new Date(filters.startAtRange[filters.startAtRange.length - 1]), '23:59');
    }

    if (filters.finishAtRange && filters.finishAtRange.length > 0) {
        finishAtFrom = insertTimeIntoDate(new Date(filters.finishAtRange[0]), '00:00');
        finishAtTo = insertTimeIntoDate(new Date(filters.finishAtRange[filters.finishAtRange.length - 1]), '23:59');
    }

    const response = await sendApiRequest<OriginalEventListResponseData>('/api/events', 'GET', {
        page: page,
        per_page: perPage,
        title: filters.title,
        start_at_from: startAtFrom ? convertToUTCDateTimeString(startAtFrom) : null,
        start_at_to: startAtTo ? convertToUTCDateTimeString(startAtTo) : null,
        finish_at_from: finishAtFrom ? convertToUTCDateTimeString(finishAtFrom) : null,
        finish_at_to: finishAtTo ? convertToUTCDateTimeString(finishAtTo) : null,
    });

    if (response.error) {
        const resultResponse = {
            ...response,
            transformedData: undefined,
        };

        return resultResponse;
    }

    const transformedData = response.transformedData;
    const events = transformedData?.data;

    if (!transformedData || !events) {
        throw new Error(`Unexpected empty api data when got events`);
    }

    const resultResponse = {
        ...response,
        transformedData: {
            ...transformedData,
            data: events.map((event) => {
                return {
                    ...event,
                    startAt: parseUTCDateTimeString(event.startAt),
                    finishAt: parseUTCDateTimeString(event.finishAt),
                    remindAboutStartAt: event.remindAboutStartAt ? parseUTCDateTimeString(event.remindAboutStartAt) : null,
                    remindAboutFinishAt: event.remindAboutFinishAt ? parseUTCDateTimeString(event.remindAboutFinishAt) : null,
                };
            }),
        },
    };

    return resultResponse;
};

export const getSingleEvent = async (eventId: number): Promise<ApiResponse<Event>> => {
    const response = await sendApiRequest<{
        id: number;
        title: string;
        description: string;
        startAt: string;
        finishAt: string;
        remindAboutStartAt: string | null;
        remindAboutFinishAt: string | null;
    }>(`/api/events/${eventId}`, 'GET');

    if (response.error) {
        const resultResponse = {
            ...response,
            transformedData: undefined,
        };

        return resultResponse;
    }

    const data = response.transformedData;

    if (!data) {
        throw new Error(`Unexpected empty api data for event #${eventId}`);
    }

    const resultResponse = {
        ...response,
        transformedData: {
            ...data,
            startAt: parseUTCDateTimeString(data.startAt),
            finishAt: parseUTCDateTimeString(data.finishAt),
            remindAboutStartAt: data.remindAboutStartAt ? parseUTCDateTimeString(data.remindAboutStartAt) : null,
            remindAboutFinishAt: data.remindAboutFinishAt ? parseUTCDateTimeString(data.remindAboutFinishAt) : null,
        },
    };

    return resultResponse;
};

export const deleteEvent = (eventId: number): Promise<ApiResponse> => {
    return sendApiRequest(`/api/events/${eventId}`, 'DELETE');
};
