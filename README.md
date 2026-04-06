# Email Finder - JavaScript Library

[![npm version](https://img.shields.io/npm/v/email-finder.svg)](https://www.npmjs.com/package/email-finder)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/EnrowAPI/email-finder-js)](https://github.com/EnrowAPI/email-finder-js)
[![Last commit](https://img.shields.io/github/last-commit/EnrowAPI/email-finder-js)](https://github.com/EnrowAPI/email-finder-js/commits)

Find verified professional email addresses from a name and company. Integrate email discovery into your sales pipeline, CRM sync, or lead generation workflow.

Powered by [Enrow](https://enrow.io) — works on catch-all domains, only charged when an email is found.

## Installation

```bash
npm install email-finder
```

Requires Node.js 18+. Zero dependencies.

## Simple Usage

```typescript
import { findEmail, getEmailResult } from 'email-finder';

const search = await findEmail({
  apiKey: 'your_api_key',
  fullName: 'Tim Cook',
  companyDomain: 'apple.com',
});

const result = await getEmailResult('your_api_key', search.id);

console.log(result.email);         // tcook@apple.com
console.log(result.qualification); // valid
```

`findEmail` returns a search ID. The search runs asynchronously — call `getEmailResult` to retrieve the result once it's ready. You can also pass a `webhook` URL to get notified automatically.

## Search by company name

If you don't have the domain, you can search by company name instead. The `countryCode` parameter helps narrow down results when company names are ambiguous.

```typescript
const search = await findEmail({
  apiKey: 'your_api_key',
  fullName: 'Tim Cook',
  companyName: 'Apple Inc.',
  countryCode: 'US',
});
```

## Bulk search

```typescript
import { findEmails, getEmailResults } from 'email-finder';

const batch = await findEmails({
  apiKey: 'your_api_key',
  searches: [
    { fullName: 'Tim Cook', companyDomain: 'apple.com' },
    { fullName: 'Satya Nadella', companyDomain: 'microsoft.com' },
    { fullName: 'Jensen Huang', companyName: 'NVIDIA' },
  ],
});

// batch.batchId, batch.total, batch.status

const results = await getEmailResults('your_api_key', batch.batchId);
// results.results — array of EmailResult
```

Up to 5,000 searches per batch. Pass a `webhook` URL to get notified when the batch completes.

## Error handling

```typescript
try {
  await findEmail({ apiKey: 'bad_key', fullName: 'Test', companyDomain: 'test.com' });
} catch (error) {
  // error.message contains the API error description
  // Common errors:
  // - "Invalid or missing API key" (401)
  // - "Your credit balance is insufficient." (402)
  // - "Rate limit exceeded" (429)
}
```

## Getting an API key

Register at [app.enrow.io](https://app.enrow.io) to get your API key. You get **50 free credits** (= 50 emails) with no credit card required.

Paid plans start at **$17/mo** for 1,000 emails up to **$497/mo** for 100,000 emails. See [pricing](https://enrow.io/pricing).

## Documentation

- [Enrow API documentation](https://docs.enrow.io)
- [Full Enrow SDK](https://github.com/EnrowAPI/enrow-js) — includes email verifier, phone finderand more

## License

MIT — see [LICENSE](LICENSE) for details.
