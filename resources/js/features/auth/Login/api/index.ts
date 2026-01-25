import { sendApiRequest } from '@/shared/lib/api';
import { ApiResponse } from '@/shared/types/api';
import { LoginFormData } from '../model/types';

export const login = (data: LoginFormData): Promise<ApiResponse> => {
    return sendApiRequest('/api/login', 'POST', data);
};
