import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PolicyDiff } from '../src/client.js';
import axios from 'axios';

vi.mock('axios');

describe('PolicyDiff', () => {
  let pd: PolicyDiff;
  const mockAxiosInstance = {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  };

  beforeEach(() => {
    vi.mocked(axios.create).mockReturnValue(mockAxiosInstance as any);
    // Reset mocks for each test
    mockAxiosInstance.post.mockReset();
    mockAxiosInstance.get.mockReset();
    mockAxiosInstance.interceptors.response.use.mockReset();
    
    pd = new PolicyDiff({ apiKey: 'test-key', baseUrl: 'http://localhost:3000' });
  });

  it('should initialize with correct apiKey and default baseUrl', () => {
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      baseURL: 'http://localhost:3000',
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json'
      })
    }));
  });

  it('should call check endpoint correctly with automatic idempotency key', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { status: 'processed' } });
    const res = await pd.check('https://example.com/privacy', { minInterval: 60 });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/check', 
      { 
        url: 'https://example.com/privacy',
        min_interval: 60 
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Idempotency-Key': expect.any(String)
        })
      })
    );
    expect(res).toEqual({ status: 'processed' });
  });

  it('should call monitor endpoint with provided idempotency key', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { job_id: 'job-123' } });
    const res = await pd.monitor('https://example.com/privacy', { idempotencyKey: 'key-123' });
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/monitor', 
      { url: 'https://example.com/privacy' },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Idempotency-Key': 'key-123'
        })
      })
    );
    expect(res).toEqual({ job_id: 'job-123' });
  });

  it('should call monitorBatch endpoint with automatic idempotency key', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { batch_id: 'batch-123' } });
    const res = await pd.monitorBatch(['url1', 'url2']);
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/monitor/batch', 
      { urls: ['url1', 'url2'] },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Idempotency-Key': expect.any(String)
        })
      })
    );
    expect(res).toEqual({ batch_id: 'batch-123' });
  });

  it('should call getJobStatus endpoint correctly', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { job_id: '123', status: 'COMPLETED' } });
    const res = await pd.getJobStatus('123');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/jobs/123');
    expect(res).toEqual({ job_id: '123', status: 'COMPLETED' });
  });

  it('should call getBatchStatus endpoint correctly', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { batch_id: 'batch-123' } });
    const res = await pd.getBatchStatus('batch-123');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/batches/batch-123');
    expect(res).toEqual({ batch_id: 'batch-123' });
  });

  it('should call getUsage endpoint correctly', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { remaining: 100 } });
    const res = await pd.getUsage();
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/usage');
    expect(res).toEqual({ remaining: 100 });
  });

  describe('waitForJob', () => {
    it('should poll until job is COMPLETED', async () => {
      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: { job_id: '123', status: 'PENDING' } })
        .mockResolvedValueOnce({ data: { job_id: '123', status: 'COMPLETED' } });
      
      const res = await pd.waitForJob('123', { intervalMs: 1 });
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(res.status).toBe('COMPLETED');
    });

    it('should poll until job is FAILED', async () => {
      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: { job_id: '123', status: 'PENDING' } })
        .mockResolvedValueOnce({ data: { job_id: '123', status: 'FAILED' } });
      
      const res = await pd.waitForJob('123', { intervalMs: 1 });
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(res.status).toBe('FAILED');
    });

    it('should throw timeout error if timeout is reached', async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: { job_id: '123', status: 'PENDING' } });
      
      await expect(pd.waitForJob('123', { intervalMs: 1, timeoutMs: 10 }))
        .rejects.toThrow('timed out');
    });
  });

  describe('waitForBatch', () => {
    it('should poll until all jobs in batch are finished', async () => {
      mockAxiosInstance.get
        .mockResolvedValueOnce({ data: { 
          batch_id: 'b1', 
          jobs: [{ status: 'PENDING' }, { status: 'COMPLETED' }] 
        } })
        .mockResolvedValueOnce({ data: { 
          batch_id: 'b1', 
          jobs: [{ status: 'FAILED' }, { status: 'COMPLETED' }] 
        } });
      
      const res = await pd.waitForBatch('b1', { intervalMs: 1 });
      expect(mockAxiosInstance.get).toHaveBeenCalledTimes(2);
      expect(res.jobs[0].status).toBe('FAILED');
    });
  });
});
