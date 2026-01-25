import * as api from '@/shared/lib/api';
import { t } from '@/shared/lib/i18n';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import SelectLanguage from './SelectLanguage.vue';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 200 })));

// Defined for mouseDown
// @ts-expect-error 2740
window.visualViewport = {
    addEventListener: () => {},
    removeEventListener: () => {},
};

beforeEach(() => {
    render(SelectLanguage);
});

test('Api request when change language', async () => {
    const languageSelect = screen.getByRole('combobox', {
        name: new RegExp(t('layout.language'), 'i'),
    });

    await fireEvent.mouseDown(languageSelect);

    const option = await screen.findByText('RU');
    await fireEvent.click(option);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/language/change', 'POST', {
            language: 'ru',
        });
    });
});
