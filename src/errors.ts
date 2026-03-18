export class PolicyDiffError extends Error {
  public requestId?: string;

  constructor(message: string, requestId?: string) {
    super(message);
    this.name = 'PolicyDiffError';
    this.requestId = requestId;
  }
}

export class PolicyDiffAuthError extends PolicyDiffError {
  constructor(message: string, requestId?: string) {
    super(message, requestId);
    this.name = 'PolicyDiffAuthError';
  }
}

export class PolicyDiffRateLimitError extends PolicyDiffError {
  constructor(message: string, requestId?: string) {
    super(message, requestId);
    this.name = 'PolicyDiffRateLimitError';
  }
}

export class PolicyDiffValidationError extends PolicyDiffError {
  public details?: unknown;

  constructor(message: string, requestId?: string, details?: unknown) {
    super(message, requestId);
    this.name = 'PolicyDiffValidationError';
    this.details = details;
  }
}

export class PolicyDiffUpstreamError extends PolicyDiffError {
  constructor(message: string, requestId?: string) {
    super(message, requestId);
    this.name = 'PolicyDiffUpstreamError';
  }
}

export class PolicyDiffApiError extends PolicyDiffError {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number, requestId?: string, details?: unknown) {
    super(message, requestId);
    this.name = 'PolicyDiffApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class PolicyDiffNetworkError extends PolicyDiffError {
  constructor(message: string, public originalError: Error) {
    super(message);
    this.name = 'PolicyDiffNetworkError';
  }
}

export class PolicyDiffTimeoutError extends PolicyDiffError {
  constructor(message: string) {
    super(message);
    this.name = 'PolicyDiffTimeoutError';
  }
}
