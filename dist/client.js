import axios from 'axios';
import crypto from 'crypto';
import { PolicyDiffApiError, PolicyDiffNetworkError } from './errors.js';
export class PolicyDiff {
    constructor(config) {
        if (!config.apiKey) {
            throw new Error('PolicyDiff API key is required');
        }
        this.baseUrl = config.baseUrl || 'https://api.policydiff.org';
        this.client = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
            },
        });
        this.client.interceptors.response.use((response) => response, (error) => {
            if (error.response) {
                throw new PolicyDiffApiError(error.response.data?.message || error.message, error.response.status, error.response.data);
            }
            else if (error.request) {
                throw new PolicyDiffNetworkError('Network error: No response received', error);
            }
            else {
                throw new PolicyDiffNetworkError(error.message, error);
            }
        });
    }
    /**
     * Performs a synchronous policy analysis for a given URL.
     */
    async check(url) {
        const { data } = await this.client.post('/v1/check', { url });
        return data;
    }
    /**
     * Creates an asynchronous monitoring job for a single URL.
     */
    async monitor(url) {
        const { data } = await this.client.post('/v1/monitor', { url });
        return data;
    }
    /**
     * Creates asynchronous monitoring jobs for multiple URLs.
     * Supports an optional idempotency key for safe retries.
     */
    async monitorBatch(urls, idempotencyKey) {
        const key = idempotencyKey || crypto.randomUUID();
        const { data } = await this.client.post('/v1/monitor/batch', { urls }, {
            headers: {
                'Idempotency-Key': key
            }
        });
        return data;
    }
    /**
     * Retrieves the status and details of a batch monitoring request.
     */
    async getBatch(batchId) {
        const { data } = await this.client.get(`/v1/batches/${batchId}`);
        return data;
    }
    /**
     * Retrieves the results of an asynchronous monitoring job.
     */
    async getJob(jobId) {
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
}
//# sourceMappingURL=client.js.map