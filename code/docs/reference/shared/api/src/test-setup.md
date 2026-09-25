---
title: "Test D1 migrations setup"
description: "Applies the audit and main D1 migrations to the ephemeral test database before the suite runs."
status: stable
---

# Test D1 migrations setup

> Apply the D1 migrations to the ephemeral test database before any test runs.

## Purpose

Test bootstrap module. It applies the `db/audit` and `db/main` migrations to the ephemeral `cloudflare:test` D1 (`AUDIT_DB`) before any test runs. Imported as a Vitest setup file, not called directly.

## Exports

No public exports (internal module).

## Source

`code/shared/api/src/test-setup.ts`
