export declare class PolicyDiffError extends Error {
    constructor(message: string);
}
export declare class PolicyDiffApiError extends PolicyDiffError {
    statusCode: number;
    details?: unknown;
    constructor(message: string, statusCode: number, details?: unknown);
}
export declare class PolicyDiffNetworkError extends PolicyDiffError {
    originalError: Error;
    constructor(message: string, originalError: Error);
}
