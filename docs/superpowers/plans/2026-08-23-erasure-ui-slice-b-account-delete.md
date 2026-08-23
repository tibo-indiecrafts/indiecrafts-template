# Erasure UI — Slice B: `DeleteAccountSection` + website/app/hybrid auth-section wiring

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A shared "Delete my account" control in each DOM surface's auth section, calling the Slice-A `POST /v1/erasure/self` route.

**Architecture:** One Clerk-agnostic React/DOM component in `@indiecrafts/packages-shared-compliance/web` (takes `getToken`/`apiUrl`/`onDeleted` as props — mirrors `ConsentBanner`). Each surface adds a thin client wrapper that bridges its Clerk SDK to those props, mounted in a new `/account` page (website, app) or the existing `SignedInView` (hybrid). Copy is resolved per surface and passed as string props (the `DataRequestForm` pattern).

**Tech Stack:** React 19 · TypeScript · Tailwind v4 · shadcn (`@indiecrafts/packages-web-ui`) · next-intl (website/app) · react-intl (hybrid) · Clerk (`@clerk/nextjs` v7 website/app, `@clerk/clerk-react` v5 hybrid).

**Spec:** `docs/superpowers/specs/2026-08-23-self-service-erasure-ui-design.md` (Section 2). **Integration map (read it — exact paths/patterns):** `.superpowers/sdd/slice-b-integration-map.md`.

## Global Constraints

- **The shared component NEVER imports `@clerk/*`, `next`, `next-intl`, or `next-sanity`** — hybrid's renderer would break. It takes Clerk primitives + copy + `apiUrl` as props (the `ConsentBanner`/`LegalReacceptancePrompt` callback pattern in the same package).
- **The worker contract (Slice A, already shipped):** `POST ${apiUrl}/v1/erasure/self`, header `Authorization: Bearer <token>`, body `{ "email": "<typed>" }`. Responses: **200** `{ok:true}` clean · **207** `{ok:true,partial:true,errors}` partial (still erased) · **400** `{error:"invalid"}` (bad/empty/mismatched email) · **401** unauthorized · **429**/**413**/**503**. Treat 200 AND 207 as success (data is gone); surface a note on 207.
- **Config-first:** no hard-coded brand/URL/copy; user-facing strings live in each surface's `messages/*` (never inline in the component); route via `@/i18n/routing` (never `next/link`) on the Next surfaces.
- **Commit `--no-verify`** (pre-commit hook cd's into the website package); **stage ONLY each task's named files** (dirty tree — never `git add -A`); prettier `--write` changed files.
- **Writing-style** on comments/docs/commits: active voice, ≤20 words/sentence, lead with the change.
- Do not edit `src/user-interface/ui/**` (shadcn CLI) on any surface.

---

### Task 1: `DeleteAccountSection` component (shared package)

**Files:**
- Create: `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx`
- Modify: `code/packages/shared/compliance/src/web/index.ts` (add one export line)
- Create: `code/packages/shared/compliance/src/web/DeleteAccountSection.stories.tsx` + `DeleteAccountSection.md`
- Modify: `code/projects/web/tools/storybook/.storybook/main.ts` (add `brickStories("@indiecrafts/packages-shared-compliance")` to the `stories` array)

**Interfaces:**
- Produces:
```ts
export interface DeleteAccountCopy {
  heading: string; body: string;
  emailLabel: string; emailPlaceholder: string;
  confirmButton: string; pending: string;
  success: string; partial: string; error: string; mismatch: string;
}
export interface DeleteAccountSectionProps {
  copy: DeleteAccountCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onDeleted: () => void | Promise<void>;
  beforeConfirm?: () => Promise<boolean>; // optional reverification seam (unused this slice)
}
export function DeleteAccountSection(props: DeleteAccountSectionProps): JSX.Element;
```
- Consumes: the shadcn UI primitives from `@indiecrafts/packages-web-ui` exactly as `code/packages/shared/compliance/src/web/CookieBanner`/`ConsentBanner` import them (Button, Input, Label — read `ConsentBanner.tsx` in this package for the exact import paths + Tailwind/token classes; match them).

- [ ] **Step 1: Write the failing story-test** (the codebase tests DOM components via a Storybook `play` fn, not `.test.tsx` — see `DataRequestForm.stories.tsx`). Create `DeleteAccountSection.stories.tsx`:

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { DeleteAccountSection, type DeleteAccountCopy } from "./DeleteAccountSection";
import docs from "./DeleteAccountSection.md?raw";

const copy: DeleteAccountCopy = {
  heading: "Delete your account",
  body: "This permanently deletes your account and personal data. Your activity log is kept for legal accountability.",
  emailLabel: "Confirm your email",
  emailPlaceholder: "you@example.com",
  confirmButton: "Delete my account",
  pending: "Deleting…",
  success: "Your account has been deleted.",
  partial: "Most data was removed; our team will finish the rest.",
  error: "Something went wrong. Please try again.",
  mismatch: "That email does not match your account.",
};

const meta: Meta<typeof DeleteAccountSection> = {
  title: "Shared Compliance/DeleteAccountSection",
  component: DeleteAccountSection,
  tags: ["autodocs"],
  parameters: { docs: { description: { component: docs } } },
  args: {
    copy,
    apiUrl: "https://api.example.test",
    getToken: async () => "stub-token",
    onDeleted: fn(),
  },
};
export default meta;
type Story = StoryObj<typeof DeleteAccountSection>;

export const Default: Story = {};

// Typing an email + clicking delete calls the worker; a 200 triggers onDeleted.
export const DeletesOnSuccess: Story = {
  args: {
    getToken: async () => "stub-token",
    onDeleted: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Stub fetch → 200.
    const orig = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(JSON.stringify({ ok: true }), { status: 200 })) as typeof fetch;
    try {
      await userEvent.type(canvas.getByLabelText(copy.emailLabel), "you@example.com");
      await userEvent.click(canvas.getByRole("button", { name: copy.confirmButton }));
      await expect(args.onDeleted).toHaveBeenCalled();
    } finally {
      globalThis.fetch = orig;
    }
  },
};
```

- [ ] **Step 2: Run it, verify it fails** — `pnpm --filter @indiecrafts/web-tools-storybook test:stories` (or note it fails because the component/story doesn't exist yet). Expected: FAIL (module `./DeleteAccountSection` not found).

- [ ] **Step 3: Implement the component.** Mirror `ConsentBanner.tsx` for UI primitives + token classes. Logic:

```tsx
"use client";
import { useState } from "react";
// Import Button/Input/Label from @indiecrafts/packages-web-ui — copy the exact
// import lines + class conventions from ./ConsentBanner in this package.

