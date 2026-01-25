export interface NavigationItem {
    key: string;
    title: string;
    link: string;
}

export type NavigationItems = { [key: string]: NavigationItem };
