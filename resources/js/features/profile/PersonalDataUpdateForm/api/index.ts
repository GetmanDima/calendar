import { sendApiRequest } from '@/shared/lib/api';
import { camelToSnakeKeys } from '@/shared/lib/helpers';
import { ApiResponse } from '@/shared/types/api';
import { UpdatePersonalFormData } from '../model/types';

export const updateProfile = (data: UpdatePersonalFormData): Promise<ApiResponse> => {
    return sendApiRequest('/api/profile/personal-data', 'PUT', camelToSnakeKeys(data));
};
