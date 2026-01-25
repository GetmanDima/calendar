import { sendApiRequest } from '@/shared/lib/api';
import { convertToUTCDateTimeString, insertTimeIntoDate } from '@/shared/lib/helpers';
import { ApiResponse } from '@/shared/types/api';
import { EventFormData } from '../model/types';

export const createEvent = (data: EventFormData): Promise<ApiResponse> => {
    return sendApiRequest('/api/events', 'POST', convertFormDataToRequestData(data));
};

export const updateEvent = (eventId: number, data: EventFormData): Promise<ApiResponse> => {
    return sendApiRequest(`/api/events/${eventId}`, 'PUT', convertFormDataToRequestData(data));
};

const convertFormDataToRequestData = (data: EventFormData): { [key: string]: any } => {
    const startAt = convertToUTCDateTimeString(insertTimeIntoDate(data.startAtDate, data.startAtTime));
    const finishAt = convertToUTCDateTimeString(insertTimeIntoDate(data.finishAtDate, data.finishAtTime));
    let remindAboutStartAt: string | null = null;
    let remindAboutFinishAt: string | null = null;

    if (data.remindAboutStartAtDate && data.remindAboutStartAtTime) {
        remindAboutStartAt = convertToUTCDateTimeString(insertTimeIntoDate(data.remindAboutStartAtDate, data.remindAboutStartAtTime));
    }

    if (data.remindAboutFinishAtDate && data.remindAboutFinishAtTime) {
        remindAboutFinishAt = convertToUTCDateTimeString(insertTimeIntoDate(data.remindAboutFinishAtDate, data.remindAboutFinishAtTime));
    }

    return {
        title: data.title,
        description: data.description,
        start_at: startAt,
        finish_at: finishAt,
        remind_about_start_at: remindAboutStartAt,
        remind_about_finish_at: remindAboutFinishAt,
    };
};
