---
title: "Nonce context"
description: "Hands the request's CSP nonce to client components that render scripts."
status: stable
---

# Nonce context

> The request nonce, available to client components.

## Purpose

Server components read the nonce from the proxy's `x-nonce` request header; client components cannot. The website `[locale]` layout wraps the page in `NonceProvider` with that value, and `useNonce()` returns it. Outside a provider (Storybook, tests) it returns `undefined`.

## Exports

- `NonceProvider({ nonce, children })`
- `useNonce()`

## Source

`code/packages/web/ui-components/src/web/content/nonce.tsx`
