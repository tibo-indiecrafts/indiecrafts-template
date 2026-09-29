---
title: "Shell server URL"
description: "Resolves and validates the URL the Capacitor shell loads, from CAP_SERVER_URL."
status: stable
---

# Shell server URL

> One required variable decides what the shell loads.

## Purpose

Reads `CAP_SERVER_URL`, validates it, and returns its origin (no trailing slash). It throws a clear error when the variable is unset, empty, malformed, or not `http(s)`. The dev scripts set `http://localhost:3002`; a release build sets the deployed app URL.

## Exports

- `resolveServerUrl(env)` — returns the validated origin string.

## Source

`code/projects/mobile/surfaces/main/src/server-url.ts`
