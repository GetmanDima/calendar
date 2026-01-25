import { AxiosError, AxiosResponse } from 'axios';

export interface ErrorResponseData {
    errors?: { [field: string]: string[] };
    message?: string;
}

export interface ValidationErrors {
    [field: string]: string[];
}

export interface ApiResponse<D = any> {
    response?: AxiosResponse;
    status: number;
    transformedData?: D;
    error?: AxiosError;
    errorMessage?: string;
    transformedValidationErrors?: ValidationErrors;
    hasValidationErrors: boolean;
}
