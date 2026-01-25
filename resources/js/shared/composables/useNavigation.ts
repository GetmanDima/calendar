import { inject, provide, ref, Ref } from 'vue';
import { NavigationItem } from '../types/navigation';

export const useNavigation = () => {
    let selectedNavigationItem = inject('selectedGlobalNavigationItem') as Ref<NavigationItem | null> | undefined;

    if (!selectedNavigationItem) {
        selectedNavigationItem = ref<NavigationItem | null>(null);
        provide<typeof selectedNavigationItem>('selectedGlobalNavigationItem', selectedNavigationItem);
    }

    const selectNavigationItem = (navigationItem: NavigationItem) => {
        selectedNavigationItem.value = navigationItem;
    };

    return {
        selectedNavigationItem,
        selectNavigationItem,
    };
};
