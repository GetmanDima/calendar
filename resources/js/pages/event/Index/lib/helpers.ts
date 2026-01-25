import { EventFilters } from '@/features/event/EventFilter/model/types';
import { getDatePart } from '@/shared/lib/helpers';

export const updateUrlParams = (filters: EventFilters, page: number, perPage: number) => {
    const params = new URLSearchParams();

    params.set('page', page.toString());
    params.set('per_page', perPage.toString());

    if (filters.title && filters.title.trim() !== '') {
        params.set('title', filters.title);
    }

    if (filters.startAtRange && filters.startAtRange.length >= 2) {
        const startAtFrom = getDatePart(filters.startAtRange[0]);
        const startAtTo = getDatePart(filters.startAtRange[filters.startAtRange.length - 1]);

        params.set('start-at-from', startAtFrom);
        params.set('start-at-to', startAtTo);
    }

    if (filters.finishAtRange && filters.finishAtRange.length >= 2) {
        const startAtFrom = getDatePart(filters.finishAtRange[0]);
        const startAtTo = getDatePart(filters.finishAtRange[filters.finishAtRange.length - 1]);

        params.set('finish-at-from', startAtFrom);
        params.set('finish-at-to', startAtTo);
    }

    const queryString = params.toString();
    const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.pushState({}, '', newUrl);
};

export const getFiltersFromUrl = (): EventFilters => {
    const urlParams = new URLSearchParams(window.location.search);
    const filters: EventFilters = {
        title: '',
        startAtRange: null,
        finishAtRange: null,
    };

    if (urlParams.get('title')) {
        filters.title = urlParams.get('title');
    }

    if (urlParams.get('start-at-from') && urlParams.get('start-at-to')) {
        filters.startAtRange = [new Date(urlParams.get('start-at-from') as string), new Date(urlParams.get('start-at-to') as string)];
    } else {
        filters.startAtRange = [new Date(), new Date()];
    }

    if (urlParams.get('finish-at-from') && urlParams.get('finish-at-to')) {
        filters.finishAtRange = [new Date(urlParams.get('finish-at-from') as string), new Date(urlParams.get('finish-at-to') as string)];
    }

    return filters;
};

export const getPageFromUrl = (): number => {
    const urlParams = new URLSearchParams(window.location.search);

    const page = parseInt(urlParams.get('page') ?? '1');

    return Number.isNaN(page) ? 1 : page;
};

export const getPerPageFromUrl = (): number => {
    const urlParams = new URLSearchParams(window.location.search);

    const perPage = parseInt(urlParams.get('per_page') ?? '20');

    return Number.isNaN(perPage) ? 20 : perPage;
};
