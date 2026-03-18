export declare class PolicyDiffError extends Error {
    requestId?: string;
    constructor(message: string, requestId?: string);
}
export declare class PolicyDiffAuthError extends PolicyDiffError {
    constructor(message: string, requestId?: string);
}
export declare class PolicyDiffRateLimitError extends PolicyDiffError {
    constructor(message: string, requestId?: string);
}
export declare class PolicyDiffValidationError extends PolicyDiffError {
    details?: unknown;
    constructor(message: string, requestId?: string, details?: unknown);
}
export declare class PolicyDiffUpstreamError extends PolicyDiffError {
    constructor(message: string, requestId?: string);
}
export declare class PolicyDiffApiError extends PolicyDiffError {
    statusCode: number;
    details?: unknown;
    constructor(message: string, statusCode: number, requestId?: string, details?: unknown);
}
export declare class PolicyDiffNetworkError extends PolicyDiffError {
    originalError: Error;
    constructor(message: string, originalError: Error);
}
export declare class PolicyDiffTimeoutError extends PolicyDiffError {
    constructor(message: string);
}
