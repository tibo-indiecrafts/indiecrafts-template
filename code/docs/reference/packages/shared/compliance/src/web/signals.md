---
title: "Browser opt-out signals"
description: "Detects Global Privacy Control and Do-Not-Track so the consent seed can respect a visitor's opt-out."
status: stable
---

# Browser opt-out signals

> DOM opt-out detection for the web consent seed.

## Purpose

Reads browser opt-out signals so the web surfaces seed a reject default when a visitor's browser already signals opt-out. `Global Privacy Control` is legally enforceable under CCPA/CPRA; `Do-Not-Track` is honoured as a courtesy.

## Exports

- `browserSignalsDeny()` — returns `true` when `navigator.globalPrivacyControl` is set or `navigator.doNotTrack` is `"1"`.
- `signalsDeny(gpcSignal)` — union of a server-detected `Sec-GPC: 1` header and `browserSignalsDeny()`; either source denies.

## Usage

```ts
import { signalsDeny } from "@indiecrafts/packages-shared-compliance/web";

// gpcSignal comes from the server-read `Sec-GPC` header.
const denied = signalsDeny(gpcSignal);
```

## Source

`code/packages/shared/compliance/src/web/signals.ts`
