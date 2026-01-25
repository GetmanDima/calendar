import { ApiResponse } from '@/shared/types/api';
import axios, { Method } from 'axios';
import { snakeToCamelKeys } from './helpers';

interface AxiosOptions {
    baseUrl?: string;
    token?: string;
}

const initAxios = (options?: AxiosOptions) => {
    return axios.create({
        withCredentials: true,
        baseURL: options?.baseUrl ?? import.meta.env.VITE_APP_URL ?? 'http://localhost:8000',
    });
};

export const sendApiRequest = async <D = any>(url: string, method: Method, data?: any): Promise<ApiResponse<D>> => {
    try {
        const requestConfig: { [key: string]: any } = {
            url,
            method,
        };

        if (method === 'GET') {
            requestConfig.params = data;
        } else {
            requestConfig.data = data;
        }

        const response = await axios.request(requestConfig);

        return {
            response: response,
            status: response.status,
            transformedData: snakeToCamelKeys(response.data),
            hasValidationErrors: false,
        };
    } catch (e: any) {
        const response: ApiResponse = {
            response: e.response,
            status: e.status,
            transformedData: snakeToCamelKeys(e.response?.data),
            error: e,
            errorMessage: e.response?.data?.message ?? e.message,
            hasValidationErrors: false,
        };

        if (e.status === 422) {
            const errors = e.response?.data?.errors;

            if (errors) {
                const transformedErrors = snakeToCamelKeys(errors);

                if (transformedErrors) {
                    response.hasValidationErrors = true;
                }

                response.transformedValidationErrors = transformedErrors;
            }
        }

        return response;
    }
};

const axiosInstance = initAxios();

export default axiosInstance;
