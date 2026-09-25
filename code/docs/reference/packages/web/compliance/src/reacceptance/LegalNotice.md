---
title: "Legal re-acceptance banner"
description: "Non-blocking banner prompting the visitor to accept updated legal policies."
status: stable
---

# Legal re-acceptance banner

> "We updated our policies — please Accept", written once on Accept.

## Purpose

A non-blocking, fixed-bottom banner (the sibling of `CookieBanner`) shown when the deposited legal-ack cookie differs from the live legal version. The layout decides when to render it; this component writes the ack cookie on Accept and hides. It is i18n-agnostic — the copy comes in as props. It stacks above the cookie banner while cookie consent is undecided, then drops to the resting position.

## Exports

- `LegalNotice({ version, message, reviewLabel, reviewHref, acceptLabel })` — the re-acceptance banner.

## Usage

```tsx
import { LegalNotice } from "@indiecrafts/packages-web-compliance/reacceptance/LegalNotice";

<LegalNotice
  version={version}
  message={message}
  reviewLabel={reviewLabel}
  reviewHref={reviewHref}
  acceptLabel={acceptLabel}
/>;
```

## Source

`code/packages/web/compliance/src/reacceptance/LegalNotice.tsx`
