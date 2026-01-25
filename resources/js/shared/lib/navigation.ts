import { NavigationItems } from '../types/navigation';

export const getDefaultNavigationItems = (t: (key: string) => string): NavigationItems => {
    return {
        events: { key: 'events', title: t('navigation.default.events'), link: '/events' },
        profile: { key: 'profile', title: t('navigation.default.profile'), link: '/profile/personal-data' },
    };
};
