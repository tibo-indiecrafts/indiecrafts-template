# Erasure UI — Slice D: mobile account-delete control

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** A native "Delete my account" control in the mobile surface's signed-in view, calling `POST /v1/erasure/self` — completing the auth-section delete control on all four surfaces.

**Architecture:** Extract the pure `submitAccountErasure` fetch helper to a platform-agnostic module both platforms import; add a React Native `DeleteAccountSection` (Clerk-agnostic, props-driven, mirroring the DOM one) in `shared/compliance/src/native`; mount it in `app/sign-in.tsx`'s `SignedInView` with Clerk-Expo `getToken`/`signOut` + `EXPO_PUBLIC_API_URL`.

**Tech Stack:** React Native · Expo · TypeScript · `@clerk/clerk-expo` v2 · react-intl · `@indiecrafts/packages-mobile-ui-native` (Button/ThemedText/useColor) · jest + jest-expo.

**Spec:** `docs/superpowers/specs/2026-08-23-self-service-erasure-ui-design.md` (Section 4). **Integration map (exact paths):** `.superpowers/sdd/slice-d-mobile-integration-map.md`. **Reference:** Slice B's web `DeleteAccountSection` + `AccountDeletePanel`.

## Global Constraints

- **Worker contract (Slice A):** `POST ${apiUrl}/v1/erasure/self`, `Authorization: Bearer <token>`, body `{ "email" }`; 200 clean · 207 partial (still erased) · 400 mismatch · 401 · 503. 200 AND 207 = success.
- **The native component NEVER imports `@clerk/*`** — takes `getToken`/`apiUrl`/`onDeleted`/`copy` as props (the DOM contract). `@indiecrafts/packages-mobile-ui-native` has no Clerk dep; keep it that way.
- **`ui-native` rules:** never hard-code a colour — read tokens via `useColor(token)`; keep the a11y baseline (44pt targets, roles, dynamic type). No hard-coded user-facing strings — all via react-intl `messages/`.
- **Commit `--no-verify`**; **stage ONLY each task's named files** (never `git add -A`); prettier `--write` changed files.
- **Writing-style** on comments/docs/commits: active voice, ≤20 words/sentence, lead with the change.

---

### Task 1: Extract the shared helper + native `DeleteAccountSection`

**Files:**

- Create: `code/packages/shared/compliance/src/shared/erasure-self.ts` (the pure `submitAccountErasure` + `ErasureSelfResult`, moved here)
- Modify: `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx` (import + re-export the helper from `../shared/erasure-self` instead of defining it inline)
- Create: `code/packages/shared/compliance/src/native/DeleteAccountSection.tsx` (RN component + the `DeleteAccountCopy`/`DeleteAccountSectionProps` types, imports the shared helper)
- Modify: `code/packages/shared/compliance/src/native/index.ts` (export the native component + types)

**Interfaces:**

- Consumes: `submitAccountErasure` from `../shared/erasure-self`; `Button`, `ThemedText`, `useColor` from `@indiecrafts/packages-mobile-ui-native`; `TextInput`, `View` from `react-native`.
- Produces: `code/packages/shared/compliance/src/shared/erasure-self.ts` exporting `submitAccountErasure(input: { apiUrl; getToken; email }): Promise<ErasureSelfResult>` + `type ErasureSelfResult = "done"|"partial"|"mismatch"|"error"`. The native barrel exports `DeleteAccountSection` (RN) + `type DeleteAccountCopy` + `type DeleteAccountSectionProps` (identical shape to the web ones).

- [ ] **Step 1: Move the helper (no behaviour change).** Cut `submitAccountErasure` + `ErasureSelfResult` out of `code/packages/shared/compliance/src/web/DeleteAccountSection.tsx` into a new `code/packages/shared/compliance/src/shared/erasure-self.ts` (verbatim — it is pure `fetch`, no DOM). In the web file, add `import { submitAccountErasure, type ErasureSelfResult } from "../shared/erasure-self";` and re-export them (`export { submitAccountErasure } from "../shared/erasure-self"; export type { ErasureSelfResult } from "../shared/erasure-self";`) so the existing web barrel + the existing `DeleteAccountSection.test.ts` (which imports from `./DeleteAccountSection`) keep resolving unchanged.

- [ ] **Step 2: Verify the web side still passes.** `pnpm --filter @indiecrafts/packages-shared-compliance test` — the existing 5 `submitAccountErasure` cases still green via the re-export (no test edit needed).

