export const getCookie = (name: string): string | null => {
    const cookies = document.cookie.split('; ');

    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
};

export const insertFieldNameIntoString = (field: string, str: string): string => {
    return str.replace(':field', field);
};

export const camelToSnakeKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToSnakeKeys(item));
    }

    const snakeObj: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();

        snakeObj[snakeKey] = camelToSnakeKeys(value);
    }

    return snakeObj;
};

export const snakeToCamelKeys = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamelKeys(item));
    }

    const camelObj: { [key: string]: any } = {};

    for (const [key, value] of Object.entries(obj)) {
        const camelKey = key.replace(/(_[a-z])/g, (match) => match.charAt(1).toUpperCase());

        camelObj[camelKey] = snakeToCamelKeys(value);
    }

    return camelObj;
};

export const findKeysForChangedValues = <T extends { [field: string]: any }>(oldObj: T, newObj: T): (keyof T)[] => {
    const changed: string[] = [];

    Object.keys(newObj).forEach((key) => {
        if (oldObj[key] !== newObj[key]) {
            changed.push(key);
        }
    });

    return changed;
};

export const sleep = (ms: number): Promise<number> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const redirect = (url: string) => {
    window.location.href = url;
};

export const insertTimeIntoDate = (date: Date, time: string): Date => {
    const [hours, minutes, seconds] = time.split(':');

    const dateWithTime = new Date(date);

    dateWithTime.setHours(parseInt(hours ?? '0'));
    dateWithTime.setMinutes(parseInt(minutes ?? '0'));
    dateWithTime.setSeconds(parseInt(seconds ?? '0'));

    return dateWithTime;
};

export const convertToUTCDateTimeString = (date: Date): string => {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
};

export const parseUTCDateTimeString = (dateTime: string): Date => {
    return new Date(dateTime + 'Z');
};

export const convertToDateTimeString = (date: Date, includeSeconds = false) => {
    return getDatePart(date) + ' ' + getTimePart(date, includeSeconds);
};

export const getDatePart = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const getTimePart = (date: Date, includeSeconds = false): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = includeSeconds ? String(date.getSeconds()).padStart(2, '0') : null;

    if (seconds) {
        return `${hours}:${minutes}:${seconds}`;
    }

    return `${hours}:${minutes}`;
};
