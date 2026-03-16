export interface PolicyDiffConfig {
    apiKey: string;
    baseUrl?: string;
}
export interface ChangeDetail {
    value: string;
    added: boolean;
    removed: boolean;
}
export interface PolicyChange {
    section: string;
    type: 'MODIFIED' | 'ADDED' | 'REMOVED';
    details: ChangeDetail[];
    risk: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    reason: string;
}
export interface CheckResponse {
    message: string;
    content_isolation: string;
    isolation_drift: boolean;
    risk_level?: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
    changes?: PolicyChange[];
    numeric_override_triggered?: boolean;
    fuzzy_match_count?: number;
    low_confidence_fuzzy_match_count?: number;
    fuzzy_collision_count?: number;
    title_rename_count?: number;
}
export interface MonitorResponse {
    job_id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
}
export interface MonitorBatchResponse {
    batch_id: string;
    total_jobs: number;
    jobs: Array<{
        url: string;
        job_id: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
    }>;
}
export interface BatchResponse {
    batch_id: string;
    total: number;
    completed: number;
    processing: number;
    failed: number;
    jobs: Array<{
        url: string;
        job_id: string;
        status: 'PENDING' | 'COMPLETED' | 'FAILED';
    }>;
}
export interface JobResponse {
    url: string;
    job_id: string;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    result?: {
        message: string;
        isolation_drift: boolean;
        content_isolation: string;
        [key: string]: unknown;
    };
}
export interface UsageResponse {
    tier: string;
    monthly_quota: number;
    monthly_usage: number;
    remaining: number;
    quota_reset_at: string;
}
