import * as api from '@/shared/lib/api';
import { insertFieldNameIntoString } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { testInvalidValues, testNotRequired, testRequired, testValidValues } from '@/test/helpers';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import PersonalDataUpdateForm from './PersonalDataUpdateForm.vue';

type FieldKey = 'firstName' | 'lastName' | 'middleName';

vi.spyOn(api, 'sendApiRequest').mockReturnValue(new Promise(() => ({ status: 200 })));

beforeEach(() => {
    render(PersonalDataUpdateForm);
});

test('Filled by user data on mount', async () => {
    const { firstName: firstNameInput, lastName: lastNameInput, middleName: middleNameInput } = getInputsFromScreen();

    expect(firstNameInput.value).toBe('Ivan');
    expect(lastNameInput.value).toBe('Ivanov');
    expect(middleNameInput.value).toBe('Ivanovich');
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

test('Successful submit', async () => {
    const submitButton = screen.getByRole('button', {
        name: new RegExp(t('personal_data.submit'), 'i'),
    });

    await fireEvent.click(submitButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/profile/personal-data', 'PUT', {
            first_name: 'Ivan',
            last_name: 'Ivanov',
            middle_name: 'Ivanovich',
        });
    });
});

const getInputsFromScreen = (): { [fieldKey in FieldKey]: any } => {
    return {
        firstName: screen.getByLabelText(new RegExp(t('personal_data.fields.first_name'), 'i')),
        lastName: screen.getByLabelText(new RegExp(t('personal_data.fields.last_name'), 'i')),
        middleName: screen.getByLabelText(new RegExp(t('personal_data.fields.middle_name'), 'i')),
    };
};
