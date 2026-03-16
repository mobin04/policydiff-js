export interface PolicyDiffConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface CheckRequest {
  url: string;
}

export interface CheckResponse {
  // Add specific fields based on PolicyDiff API check response schema
  [key: string]: unknown;
}

export interface MonitorRequest {
  url: string;
}

export interface MonitorBatchRequest {
  urls: string[];
}

export interface MonitorResponse {
  job_id: string;
}

export interface JobResponse {
  job_id: string;
  status: 'pending' | 'completed' | 'failed';
  result?: unknown;
  created_at: string;
  [key: string]: unknown;
}

export interface UsageResponse {
  quota: number;
  used: number;
  remaining: number;
  reset_at: string;
  [key: string]: unknown;
}
