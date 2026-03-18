# PolicyDiff Node.js SDK

[![npm version](https://img.shields.io/npm/v/policydiff.svg)](https://www.npmjs.com/package/policydiff)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official Node.js/TypeScript library for the [PolicyDiff API](https://policydiff.org).  
PolicyDiff is a production-grade compliance signal engine that programmatically detects and classifies high-risk changes in privacy policies, terms of service, and pricing pages.

## Key Features

- **Strict Type Safety**: Fully typed requests and responses, including discriminated unions for job statuses and detailed diff results.
- **Smart Retries**: Automatic exponential backoff for `429`, `502`, and `503` errors.
- **Polling Helpers**: Built-in methods to wait for async jobs and batches with intelligent polling.
- **Automatic Idempotency**: Support for `Idempotency-Key` headers on all write operations.
- **Detailed Errors**: Custom error classes with `request_id` tracing for production debugging.

---

## Installation

```bash
npm install policydiff
```

---

## Quick Start

```typescript
import { PolicyDiff } from 'policydiff';

// Initialize the client
const pd = new PolicyDiff({
  apiKey: 'pd_live_...',
  baseUrl: 'https://api.policydiff.org' // Defaults to production
});

// Perform a quick synchronous policy check
try {
  const res = await pd.check('https://stripe.com/privacy');
  
  // The SDK automatically merges CheckResult and DiffResult
  console.log(`Risk Level: ${res.risk_level ?? 'NONE'}`);
  console.log(`Message: ${res.message}`);
} catch (error) {
  console.error('Analysis failed:', error.message);
}
```

---

## Core Workflows

### 1. Synchronous Analysis (`check`)
Ideal for real-time validation. Returns an exhaustive result including risk classification and structural changes.

```typescript
const res = await pd.check('https://example.com/privacy', { 
  minInterval: 60 // Optional: Minimum interval in minutes before re-checking
});

if (res.status === 'processed') {
  console.log('Isolation Drift:', res.isolation_drift);
  res.changes?.forEach(change => {
    console.log(`${change.type} in ${change.section}: ${change.reason}`);
  });
}
```

### 2. Asynchronous Monitoring (`waitForJob`)
For long-running checks, use the async workflow. The SDK provides a `waitForJob` helper that returns a **type-safe discriminated union** of the job status.

```typescript
// 1. Create the job
const { job_id, status } = await pd.monitor('https://example.com/terms');

// 2. Wait for completion (handles exponential backoff)
const job = await pd.waitForJob(job_id);

// 3. Handle results with full type safety
if (job.status === 'COMPLETED') {
  console.log('Job Result:', job.result.message);
} else if (job.status === 'FAILED') {
  console.error('Job Failed with type:', job.error_type);
}
```

### 3. Batch Monitoring (`waitForBatch`)
Process up to 20 URLs and retrieve full details for every job in the batch.

```typescript
const urls = ['https://adobe.com/privacy', 'https://stripe.com/privacy'];
const { batch_id, total_jobs } = await pd.monitorBatch(urls);

const batch = await pd.waitForBatch(batch_id);

batch.jobs.forEach(job => {
  if (job.status === 'COMPLETED') {
    console.log(`[${job.url}] Risk: ${job.result.risk_level}`);
  }
});
```

---

## API Reference

### Configuration

| Option | Type | Description |
| :--- | :--- | :--- |
| `apiKey` | `string` | **Required.** Your PolicyDiff API key. |
| `baseUrl` | `string` | Optional. Defaults to `https://api.policydiff.org`. |

### Key Models

#### `DiffResult`
The detailed result payload available in both sync and async workflows:
- `message`: Summary of the detected changes.
- `risk_level`: `LOW` | `MEDIUM` | `HIGH` (Optional).
- `changes`: Array of `RiskedChange` objects.
- `content_isolation`: Content extraction status (`success` | `fallback`).
- `isolation_drift`: True if the content structure has changed.
- `numeric_override_triggered`: True if numeric override hardening was active.
- `fuzzy_match_count`: Internal matching metrics.

#### `JobErrorType`
When a job fails, `error_type` will contain one of the following:
`INVALID_URL`, `FETCH_ERROR`, `TIMEOUT`, `PAGE_ACCESS_BLOCKED`, `INVALID_PAGE_CONTENT`, etc.

---

## Error Handling

All SDK errors inherit from `PolicyDiffError` and include a `requestId` for tracing with PolicyDiff support.

```typescript
import { PolicyDiffAuthError, PolicyDiffRateLimitError } from 'policydiff';

try {
  await pd.getUsage();
} catch (error) {
  if (error instanceof PolicyDiffRateLimitError) {
    console.error('Quota exceeded. Request ID:', error.requestId);
  }
}
```

---

## Resources

- **Official Website**: [policydiff.org](https://policydiff.org)
- **Report a Bug**: [GitHub Issues](https://github.com/mobin04/policydiff-js/issues)

---

## License

Apache-2.0 © 2026 Mobin Mathew
