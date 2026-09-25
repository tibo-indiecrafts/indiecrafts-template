---
title: "Server boot hook"
description: "Next.js instrumentation register() that injects app config into islands and wires the production crash sink."
status: stable
---

# Server boot hook

> Runs once at server startup, before any route is handled.

## Purpose

Next.js calls `register()` once per runtime at boot. This is where the app injects its config into the islands it mounts (`configureIslands`) and, in production only, forwards `error`/`fatal` logs to Cloudflare Workers Logs via a transport.

## Exports

- `register()` — async boot hook. Configures islands, then adds the Cloudflare log transport when the environment is `production`.

## Usage

Next.js invokes it automatically; there is no call site in app code. It runs before the first route is handled.

## Source

`code/projects/web/surfaces/website/src/instrumentation.ts`
