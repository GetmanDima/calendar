import { User } from '@/entities/user/model/types';
import i18n from '@/shared/lib/i18n';
import { GlobalAlert } from '@/shared/types/layout';
import { config } from '@vue/test-utils';
import { ref } from 'vue';
import { createVuetify } from 'vuetify';

config.global.plugins.push(i18n);
config.global.plugins.push(createVuetify());
config.global.provide.globalAlert = ref<GlobalAlert>({
    text: '',
    type: 'error',
});
config.global.provide.authenticatedUser = ref<User>({
    id: 1,
    email: 'test@example.com',
    firstName: 'Ivan',
    lastName: 'Ivanov',
    middleName: 'Ivanovich',
});
config.global.provide.authenticatedUserLoading = ref(false);
