import { sendApiRequest } from '@/shared/lib/api';
import { camelToSnakeKeys } from '@/shared/lib/helpers';
import { ApiResponse } from '@/shared/types/api';
import { RegisterRequestData } from '../model/types';

export const register = (data: RegisterRequestData): Promise<ApiResponse> => {
    return sendApiRequest('/api/register', 'POST', camelToSnakeKeys(data));
};
