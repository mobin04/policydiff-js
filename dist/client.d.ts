import { PolicyDiffConfig, CheckResponse, MonitorResponse, MonitorBatchResponse, BatchResponse, JobResponse, UsageResponse } from './types.js';
export declare class PolicyDiff {
    private readonly client;
    private readonly baseUrl;
    constructor(config: PolicyDiffConfig);
    /**
     * Performs a synchronous policy analysis for a given URL.
     */
    check(url: string): Promise<CheckResponse>;
    /**
     * Creates an asynchronous monitoring job for a single URL.
     */
    monitor(url: string): Promise<MonitorResponse>;
    /**
     * Creates asynchronous monitoring jobs for multiple URLs.
     * Supports an optional idempotency key for safe retries.
     */
    monitorBatch(urls: string[], idempotencyKey?: string): Promise<MonitorBatchResponse>;
    /**
     * Retrieves the status and details of a batch monitoring request.
     */
    getBatch(batchId: string): Promise<BatchResponse>;
    /**
     * Retrieves the results of an asynchronous monitoring job.
     */
    getJob(jobId: string): Promise<JobResponse>;
    /**
     * Retrieves API quota usage.
     */
    getUsage(): Promise<UsageResponse>;
}
