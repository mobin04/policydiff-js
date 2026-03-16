export class PolicyDiffError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PolicyDiffError';
  }
}

export class PolicyDiffApiError extends PolicyDiffError {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
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
