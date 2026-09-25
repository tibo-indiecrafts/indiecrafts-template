---
title: "Turnstile widget"
description: "Cloudflare Turnstile client widget that renders the challenge and reports the solved token."
status: stable
---

# Turnstile widget

> Client half of the server-side Turnstile verify — renders only when a public site key is set.

## Purpose

`TurnstileWidget` is the client half of the server-side `verifyTurnstile` (`@indiecrafts/packages-shared-security/turnstile`). It renders only when a public site key is set (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`); otherwise it renders nothing and the form submits as before. It loads the Turnstile script once, reports the solved token via `onToken`, and clears the token on expiry or error so the form re-blocks. A changing `key` remounts and resets the challenge after a failed submit.

## Exports

- `turnstileActive()` — returns `true` when the widget will render (public key present); client-safe.
- `TurnstileWidget({ onToken, siteKey })` — the widget component; `siteKey` overrides the env key (tests and Storybook pass a Cloudflare test key).

## Usage

```tsx
import {
  TurnstileWidget,
  turnstileActive,
} from "@indiecrafts/packages-web-ui-components/web/form/TurnstileWidget";

<TurnstileWidget onToken={setToken} />;
// gate submit when the widget is active but unsolved
const blocked = turnstileActive() && !token;
```

## Source

`code/packages/web/ui-components/src/web/form/TurnstileWidget.tsx`
