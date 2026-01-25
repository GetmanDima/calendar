import * as api from '@/shared/lib/api';
import { sleep } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testInvalidValues, testRequired, testValidValues } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import PasswordReset from './PasswordReset.vue';

type FieldKey = 'password' | 'passwordConfirmation';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(
    new Promise((resolve) => {
        resolve({
            status: 200,
            transformedData: { status: 'Your password has been reset.' },
            hasValidationErrors: false,
        });
    }),
);

const props = {
    token: 'token',
    email: 'test@example.com',
};

beforeEach(() => {
    render(PasswordReset, { props });
});

test('Password validation', async () => {
    const { password: passwordInput } = getInputsFromScreen();

    const validValues = ['12345678', 'a 1 б 2 c 3 d 5', ';@#*^!a1'];
    const invalidValues = ['short', '1234567', 'test123', '    5678'];

    await testRequired(passwordInput);
    await testValidValues(passwordInput, validValues, t('validation.auth.password'));
    await testInvalidValues(passwordInput, invalidValues, t('validation.auth.password'));
});

test('Confirm password validation', async () => {
    const { password: passwordInput, passwordConfirmation: passwordConfirmationInput } = getInputsFromScreen();

    await fireEvent.update(passwordInput, '12345678');
    await fireEvent.update(passwordConfirmationInput, '1234567');
    await screen.findByText(t('validation.auth.password_confirmation'));

    await fireEvent.update(passwordConfirmationInput, '12345678');

    waitFor(() => {
        expect(screen.queryByText(t('validation.auth.password_confirmation'))).toBeNull();
    });
});

test('Validation on submit', async () => {
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('password_reset.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await sleep(10);
    expect(api.sendApiRequest).not.toHaveBeenCalled();
});

test('Successful submit', async () => {
    const { password: passwordInput, passwordConfirmation: passwordConfirmationInput } = getInputsFromScreen();
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('password_reset.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await fireEvent.update(passwordInput, '12345678');
    await fireEvent.update(passwordConfirmationInput, '12345678');
    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/reset-password', 'POST', {
            email: props.email,
            token: props.token,
            password: '12345678',
            password_confirmation: '12345678',
        });
    });
});

const getInputsFromScreen = (): { [fieldKey in FieldKey]: any } => {
    return {
        password: screen.getByLabelText(new RegExp('^' + t('password_reset.fields.password') + '$', 'i')),
        passwordConfirmation: screen.getByLabelText(new RegExp('^' + t('password_reset.fields.password_confirmation') + '$', 'i')),
    };
};
