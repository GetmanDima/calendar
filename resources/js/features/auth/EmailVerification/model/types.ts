export interface VerificationData {
    userId: string | null;
    hash: string | null;
    expires: string | null;
    signature: string | null;
}

export interface VerificationRequestData {
    userId: string;
    hash: string;
    expires: string;
    signature: string;
}
