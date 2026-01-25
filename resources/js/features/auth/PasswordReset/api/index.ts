import { sendApiRequest } from '@/shared/lib/api';
import { camelToSnakeKeys } from '@/shared/lib/helpers';
import { ApiResponse } from '@/shared/types/api';
import { PasswordResetFormData } from '../model/types';

export const resetPassword = (data: PasswordResetFormData): Promise<ApiResponse<{ status: string }>> => {
    return sendApiRequest('/api/reset-password', 'POST', camelToSnakeKeys(data));
};
