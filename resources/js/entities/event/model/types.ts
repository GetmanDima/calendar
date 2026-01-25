export interface EventListResponseData {
    data: EventItem[];
    meta: {
        currentPage: number;
        lastPage: number;
    };
}

export interface EventItem {
    id: number;
    title: string;
    limitedDescription: string;
    descriptionRealLength: number;
    startAt: Date;
    finishAt: Date;
    remindAboutStartAt: Date | null;
    remindAboutFinishAt: Date | null;
}

export interface Event {
    id: number;
    title: string;
    description: string;
    startAt: Date;
    finishAt: Date;
    remindAboutStartAt: Date | null;
    remindAboutFinishAt: Date | null;
}
