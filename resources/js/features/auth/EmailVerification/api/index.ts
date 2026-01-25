import { sendApiRequest } from '@/shared/lib/api';
import { ApiResponse } from '@/shared/types/api';
import { VerificationRequestData } from '../model/types';

export const verifyEmail = (data: VerificationRequestData): Promise<ApiResponse> => {
    const params = {
        expires: data.expires,
        signature: data.signature,
    };

    const path = '/api/email/verify/' + data.userId + '/' + data.hash;

    return sendApiRequest(path, 'GET', params);
};

export const resendVerification = (): Promise<ApiResponse> => {
    return sendApiRequest('/api/email/verification-notification', 'POST');
};
