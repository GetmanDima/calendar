export interface RegisterRequestData {
    email: string;
    firstName: string;
    lastName: string;
    middleName: string;
    password: string;
}

export interface RegisterFormData extends RegisterRequestData {
    passwordConfirmation: string;
}
