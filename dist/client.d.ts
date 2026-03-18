import { PolicyDiffConfig, CheckResponse, MonitorJobCreatedResponse, MonitorBatchCreatedResponse, BatchStatusResponse, JobStatusResponse, UsageResponse } from './types.js';
export declare class PolicyDiff {
    private readonly client;
    private readonly baseUrl;
    constructor(config: PolicyDiffConfig);
    private setupInterceptors;
    private getHeaders;
    /**
     * Performs a synchronous policy analysis for a given URL.
     */
    check(url: string, options?: {
        minInterval?: number;
        idempotencyKey?: string;
    }): Promise<CheckResponse>;
    /**
     * Creates an asynchronous monitoring job for a single URL.
     */
    monitor(url: string, options?: {
        idempotencyKey?: string;
    }): Promise<MonitorJobCreatedResponse>;
    /**
     * Creates asynchronous monitoring jobs for multiple URLs.
     */
    monitorBatch(urls: string[], options?: {
        idempotencyKey?: string;
    }): Promise<MonitorBatchCreatedResponse>;
    /**
     * Retrieves the status and details of a batch monitoring request.
     */
    getBatchStatus(batchId: string): Promise<BatchStatusResponse>;
    /**
     * Retrieves the status of an asynchronous monitoring job.
     */
    getJobStatus(jobId: string): Promise<JobStatusResponse>;
    /**
     * Retrieves API quota usage.
     */
    getUsage(): Promise<UsageResponse>;
    /**
     * Polls getJobStatus until status is COMPLETED or FAILED.
     * Implements exponential backoff.
     */
    waitForJob(jobId: string, options?: {
        intervalMs?: number;
        timeoutMs?: number;
    }): Promise<JobStatusResponse>;
    /**
     * Polls getBatchStatus until all nested jobs are finished.
     */
    waitForBatch(batchId: string, options?: {
        intervalMs?: number;
        timeoutMs?: number;
    }): Promise<BatchStatusResponse>;
}
