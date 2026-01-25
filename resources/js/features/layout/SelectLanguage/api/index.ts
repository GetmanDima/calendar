import { sendApiRequest } from '@/shared/lib/api';
import { ApiResponse } from '@/shared/types/api';

export const changeLanguage = (language: string): Promise<ApiResponse> => {
    return sendApiRequest('/api/language/change', 'POST', {
        language,
    });
};
