export interface EventFormData {
    title: string;
    description: string;
    startAtDate: Date;
    startAtTime: string;
    finishAtDate: Date;
    finishAtTime: string;
    remindAboutStartAtDate: Date | null;
    remindAboutStartAtTime: string | null;
    remindAboutFinishAtDate: Date | null;
    remindAboutFinishAtTime: string | null;
}
