---
title: "Churn survey"
description: "The controlled exit-survey fields shown inside the account-deletion section."
status: stable
---

# Churn survey

> The optional "before you go" fields inside the deletion form.

## Purpose

The optional "before you go" exit-survey — a reason radio, free-text feedback, and who the user is switching to. A controlled sub-component of `DeleteAccountSection`: it owns no state, and copy is injected. Extracted so the deletion form stays focused on the confirm and submit path.

## Exports

- `ChurnSurveyCopy` (type) — the `survey` slice of `DeleteAccountCopy`.
- `ChurnSurveyProps` (interface) — the controlled props (values + `on*` handlers + `idPrefix`).
- `ChurnSurvey` — the survey fieldset component.

## Usage

```tsx
import { ChurnSurvey } from "@indiecrafts/packages-shared-compliance/web";

<ChurnSurvey
  copy={copy.survey}
  idPrefix={uid}
  reason={reason}
  feedback={feedback}
  competitor={competitor}
  onReason={setReason}
  onFeedback={setFeedback}
  onCompetitor={setCompetitor}
/>;
```

## Source

`code/packages/shared/compliance/src/web/ChurnSurvey.tsx`
