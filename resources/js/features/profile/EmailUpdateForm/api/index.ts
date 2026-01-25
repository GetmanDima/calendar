import { sendApiRequest } from '@/shared/lib/api';
import { camelToSnakeKeys } from '@/shared/lib/helpers';
import { ApiResponse } from '@/shared/types/api';
import { UpdateEmailFormData } from '../model/types';

export const updateEmail = (data: UpdateEmailFormData): Promise<ApiResponse> => {
    return sendApiRequest('/api/profile/email', 'PUT', camelToSnakeKeys(data));
};
