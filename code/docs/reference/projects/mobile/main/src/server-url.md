---
title: "Shell server URL"
description: "Resolves the URL the Capacitor shell loads and the Clerk host it may navigate to."
status: stable
---

# Shell server URL

> Two required variables decide what the shell loads and where it may navigate.

## Purpose

Reads `CAP_SERVER_URL`, validates it, and returns its origin (no trailing slash). It throws a clear error when the variable is unset, empty, malformed, or not `http(s)`. The dev scripts set `http://localhost:3002`; a release build sets the deployed app URL.

It also decodes the Clerk Frontend API host from `CAP_CLERK_PUBLISHABLE_KEY` (`pk_test_` or `pk_live_`, then the base64 of the host plus a trailing `$`). Clerk's session handshake redirects through that host, and Capacitor opens any other-origin navigation in the system browser, so the config allows it.

## Exports

- `resolveServerUrl(env)` — returns the validated origin string.
- `resolveClerkHost(env)` — returns the Clerk Frontend API host; throws when the key is unset or not a publishable key.

## Source

`code/projects/mobile/surfaces/main/src/server-url.ts`
