import * as api from '@/shared/lib/api';
import { insertFieldNameIntoString, sleep } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testInvalidValues, testNotRequired, testRequired, testValidValues } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import Register from './Register.vue';

type FieldKey = 'email' | 'firstName' | 'lastName' | 'middleName' | 'password' | 'passwordConfirmation';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 201 })));

beforeEach(() => {
    render(Register);
});

test('Email validation', async () => {
    const { email: emailInput } = getInputsFromScreen();

    const validValues = ['test@example.com', 'TEST@EXAMPLE.COM', 'тест@пример.рф'];
    const invalidValues = ['email', '123', '123@', '@ya.ru', '.@ya.ru'];

    await testRequired(emailInput);
    await testValidValues(emailInput, validValues, t('validation.auth.email'));
    await testInvalidValues(emailInput, invalidValues, t('validation.auth.email'));
});

test('First name validation', async () => {
    const { firstName: firstNameInput } = getInputsFromScreen();

    const validValues = ['Ivan', 'Иван', 'I', 'Anna Maria'];
    const invalidValues = ['123', 'Ivan123', '!'];

    await testRequired(firstNameInput);
    await testValidValues(firstNameInput, validValues, insertFieldNameIntoString('First name', t('validation.auth.name')));
    await testInvalidValues(firstNameInput, invalidValues, insertFieldNameIntoString('First name', t('validation.auth.name')));
});

test('Last name validation', async () => {
    const { lastName: lastNameInput } = getInputsFromScreen();

    const validValues = ['Ivanov', 'Иванов', 'I', 'Anna Maria'];
    const invalidValues = ['123', 'Ivanov123', '!'];

    await testNotRequired(lastNameInput);
    await testValidValues(lastNameInput, validValues, insertFieldNameIntoString('Last name', t('validation.auth.name')));
    await testInvalidValues(lastNameInput, invalidValues, insertFieldNameIntoString('Last name', t('validation.auth.name')));
});

test('Middle name validation', async () => {
    const { middleName: middleNameInput } = getInputsFromScreen();

    const validValues = ['Ivanovich', 'Иванович', 'I', 'Anna Maria'];
    const invalidValues = ['123', 'Ivanovich123', '!'];

    await testNotRequired(middleNameInput);
    await testValidValues(middleNameInput, validValues, insertFieldNameIntoString('Middle name', t('validation.auth.name')));
    await testInvalidValues(middleNameInput, invalidValues, insertFieldNameIntoString('Middle name', t('validation.auth.name')));
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
        name: new RegExp(t('register.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await sleep(10);
    expect(api.sendApiRequest).not.toHaveBeenCalled();
});

test('Successful submit', async () => {
    const {
        email: emailInput,
        firstName: firstNameInput,
        lastName: lastNameInput,
        middleName: middleNameInput,
        password: passwordInput,
        passwordConfirmation: passwordConfirmationInput,
    } = getInputsFromScreen();

    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('register.submit'), 'i'),
    });

    await fireEvent.update(emailInput, 'test@example.com');
    await fireEvent.update(firstNameInput, 'Ivan');
    await fireEvent.update(lastNameInput, 'Ivanov');
    await fireEvent.update(middleNameInput, 'Ivanovich');
    await fireEvent.update(passwordInput, '12345678');
    await fireEvent.update(passwordConfirmationInput, '12345678');
    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/register', 'POST', {
            email: 'test@example.com',
            first_name: 'Ivan',
            last_name: 'Ivanov',
            middle_name: 'Ivanovich',
            password: '12345678',
        });
    });
});

const getInputsFromScreen = (): { [fieldKey in FieldKey]: any } => {
    return {
        email: screen.getByLabelText(new RegExp(t('register.fields.email'), 'i')),
        firstName: screen.getByLabelText(new RegExp(t('register.fields.first_name'), 'i')),
        lastName: screen.getByLabelText(new RegExp(t('register.fields.last_name'), 'i')),
        middleName: screen.getByLabelText(new RegExp(t('register.fields.middle_name'), 'i')),
        password: screen.getByLabelText(new RegExp('^' + t('register.fields.password') + ' \\*$', 'i')),
        passwordConfirmation: screen.getByLabelText(new RegExp('^' + t('register.fields.password_confirmation') + ' \\*$', 'i')),
    };
};
