# PolicyDiff Node.js SDK

[![npm version](https://img.shields.io/npm/v/policydiff.svg)](https://www.npmjs.com/package/policydiff)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

The official Node.js library for the [PolicyDiff API](https://policydiff.org).
 PolicyDiff is a deterministic engine that allows developers to programmatically detect high-risk changes in privacy policies, terms of service, and pricing pages. 

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Core Workflows](#core-workflows)
  - [Synchronous Analysis](#synchronous-analysis)
  - [Asynchronous Monitoring](#asynchronous-monitoring)
- [API Reference](#api-reference)
  - [Idempotency Keys](#idempotency-keys)
- [TypeScript Support](#typescript-support)
- [Error Handling](#error-handling)
- [Common Use Cases](#common-use-cases)
- [Resources](#resources)

---

## Getting Started

### 1. Get an API Key
To use this SDK, you must first obtain an API key. Sign up and manage your keys at [policydiff.org](https://policydiff.org).

### 2. Installation
Install the package via npm:

```bash
npm install policydiff
```

---

## Quick Start

The SDK is designed to be intuitive and clean, similar to the Stripe or OpenAI libraries. We recommend using environment variables to manage your credentials securely.

```typescript
import { PolicyDiff } from 'policydiff';

// Initialize the client
const pd = new PolicyDiff({
  apiKey: process.env.POLICYDIFF_API_KEY as string
});

// Perform a quick policy check
const result = await pd.check('https://stripe.com/privacy');
console.log('Policy Analysis:', result);
```

---

## Core Workflows

### Synchronous Analysis
Use `check()` for immediate, real-time analysis of a policy URL. This is ideal for on-demand validation or interactive tools.

### Asynchronous Monitoring
For large-scale tracking or long-running jobs, use the monitoring workflow. This allows you to submit a URL and poll for the result later, which is more resilient for high-traffic pipelines.

#### Single URL Monitoring
```typescript
// 1. Start a monitoring job
const { job_id } = await pd.monitor('https://example.com/terms');
console.log(`Job created: ${job_id}`);

// 2. Retrieve results (typically after a short delay)
const job = await pd.getJob(job_id);

if (job.status === 'COMPLETED') {
  console.log('Detected Changes:', job.result);
}
```

#### Batch URL Monitoring
Submit multiple URLs simultaneously and manage them as a single batch.

```typescript
// 1. Submit a batch of URLs
const { batch_id, total_jobs } = await pd.monitorBatch([
  'https://example.com/privacy',
  'https://example.com/terms',
  'https://example.com/pricing'
]);

// 2. Check the status of the entire batch
const batch = await pd.getBatch(batch_id);
console.log(`Progress: ${batch.completed}/${batch.total}`);

// 3. Iterate through batch jobs
for (const job of batch.jobs) {
  if (job.status === 'COMPLETED') {
    const detail = await pd.getJob(job.job_id);
    console.log(`Results for ${job.url}:`, detail.result);
  }
}
```

---

## API Reference

### Configuration

| Option | Type | Description |
| :--- | :--- | :--- |
| `apiKey` | `string` | **Required.** Your PolicyDiff API key. |
| `baseUrl` | `string` | Optional. Defaults to `https://api.policydiff.com`. |

### Idempotency Keys
For the `monitorBatch` method, the SDK supports **Idempotency Keys**. These prevent the accidental creation of duplicate jobs if a network request is retried.

- If you don't provide a key, the SDK generates a random UUID automatically.
- For maximum safety during manual retries, pass your own unique string.

```typescript
const { batch_id } = await pd.monitorBatch(
  ['https://example.com/privacy'], 
  'unique-request-id-123' 
);
```

---

## TypeScript Support

This SDK is written in TypeScript and provides full type safety for all requests and responses.

```typescript
import { PolicyDiff, CheckResponse, JobResponse } from 'policydiff';

const pd = new PolicyDiff({ apiKey: '...' });

async function getPolicyUpdate(url: string) {
  const result: CheckResponse = await pd.check(url);
  // Benefit from IDE autocompletion on 'result' fields
}
```

---

## Error Handling

The SDK throws specific error classes to help you distinguish between API issues and network failures.

```typescript
import { PolicyDiffApiError, PolicyDiffNetworkError } from 'policydiff';

try {
  const result = await pd.check('https://invalid-url.com');
} catch (error) {
  if (error instanceof PolicyDiffApiError) {
    // Handle API-side errors (4xx, 5xx)
    console.error(`Status ${error.statusCode}: ${error.message}`);
  } else if (error instanceof PolicyDiffNetworkError) {
    // Handle connectivity issues
    console.error('Network failure:', error.message);
  }
}
```

---

## Common Use Cases

- **Vendor Compliance**: Automatically monitor third-party sub-processor lists for changes.
- **SaaS Tracking**: Stay updated on pricing page or terms of service adjustments across your tech stack.
- **Legal Pipelines**: Feed policy diffs into internal document review workflows for legal teams.
- **Competitive Intelligence**: Track changes in competitor service offerings and legal frameworks.

---

## Resources

- **Official Website**: [policydiff.org](https://policydiff.org)
- **GitHub Repository**: [https://github.com/mobin04/policydiff-js](https://github.com/mobin04/policydiff-js)
- **Report a Bug**: [GitHub Issues](https://github.com/mobin04/policydiff-js/issues)

---

## License

Apache-2.0 © 2026 Mobin Mathew