- [ ] **Step 3: Write the native component** `code/packages/shared/compliance/src/native/DeleteAccountSection.tsx`. Mirror the web component's props + logic, RN primitives (follow `SignInForm` in `code/projects/mobile/surfaces/main/app/sign-in.tsx` lines 91-271 for the `TextInput` + `Button` + `useState` + inline token-styled input pattern):

```tsx
import { useState } from "react";
import { TextInput, View } from "react-native";
import {
  Button,
  ThemedText,
  useColor,
} from "@indiecrafts/packages-mobile-ui-native";
import {
  submitAccountErasure,
  type ErasureSelfResult,
} from "../shared/erasure-self";

export interface DeleteAccountCopy {
  heading: string;
  body: string;
  emailLabel: string;
  emailPlaceholder: string;
  confirmButton: string;
  pending: string;
  success: string;
  partial: string;
  error: string;
  mismatch: string;
}
export interface DeleteAccountSectionProps {
  copy: DeleteAccountCopy;
  apiUrl: string;
  getToken: () => Promise<string | null>;
  onDeleted: () => void | Promise<void>;
  beforeConfirm?: () => Promise<boolean>;
}

type Status = "idle" | "pending" | ErasureSelfResult;

export function DeleteAccountSection({
  copy,
  apiUrl,
  getToken,
  onDeleted,
  beforeConfirm,
}: DeleteAccountSectionProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const border = useColor("border");
  const fg = useColor("foreground");
  const danger = useColor("destructive"); // use the same danger token SignInForm uses for errors

  async function onConfirm() {
    if (!email.trim() || status === "pending") return;
    if (beforeConfirm && !(await beforeConfirm())) return;
    setStatus("pending");
    const result = await submitAccountErasure({
      apiUrl,
      getToken,
      email: email.trim(),
    });
    setStatus(result);
    if (result === "done" || result === "partial") await onDeleted();
  }

  const message =
    status === "done"
      ? copy.success
      : status === "partial"
        ? copy.partial
        : status === "mismatch"
          ? copy.mismatch
          : status === "error"
            ? copy.error
            : null;

  return (
    <View style={{ gap: 8 }}>
      <ThemedText variant="title">{copy.heading}</ThemedText>
      <ThemedText variant="muted">{copy.body}</ThemedText>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder={copy.emailPlaceholder}
        placeholderTextColor={border}
        autoCapitalize="none"
        keyboardType="email-address"
        inputMode="email"
        accessibilityLabel={copy.emailLabel}
        style={{
          height: 44,
          borderWidth: 1,
          borderColor: border,
          borderRadius: 8,
          paddingHorizontal: 12,
          color: fg,
        }}
      />
      <Button
        variant="outline"
        label={status === "pending" ? copy.pending : copy.confirmButton}
        onPress={() => void onConfirm()}
        disabled={status === "pending" || email.trim().length === 0}
      />
      {message ? (
        <ThemedText style={{ color: danger }}>{message}</ThemedText>
      ) : null}
    </View>
  );
}
```

Verify against the real `ui-native` exports: confirm `Button`'s prop names (`label`/`onPress`/`variant`/`disabled`), `ThemedText`'s `variant` values, and the exact `useColor` token names (`"border"`, `"foreground"`, and the danger token — read `code/packages/mobile/ui-native/src/components/*.tsx` + the `SignInForm` usage). Adjust to match; keep the a11y label + 44pt height.

- [ ] **Step 4: Export from the native barrel.** Add to `code/packages/shared/compliance/src/native/index.ts`: `export { DeleteAccountSection } from "./DeleteAccountSection"; export type { DeleteAccountCopy, DeleteAccountSectionProps } from "./DeleteAccountSection";`.

- [ ] **Step 5: Prettier + commit.**

```bash
git add code/packages/shared/compliance/src/shared/erasure-self.ts code/packages/shared/compliance/src/web/DeleteAccountSection.tsx code/packages/shared/compliance/src/native/DeleteAccountSection.tsx code/packages/shared/compliance/src/native/index.ts
git commit --no-verify -m "feat(compliance): native DeleteAccountSection + shared submit helper"
```

---

### Task 2: Mount in the mobile `SignedInView` + i18n + flag

**Files:**

