export class PolicyDiffError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PolicyDiffError';
    }
}
export class PolicyDiffApiError extends PolicyDiffError {
    constructor(message, statusCode, details) {
        super(message);
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
//# sourceMappingURL=errors.js.map