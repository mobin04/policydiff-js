import axios from 'axios';
import * as crypto from 'node:crypto';
import { PolicyDiffApiError, PolicyDiffNetworkError, PolicyDiffAuthError, PolicyDiffRateLimitError, PolicyDiffValidationError, PolicyDiffUpstreamError, PolicyDiffTimeoutError } from './errors.js';
export class PolicyDiff {
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('PolicyDiff API key is required');
        }
        this.baseUrl = config.baseUrl || 'https://api.policydiff.org';
        this.client = axios.create({
            baseURL: this.baseUrl,
            timeout: 60000,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        this.setupInterceptors();
    }
    setupInterceptors() {
        this.client.interceptors.response.use((response) => response, async (error) => {
            const config = error.config;
            const shouldRetry = error.response && [429, 502, 503].includes(error.response.status);
            const retryLimit = 3;
            config._retryCount = config._retryCount || 0;
            if (shouldRetry && config._retryCount < retryLimit) {
                config._retryCount++;
                const delay = Math.pow(2, config._retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.client(config);
            }
            if (error.response) {
                const data = error.response.data;
                const requestId = data?.request_id;
                const message = data?.message || error.message;
                switch (error.response.status) {
                    case 401:
                    case 403:
                        throw new PolicyDiffAuthError(message, requestId);
                    case 429:
                        throw new PolicyDiffRateLimitError(message, requestId);
                    case 400:
                    case 422:
                        throw new PolicyDiffValidationError(message, requestId, data);
                    case 502:
                    case 503:
                        throw new PolicyDiffUpstreamError(message, requestId);
                    default:
                        throw new PolicyDiffApiError(message, error.response.status, requestId, data);
                }
            }
            else if (error.request) {
                throw new PolicyDiffNetworkError('Network error: No response received', error);
            }
            else {
                throw new PolicyDiffNetworkError(error.message, error);
            }
        });
    }
    getHeaders(idempotencyKey) {
        return {
            'Idempotency-Key': idempotencyKey || crypto.randomUUID()
        };
    }
    /**
     * Performs a synchronous policy analysis for a given URL.
     */
    async check(url, options) {
        const { data } = await this.client.post('/v1/check', {
            url,
            min_interval: options?.minInterval
        }, {
            headers: this.getHeaders(options?.idempotencyKey)
        });
        return data;
    }
    /**
     * Creates an asynchronous monitoring job for a single URL.
     */
    async monitor(url, options) {
        const body = { url };
        const { data } = await this.client.post('/v1/monitor', body, {
            headers: this.getHeaders(options?.idempotencyKey)
        });
        return data;
    }
    /**
     * Creates asynchronous monitoring jobs for multiple URLs.
     */
    async monitorBatch(urls, options) {
        const body = { urls };
        const { data } = await this.client.post('/v1/monitor/batch', body, {
            headers: this.getHeaders(options?.idempotencyKey)
        });
        return data;
    }
    /**
     * Retrieves the status and details of a batch monitoring request.
     */
    async getBatchStatus(batchId) {
        const { data } = await this.client.get(`/v1/batches/${batchId}`);
        return data;
    }
    /**
     * Retrieves the status of an asynchronous monitoring job.
     */
    async getJobStatus(jobId) {
        const { data } = await this.client.get(`/v1/jobs/${jobId}`);
        return data;
    }
    /**
     * Retrieves API quota usage.
     */
    async getUsage() {
        const { data } = await this.client.get('/v1/usage');
        return data;
    }
    /**
     * Polls getJobStatus until status is COMPLETED or FAILED.
     * Implements exponential backoff.
     */
    async waitForJob(jobId, options) {
        const intervalMs = options?.intervalMs || 1000;
        const timeoutMs = options?.timeoutMs || 180000;
        const startTime = Date.now();
        let attempt = 0;
        while (Date.now() - startTime < timeoutMs) {
            const job = await this.getJobStatus(jobId);
            if (job.status === 'COMPLETED' || job.status === 'FAILED') {
                return job;
            }
            attempt++;
            const delay = Math.min(intervalMs * Math.pow(1.5, attempt), 10000);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
        throw new PolicyDiffTimeoutError(`Job ${jobId} timed out after ${timeoutMs}ms`);
    }
    /**
     * Polls getBatchStatus until all nested jobs are finished.
     */
    async waitForBatch(batchId, options) {
        const intervalMs = options?.intervalMs || 2000;
        const timeoutMs = options?.timeoutMs || 300000;
        const startTime = Date.now();
        while (Date.now() - startTime < timeoutMs) {
            const batch = await this.getBatchStatus(batchId);
            const isFinished = batch.jobs.every(job => job.status === 'COMPLETED' || job.status === 'FAILED');
            if (isFinished && batch.jobs.length > 0) {
                return batch;
            }
            await new Promise(resolve => setTimeout(resolve, intervalMs));
        }
        throw new PolicyDiffTimeoutError(`Batch ${batchId} timed out after ${timeoutMs}ms`);
    }
}
//# sourceMappingURL=client.js.map