- Modify: `code/projects/mobile/surfaces/main/app/sign-in.tsx` (`SignedInView` — mount the control)
- Modify: `code/projects/mobile/surfaces/main/messages/en.json` + `fr.json` (add `account.delete.*`)
- Modify: `code/projects/mobile/surfaces/main/config/index.ts` (flat `features` literal — add `deleteAccount: true`)
- Modify: `code/projects/mobile/surfaces/main/CHANGELOG.md`

**Interfaces:** Consumes `DeleteAccountSection` + `type DeleteAccountCopy` from `@indiecrafts/packages-shared-compliance/native` (Task 1).

- [ ] **Step 1: Flag.** `config/index.ts:50` → `export const features = { requireConsent: false, deleteAccount: true } as const;`.
- [ ] **Step 2: i18n.** Add a nested `account.delete` object (the 10 `DeleteAccountCopy` keys) to `messages/en.json` and `messages/fr.json`, matching the existing `auth`/`consent` nesting. English warm/editorial (heading "Delete your account"; body: permanent deletion + the activity log is retained for legal accountability); French a real translation. Identical key shape both files.
- [ ] **Step 3: Mount in `SignedInView`** (`app/sign-in.tsx`). Add `getToken` to the existing `const { signOut } = useAuth();` → `const { signOut, getToken } = useAuth();`. Import `DeleteAccountSection`, `type DeleteAccountCopy` from `@indiecrafts/packages-shared-compliance/native`, `features` from `@/config`. Build `copy` from `t.formatMessage({ id: "account.delete.heading" })` etc. Render, gated + fail-safe on the API URL:

```tsx
const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? "";
// … inside the returned fragment, after the existing buttons:
{
  features.deleteAccount && apiUrl ? (
    <DeleteAccountSection
      copy={copy}
      apiUrl={apiUrl}
      getToken={() => getToken()}
      onDeleted={async () => {
        await signOut();
        router.replace("/");
      }}
    />
  ) : null;
}
```

(`router` is already in `SignedInView`. The `&& apiUrl` gate mirrors the web/app fail-safe: never render a control that would POST to an empty origin.)

- [ ] **Step 4: Verify.** `pnpm --filter @indiecrafts/mobile-surfaces-main tsc` (exit 0 — validates the native component's types transitively) and `pnpm --filter @indiecrafts/mobile-surfaces-main test` (jest — existing tests still green). Prettier `--write` changed files (skip .json if the repo doesn't prettier messages — check).
- [ ] **Step 5: Changelog + commit.** Add an `## [Unreleased]` → `### Added` entry to `code/projects/mobile/surfaces/main/CHANGELOG.md` (bolded lead + `**Why:**`, matching the existing Clerk-auth entry format). Commit `--no-verify`:

```bash
git add code/projects/mobile/surfaces/main/app/sign-in.tsx code/projects/mobile/surfaces/main/messages/en.json code/projects/mobile/surfaces/main/messages/fr.json code/projects/mobile/surfaces/main/config/index.ts code/projects/mobile/surfaces/main/CHANGELOG.md
git commit --no-verify -m "feat(compliance): mobile account-delete control"
```

---

## Self-review

**1. Spec coverage (Section 4):** native component (T1), mobile mount (T2), Clerk-via-props (T1 interface), react-intl copy (T2), flag gating + fail-safe API-URL gate (T2), post-delete signOut + route (T2). Covered.

**2. Placeholder scan:** the native component code is complete; the one author-judgement is matching `ui-native`'s exact `Button`/`ThemedText`/`useColor` prop + token names — pinned to reading those files + the `SignInForm` mirror. i18n copy authored following the web `account.delete` baseline.

**3. Type/name consistency:** `DeleteAccountCopy`/`DeleteAccountSectionProps`/`submitAccountErasure`/`ErasureSelfResult` names identical to the web slice; the worker contract matches Slice A. The extracted `../shared/erasure-self` is imported by both web (re-export, unchanged public API) and native.

**Ruling RD-EXTRACT:** `submitAccountErasure` moves to `src/shared/erasure-self.ts` (one universal fetch impl); the web component re-exports it so Slice B's public API + test are unchanged. Cost if wrong: revert to per-platform copies; low.
**Ruling RD-TEST:** the shared helper keeps its existing vitest coverage (via the web test's re-export path); the native component's RENDER is not unit-tested in the package (no RN test infra there) — its types are verified by the mobile-surface tsc in T2, and the mobile jest suite stays green. A jest-expo render test for `SignedInView` is a deferred nice-to-have. Cost if wrong: add a jest-expo render test later.
