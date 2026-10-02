---
title: "Server boot hook"
description: "Next.js instrumentation register() that wires the app's production crash sink to Cloudflare Workers Logs."
status: stable
---

# Server boot hook

> Runs once at server startup, before any route is handled.

## Purpose

Next.js calls `register()` once at boot. The OpenNext Worker's console is silent in production, so a `logger.error` would be lost. In production only, `register()` adds the Cloudflare transport, which forwards `error`/`fatal` logs to Cloudflare Workers Logs. It is the same hook as the website's.

## Exports

- `register()` — async boot hook. Adds the Cloudflare log transport when the environment is `production`.

## Usage

Next.js invokes it automatically; there is no call site in app code.

## Source

`code/projects/web/surfaces/app/src/instrumentation.ts`
