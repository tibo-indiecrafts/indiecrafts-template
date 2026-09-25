---
title: "Security-events barrel"
description: "The package entry point re-exporting the taxonomy, detection thresholds, KV counter, and alert helpers."
status: stable
---

# Security-events barrel

> The entry point for the app-level security-events brick.

## Purpose

The package entry point. It re-exports the four parts of the brick: the incident taxonomy, the detection thresholds, the KV counter, and the alert helpers. A surface or the api shell imports everything from here.

## Exports

- Taxonomy — `SecurityEventType`, `Severity`, `SecurityEvent`.
- Thresholds — `classifyFailedLogins`, `FAILED_LOGIN`.
- Counter — `KvLike`, `bumpCounter`.
- Alerts — `ALERT_SEVERITIES`, `shouldAlert`, `formatSecurityAlert`, `SecurityAlert`, `SecurityAlertCopy`.

## Usage

```ts
import {
  classifyFailedLogins,
  bumpCounter,
} from "@indiecrafts/packages-shared-security-events";
```

## Source

`code/packages/shared/security-events/src/index.ts`
