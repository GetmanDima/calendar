import * as api from '@/shared/lib/api';
import { sleep } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testInvalidValues, testRequired, testValidValues } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import EmailUpdateForm from './EmailUpdateForm.vue';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 200 })));

beforeEach(() => {
    render(EmailUpdateForm);
});

test('Filled by user data on mount', async () => {
    const emailInput = getEmailInput();

    expect(emailInput.value).toBe('test@example.com');
});

test('Email validation', async () => {
    const emailInput = getEmailInput();

    const validValues = ['test@example.com', 'TEST@EXAMPLE.COM', 'тест@пример.рф'];
    const invalidValues = ['email', '123', '123@', '@ya.ru', '.@ya.ru'];

    await testRequired(emailInput);
    await testValidValues(emailInput, validValues, t('validation.auth.email'));
    await testInvalidValues(emailInput, invalidValues, t('validation.auth.email'));
});

test('Same value validation on submit', async () => {
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('email.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await sleep(10);
    expect(api.sendApiRequest).not.toHaveBeenCalled();
});

test('Empty value validation on submit', async () => {
    const emailInput = getEmailInput();
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('email.submit'), 'i'),
    });

    await fireEvent.update(emailInput, '');

    await fireEvent.click(submitButton);
    await sleep(10);
    expect(api.sendApiRequest).not.toHaveBeenCalled();
});

test('Successful submit', async () => {
    const emailInput = getEmailInput();
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('email.submit'), 'i'),
    });

    await fireEvent.update(emailInput, 'test-new@example.com');
    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/profile/email', 'PUT', {
            email: 'test-new@example.com',
        });
    });
});

const getEmailInput = (): HTMLInputElement => {
    return screen.getByLabelText(new RegExp(t('email.fields.email'), 'i'));
};
