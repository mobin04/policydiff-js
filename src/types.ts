/** Semantic risk level of a detected change */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/** Type of structural change in a policy section */
export type SectionDiffType = 'ADDED' | 'DELETED' | 'MODIFIED' | 'TITLE_RENAMED';

/** Word-level diff detail */
export interface DiffDetail {
  value: string;
  added: boolean;
  removed: boolean;
}

/** Representation of a section-level change */
export type Change =
  | { section: string; type: 'ADDED' }
  | { section: string; type: 'DELETED' }
  | { section: string; type: 'MODIFIED'; details: DiffDetail[] }
  | { type: 'TITLE_RENAMED'; oldTitle: string; newTitle: string; contentHash: string };

/** A change augmented with risk classification and reasoning */
export type RiskedChange = Change & {
  risk: RiskLevel;
  reason: string;
};

/** Standard diff result returned by check endpoint or async jobs */
export type DiffResult = {
  message: string;
  risk_level?: RiskLevel;
  changes?: RiskedChange[];
  /** Isolation status for internal metrics */
  content_isolation?: 'success' | 'fallback';
  /** True if container selection drifted since last run */
  isolation_drift?: boolean;
  /** True if numeric override hardening was triggered */
  numeric_override_triggered?: boolean;
  /** Internal matching metrics */
  fuzzy_match_count?: number;
  low_confidence_fuzzy_match_count?: number;
  fuzzy_collision_count?: number;
  title_rename_count?: number;
};

/** Extended check result including skip status */
export type CheckResult = {
  status: 'processed' | 'skipped';
  reason?: string;
  last_checked?: string;
  result?: DiffResult;
};

/** 
 * Combined type for /v1/check to handle both standard and flattened responses
 */
export type CheckResponse = CheckResult & DiffResult;

export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export type JobErrorType =
  | 'INVALID_URL'
  | 'FETCH_ERROR'
  | 'HTTP_ERROR'
  | 'TIMEOUT'
  | 'DNS_FAILURE'
  | 'CONNECTION_ERROR'
  | 'INTERNAL_ERROR'
  | 'CRASH_RECOVERY'
  | 'JOB_TIMEOUT'
  | 'UNSUPPORTED_DYNAMIC_PAGE'
  | 'PAGE_ACCESS_BLOCKED'
  | 'INVALID_PAGE_CONTENT';

/** Request body for POST /v1/monitor */
export type MonitorRequestBody = {
  url: string;
};

/** Response for POST /v1/monitor */
export type MonitorJobCreatedResponse = {
  job_id: string;
  status: JobStatus;
};

/** Discriminated unions for GET /v1/jobs/:jobId */
export type JobPendingResponse = {
  url: string;
  job_id: string;
  status: 'PENDING' | 'PROCESSING';
};

export type JobCompletedResponse = {
  url: string;
  job_id: string;
  status: 'COMPLETED';
  result: DiffResult;
};

export type JobFailedResponse = {
  url: string;
  job_id: string;
  status: 'FAILED';
  error_type: JobErrorType;
};

export type JobStatusResponse = JobPendingResponse | JobCompletedResponse | JobFailedResponse;

/** Request body for POST /v1/monitor/batch */
export type MonitorBatchRequestBody = {
  urls: string[];
};

export type MonitorBatchCreatedJob = {
  url: string;
  job_id: string;
  status: 'PENDING';
};

/** Response for POST /v1/monitor/batch */
export type MonitorBatchCreatedResponse = {
  batch_id: string;
  total_jobs: number;
  jobs: MonitorBatchCreatedJob[];
};

export type BatchJobStatusItem = {
  url: string;
  job_id: string;
  status: JobStatus;
};

/** Response for GET /v1/batches/:batchId */
export type BatchStatusResponse = {
  batch_id: string;
  total: number;
  completed: number;
  processing: number;
  failed: number;
  jobs: BatchJobStatusItem[];
};

/** SDK Configuration */
export interface PolicyDiffConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface UsageResponse {
  tier: string;
  monthly_quota: number;
  monthly_usage: number;
  remaining: number;
  quota_reset_at: string;
}

/** Error Response from API */
export interface ErrorResponse {
  error: string;
  message: string;
  request_id: string;
}