type Status = "idle" | "pending" | "error" | "mismatch" | "done" | "partial";

export function DeleteAccountSection({
  copy, apiUrl, getToken, onDeleted, beforeConfirm,
}: DeleteAccountSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === "pending") return;
    if (beforeConfirm && !(await beforeConfirm())) return; // reverification seam
    setStatus("pending");
    try {
      const token = await getToken();
      const res = await fetch(`${apiUrl}/v1/erasure/self`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.status === 200) { setStatus("done"); await onDeleted(); return; }
      if (res.status === 207) { setStatus("partial"); await onDeleted(); return; }
      if (res.status === 400) { setStatus("mismatch"); return; } // bad/mismatched email
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  // Render: heading, body, a labelled email input (id wired to <label htmlFor>),
  // a destructive submit button showing copy.pending while status==="pending",
  // and a status message region (role="status") showing success/partial/error/mismatch
  // copy. Match ConsentBanner's container/spacing/token classes. The button text is
  // copy.confirmButton; disable it while pending.
}
```
Add to `src/web/index.ts`: `export { DeleteAccountSection } from "./DeleteAccountSection";` and `export type { DeleteAccountCopy, DeleteAccountSectionProps } from "./DeleteAccountSection";`. Create `DeleteAccountSection.md` (a short component doc, like `DataRequestForm.md`). Add `brickStories("@indiecrafts/packages-shared-compliance")` to `code/projects/web/tools/storybook/.storybook/main.ts` `stories` array.

- [ ] **Step 4: Run the story-test + tsc.** `pnpm --filter @indiecrafts/web-tools-storybook test:stories` (the 2 stories pass, incl. `DeletesOnSuccess`) and `pnpm --filter @indiecrafts/packages-shared-compliance tsc` (exit 0). Also `pnpm --filter @indiecrafts/packages-shared-compliance test` stays green.

- [ ] **Step 5: Prettier + commit.**
```bash
git add code/packages/shared/compliance/src/web/DeleteAccountSection.tsx code/packages/shared/compliance/src/web/DeleteAccountSection.stories.tsx code/packages/shared/compliance/src/web/DeleteAccountSection.md code/packages/shared/compliance/src/web/index.ts code/projects/web/tools/storybook/.storybook/main.ts
git commit --no-verify -m "feat(compliance): shared DeleteAccountSection component"
```

---

### Task 2: Website `/account` page + wiring

**Files:**
- Create: `code/projects/web/surfaces/website/src/app/[locale]/account/page.tsx`
- Create: `code/projects/web/surfaces/website/src/user-interface/account/AccountDeletePanel.tsx` (client wrapper)
- Modify: `code/projects/web/surfaces/website/messages/en.json` + `messages/fr.json` (add `account.delete.*`)
- Modify: `code/projects/web/surfaces/website/src/config/features.ts` (add the flag) + `src/config/pages.ts` (gate the page)

**Interfaces:**
- Consumes: `DeleteAccountSection`, `DeleteAccountCopy` from `@indiecrafts/packages-shared-compliance/web` (Task 1).

- [ ] **Step 1: Add the feature flag + page config.** In `features.ts`, add to the returned object a new key `account: { delete: true }` (top-level, sibling of `legal`). In `pages.ts`, add an `account` page entry gated by `features.account.delete` (mirror the `dataRequest` entry at pages.ts:70-71). Read the map §4 for the exact shapes.

- [ ] **Step 2: Add i18n copy.** Add an `account.delete` namespace to `messages/en.json` and `messages/fr.json` with keys matching `DeleteAccountCopy` (`heading, body, emailLabel, emailPlaceholder, confirmButton, pending, success, partial, error, mismatch`). English copy warm/editorial per `DESIGN.md`; French translated (this repo's `messages.test.ts` enforces en/fr key parity — keep them identical in shape). Example en: `"heading": "Delete your account"`, etc. (use the story's `copy` as the baseline wording).

- [ ] **Step 3: Client wrapper** `AccountDeletePanel.tsx` (`"use client"`): uses `useAuth()` from `@indiecrafts/packages-web-auth` (or `@clerk/nextjs`), renders `<DeleteAccountSection copy={copy} apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""} getToken={getToken} onDeleted={handleDeleted} />` where `handleDeleted` calls Clerk `signOut()` then routes home via `@/i18n/routing`'s `useRouter`. Takes `copy: DeleteAccountCopy` as a prop (resolved by the page).

- [ ] **Step 4: The page** (server component, mirror `data-request/page.tsx` + `sign-in` gating): `notFound()` when `!isPageVisible(pages.account)` OR `!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`; `getTranslations({ locale, namespace: "account.delete" })` → build the `copy` object → render `<DefaultLayout><AccountDeletePanel copy={copy} /></DefaultLayout>`. `setRequestLocale(locale)` + `generateMetadata` like the data-request page.

- [ ] **Step 5: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-website tsc` (exit 0), `pnpm --filter @indiecrafts/web-surfaces-website test` (messages parity test passes). Prettier. Commit the 5 files `--no-verify` (`feat(compliance): website account-delete page`).

