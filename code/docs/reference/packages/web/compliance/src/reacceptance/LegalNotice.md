---
title: "Legal re-acceptance banner"
description: "Non-blocking banner prompting the visitor to accept updated legal policies."
status: stable
---

# Legal re-acceptance banner

> "We updated our policies — please Accept", written once on Accept.

## Purpose

The website's legal re-acceptance banner. It renders the shared `LegalReacceptancePrompt` (the same banner as the `app` surface) with the website's locale `Link`, shown when the deposited legal-ack cookie differs from the live legal version. The layout decides when to render it; this component writes the ack cookie on Accept and hides. It is i18n-agnostic — the copy comes in as props. It stacks above the cookie banner while cookie consent is undecided, then drops to the resting position.

When the optional `apiUrl` + `getToken` are supplied (via the surface's `SignedInLegalNotice` wrapper, rendered only when Clerk is configured), it also **syncs across surfaces** for a signed-in visitor: on mount it reads the server-recorded version from the api Worker's `/v1/consent/legal` and, if it matches, deposits the cookie + hides; on Accept it records the version there too — so a user who accepted in the app or mobile does not see it again on the website. The server-side cookie gate still owns the common anonymous no-flash case.

## Exports

- `LegalNotice({ version, message, hrefs, acceptLabel, apiUrl?, getToken? })` — the re-acceptance banner. `message` carries `[[…]]` link markers (e.g. "…our [[Privacy Policy]] and [[Terms]]."); `hrefs` are the ordered URLs (privacy, terms) woven into them inline — no separate Review button. `apiUrl` + `getToken` are optional and enable the signed-in cross-surface sync (best-effort; the token getter is injected so this stays Clerk-free).

## Usage

```tsx
import { LegalNotice } from "@indiecrafts/packages-web-compliance/reacceptance/LegalNotice";

<LegalNotice
  version={version}
  message={message}
  hrefs={["/privacy-policy", "/terms"]}
  acceptLabel={acceptLabel}
/>;
```

## Source

`code/packages/web/compliance/src/reacceptance/LegalNotice.tsx`
