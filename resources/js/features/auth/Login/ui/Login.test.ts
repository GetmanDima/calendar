import * as api from '@/shared/lib/api';
import { t } from '@/shared/lib/i18n';
import { testRequired } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import Login from './Login.vue';

type FieldKey = 'email' | 'password' | 'remember';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 200 })));

beforeEach(() => {
    render(Login);
});

test('Email validation', async () => {
    const { email: emailInput } = getInputsFromScreen();

    await testRequired(emailInput);
});

test('Password validation', async () => {
    const { password: passwordInput } = getInputsFromScreen();

    await testRequired(passwordInput);
});

test('Validation on submit', async () => {
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('login.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(api.sendApiRequest).not.toHaveBeenCalled();
});

test('Successful submit', async () => {
    const { email: emailInput, password: passwordInput, remember: rememberCheckbox } = getInputsFromScreen();

    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('login.submit'), 'i'),
    });

    await fireEvent.update(emailInput, 'test@example.com');
    await fireEvent.update(passwordInput, '12345678');
    await fireEvent.click(rememberCheckbox);
    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/login', 'POST', {
            email: 'test@example.com',
            password: '12345678',
            remember: true,
        });
    });
});

const getInputsFromScreen = (): { [fieldKey in FieldKey]: any } => {
    return {
        email: screen.getByLabelText(new RegExp(t('login.fields.email'), 'i')),
        password: screen.getByLabelText(new RegExp('^' + t('login.fields.password') + '$', 'i')),
        remember: screen.getByLabelText(new RegExp(t('login.fields.remember'), 'i')),
    };
};
