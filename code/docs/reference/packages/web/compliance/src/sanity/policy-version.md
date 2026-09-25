---
title: "Consent policy version reader"
description: "Reads the privacy-policy version stamped on newsletter and waitlist opt-in records as GDPR proof of consent."
status: stable
---

# Consent policy version reader

> The privacy-policy version a visitor consented to, stamped on opt-in records.

## Purpose

Reads the privacy-policy version — its `lastUpdated` date — that a visitor consents to when they opt into the newsletter or waitlist. The value is stamped on the stored record as GDPR proof of consent: which version of the policy the person agreed to, and when. It is server-derived, never from the request, and returns an empty string when no privacy `legalPage` exists yet. The read is React-`cache`d per request. This module is `server-only`.

## Exports

- `getConsentPolicyVersion()` — React-`cache`d async reader. Returns the policy's `lastUpdated` date string, or an empty string when absent or on error.

## Usage

```ts
import { getConsentPolicyVersion } from "@indiecrafts/packages-web-compliance/sanity/policy-version";

const policyVersion = await getConsentPolicyVersion();
// stamp policyVersion on the stored opt-in record
```

## Source

`code/packages/web/compliance/src/sanity/policy-version.ts`
