export class PolicyDiffError extends Error {
    constructor(message, requestId) {
        super(message);
        this.name = 'PolicyDiffError';
        this.requestId = requestId;
    }
}
export class PolicyDiffAuthError extends PolicyDiffError {
    constructor(message, requestId) {
        super(message, requestId);
        this.name = 'PolicyDiffAuthError';
    }
}
export class PolicyDiffRateLimitError extends PolicyDiffError {
    constructor(message, requestId) {
        super(message, requestId);
        this.name = 'PolicyDiffRateLimitError';
    }
}
export class PolicyDiffValidationError extends PolicyDiffError {
    constructor(message, requestId, details) {
        super(message, requestId);
        this.name = 'PolicyDiffValidationError';
        this.details = details;
    }
}
export class PolicyDiffUpstreamError extends PolicyDiffError {
    constructor(message, requestId) {
        super(message, requestId);
        this.name = 'PolicyDiffUpstreamError';
    }
}
export class PolicyDiffApiError extends PolicyDiffError {
    constructor(message, statusCode, requestId, details) {
        super(message, requestId);
        this.name = 'PolicyDiffApiError';
        this.statusCode = statusCode;
        this.details = details;
    }
}
export class PolicyDiffNetworkError extends PolicyDiffError {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'PolicyDiffNetworkError';
    }
}
export class PolicyDiffTimeoutError extends PolicyDiffError {
    constructor(message) {
        super(message);
        this.name = 'PolicyDiffTimeoutError';
    }
}
//# sourceMappingURL=errors.js.map