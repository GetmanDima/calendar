import * as api from '@/shared/lib/api';
import { sleep } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testInvalidValues, testRequired, testValidValues } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import PasswordForgot from './PasswordForgot.vue';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 200 })));

beforeEach(() => {
    render(PasswordForgot);
});

test('Email validation', async () => {
    const emailInput = getEmailInput();

    const validValues = ['test@example.com', 'TEST@EXAMPLE.COM', 'тест@пример.рф'];
    const invalidValues = ['email', '123', '123@', '@ya.ru', '.@ya.ru'];

    await testRequired(emailInput);
    await testValidValues(emailInput, validValues, t('validation.auth.email'));
    await testInvalidValues(emailInput, invalidValues, t('validation.auth.email'));
});

test('Validation on submit', async () => {
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('password_forgot.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await sleep(10);
    expect(api.sendApiRequest).not.toHaveBeenCalled();
});

test('Successful submit', async () => {
    const emailInput = getEmailInput();
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('password_forgot.submit'), 'i'),
    });

    await fireEvent.update(emailInput, 'test@example.com');
    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/forgot-password', 'POST', {
            email: 'test@example.com',
        });
    });
});

const getEmailInput = () => {
    return screen.getByLabelText(new RegExp(t('password_forgot.fields.email'), 'i'));
};