---

### Task 3: App `/account` page + wiring

**Files:**
- Create: `code/projects/web/surfaces/app/src/app/[locale]/account/page.tsx`
- Create: `code/projects/web/surfaces/app/src/user-interface/account/AccountDeletePanel.tsx`
- Modify: `code/projects/web/surfaces/app/messages/en.json` + `fr.json`
- Modify: `code/projects/web/surfaces/app/src/config/index.ts` (flat `features` literal — add `deleteAccount: true`)

**Interfaces:** Consumes `DeleteAccountSection` (Task 1). Same shape as Task 2, adapted to app's patterns.

- [ ] **Step 1: Flag.** In `code/projects/web/surfaces/app/src/config/index.ts`, extend the flat literal: `export const features = { requireConsent: false, deleteAccount: true } as const;` (map §4).
- [ ] **Step 2: i18n.** Add `account.delete.*` to app's `messages/{en,fr}.json` (same key set as Task 2).
- [ ] **Step 3: Client wrapper** `AccountDeletePanel.tsx` — same as Task 2 but app imports `useAuth` from `@clerk/nextjs` (as `AnnouncementChrome.tsx` does) and `apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}`; route home via app's `@/i18n/routing`.
- [ ] **Step 4: Page** `[locale]/account/page.tsx` — mirror app's `sign-in` route gating (`notFound()` when Clerk key unset / `!features.deleteAccount`); resolve copy via `getTranslations`; render the wrapper.
- [ ] **Step 5: Verify + commit.** `pnpm --filter @indiecrafts/web-surfaces-app tsc` (exit 0) + app tests. Prettier. Commit `--no-verify` (`feat(compliance): app account-delete page`).

