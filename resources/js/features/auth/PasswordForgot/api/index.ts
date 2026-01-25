import { sendApiRequest } from '@/shared/lib/api';
import { ApiResponse } from '@/shared/types/api';
import { PasswordForgotFormData } from '../model/types';

export const forgotPassword = (data: PasswordForgotFormData): Promise<ApiResponse<{ status: string }>> => {
    return sendApiRequest('/api/forgot-password', 'POST', data);
};
