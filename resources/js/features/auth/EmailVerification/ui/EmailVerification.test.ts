import * as api from '@/shared/lib/api';
import { t } from '@/shared/lib/i18n';
import { fireEvent, render, screen, waitFor } from '@testing-library/vue';
import { AxiosError } from 'axios';
import { vi } from 'vitest';
import EmailVerification from './EmailVerification.vue';

const verificationData = {
    userId: '1',
    hash: 'hash',
    expires: '1',
    signature: 'signature',
};

beforeEach(() => {
    render(EmailVerification, {
        props: {
            verificationData,
        },
    });
});

vi.spyOn(api, 'sendApiRequest')
    .mockReturnValueOnce(
        new Promise((resolve) => {
            setTimeout(() => {
                resolve({ status: 200, hasValidationErrors: false });
            }, 1000);
        }),
    )
    .mockReturnValue(
        new Promise((resolve) => {
            resolve({ error: new AxiosError(), status: 500, hasValidationErrors: false });
        }),
    );

test('Verify email is called on mount', async () => {
    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith(`/api/email/verify/${verificationData.userId}/${verificationData.hash}`, 'GET', {
            expires: verificationData.expires,
            signature: verificationData.signature,
        });
    });

    await screen.findByText(t('email_verification.in_process'));
});

test('Resend verification button triggers API call', async () => {
    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalled();
    });
    await screen.findByText(t('email_verification.description'));

    const resendButton = screen.getByRole('button', {
        name: new RegExp(t('email_verification.resend'), 'i'),
    });

    await fireEvent.click(resendButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/email/verification-notification', 'POST');
    });
});

test('Logout button triggers API call', async () => {
    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalled();
    });
    await screen.findByText(t('email_verification.description'));

    const logoutButton = screen.getByRole('button', {
        name: new RegExp(t('email_verification.logout'), 'i'),
    });

    await fireEvent.click(logoutButton);

    await waitFor(() => {
        expect(api.sendApiRequest).toHaveBeenCalledWith('/api/logout', 'POST');
    });
});
