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
    pd = new PolicyDiff({ apiKey: 'test-key' });
  });

  it('should initialize with correct apiKey', () => {
    expect(axios.create).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        'Authorization': 'Bearer test-key'
      })
    }));
  });

  it('should call check endpoint correctly', async () => {
    mockAxiosInstance.post.mockResolvedValueOnce({ data: { result: 'ok' } });
    const res = await pd.check('https://example.com/privacy');
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/v1/check', { url: 'https://example.com/privacy' });
    expect(res).toEqual({ result: 'ok' });
  });

  it('should call getJob endpoint correctly', async () => {
    mockAxiosInstance.get.mockResolvedValueOnce({ data: { job_id: '123' } });
    const res = await pd.getJob('123');
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/v1/jobs/123');
    expect(res).toEqual({ job_id: '123' });
  });
});