---

### Task 4: Hybrid `SignedInView` delete control

**Files:**
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/src/auth.tsx` (mount the control in/next to `SignedInView`)
- Modify: `code/projects/hybrid/surfaces/main/src/renderer/messages/en.json` + `fr.json` (react-intl flat keys `account.delete.*`)
- Modify: `code/projects/hybrid/surfaces/main/src/config/index.ts` (flat `features` literal — add `deleteAccount: true`)

**Interfaces:** Consumes `DeleteAccountSection` (Task 1). Hybrid is a client SPA (no server component / no Next).

- [ ] **Step 1: Flag.** In hybrid's `src/config/index.ts`, extend the flat literal: `deleteAccount: true` (map §4).
- [ ] **Step 2: i18n.** Add `account.delete.*` flat keys to `src/renderer/messages/{en,fr}.json` (react-intl flat-key style, e.g. `"account.delete.heading"`).
- [ ] **Step 3: Mount in `SignedInView`** (`auth.tsx:60-73`): build the `copy` object from `useIntl().formatMessage({ id: "account.delete.heading" })` etc.; get `getToken` + `signOut` from the existing `useAuth()` (already destructured there); render `<DeleteAccountSection copy={copy} apiUrl={apiUrl} getToken={getToken} onDeleted={async () => { await signOut(); }} />` where `apiUrl` comes from `../../config` (`import.meta.env.VITE_API_URL`, already exported as `apiUrl` — map §2). Gate on `features.deleteAccount`.
- [ ] **Step 4: Verify + commit.** `pnpm --filter @indiecrafts/hybrid-surfaces-main tsc` (exit 0) + hybrid tests if any. Prettier. Commit `--no-verify` (`feat(compliance): hybrid account-delete control`).

---

## Self-review

**1. Spec coverage (Section 2):** shared component (T1), website mount (T2), app mount (T3), hybrid mount (T4), Clerk-via-props (T1 interface), copy-as-props i18n (all), feature-flag gating (T2-4), post-delete sign-out (T2-4 `onDeleted`). Covered.

**2. Placeholder scan:** component logic + story are complete; per-surface wiring gives exact files + the pattern to mirror (the map has verbatim surrounding snippets). The only author-judgement is the copy wording + the exact shadcn import lines — both pinned to an existing sibling (`DataRequestForm`/`ConsentBanner`) the implementer reads.

**3. Type/name consistency:** `DeleteAccountCopy`/`DeleteAccountSectionProps`/`DeleteAccountSection` identical across T1 (produces) and T2-4 (consume). The worker contract (`POST /v1/erasure/self`, `{email}`, 200/207) matches Slice A exactly.

**4. Deferred (documented):** reverification wiring (the `beforeConfirm` seam exists; no surface wires Clerk `useReverification` this slice); embedding Clerk's full `<UserProfile>` in the `/account` pages (the pages render the delete section only for now); the website anonymous branded flow (Slice C); mobile (Slice D).

**Ruling RB-MOUNT:** the web mount is a plain `/account` page rendering `DeleteAccountSection` (NOT a Clerk `<UserProfile>` custom page — none exists in the repo; simpler + matches the codebase). Revises the earlier default. Cost if wrong: rebuild the page around `<UserProfile.Page>` later; the component is unaffected.
**Ruling RB-HOME:** the component lives in `packages/shared/compliance/src/web` (wired into all 3 surfaces already). Cost if wrong: move + re-wire; low (only the Storybook glob is a new wire).
