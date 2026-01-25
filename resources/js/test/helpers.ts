import { sleep } from '@/shared/lib/helpers';
import { t } from '@/shared/lib/i18n';
import { fireEvent, screen } from '@testing-library/vue';

export const testRequired = async (fieldInput: HTMLElement) => {
    await fireEvent.focus(fieldInput);
    await fireEvent.update(fieldInput, '');
    await fireEvent.blur(fieldInput);
    await screen.findByText(t('validation.required'));

    await fireEvent.focus(fieldInput);
    await fireEvent.update(fieldInput, ' ');
    await fireEvent.blur(fieldInput);
    await screen.findByText(t('validation.required'));
};

export const testNotRequired = async (fieldInput: HTMLElement) => {
    await fireEvent.focus(fieldInput);
    await fireEvent.update(fieldInput, '');
    await fireEvent.blur(fieldInput);
    expect(screen.queryByText(t('validation.required'))).toBeNull();

    await fireEvent.focus(fieldInput);
    await fireEvent.update(fieldInput, ' ');
    await fireEvent.blur(fieldInput);
    expect(screen.queryByText(t('validation.required'))).toBeNull();
};

export const testValidValues = async (fieldInput: HTMLElement, values: string[], possibleErrorMessage: string) => {
    for (const value of values) {
        await fireEvent.update(fieldInput, value);
        await sleep(10);

        expect(screen.queryByText(possibleErrorMessage)).toBeNull();
        expect(screen.queryByText(t('validation.required'))).toBeNull();
    }
};

export const testInvalidValues = async (fieldInput: HTMLElement, values: string[], errorMessage: string) => {
    for (const value of values) {
        await fireEvent.update(fieldInput, value);
        await screen.findByText(errorMessage);
    }
};
