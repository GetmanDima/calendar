import { sendApiRequest } from '@/shared/lib/api';
import { ApiResponse } from '@/shared/types/api';
import { User } from '../model/types';

export const getUser = (): Promise<ApiResponse<User>> => {
    return sendApiRequest('/api/profile', 'GET');
};

export const logout = (): Promise<ApiResponse> => {
    return sendApiRequest('/api/logout', 'POST');
};
