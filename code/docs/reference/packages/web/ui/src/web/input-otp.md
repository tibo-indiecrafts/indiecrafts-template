---
title: "OTP input"
description: "A styled one-time-code input built on the input-otp primitive."
status: stable
---

# OTP input

> Segmented one-time-passcode input with per-digit slots and a blinking caret.

## Purpose

`InputOTP` wraps the `input-otp` primitive to render a code as separate digit slots. `InputOTPSlot` reads the primitive context to show its character, active state, and a fake caret. Groups and separators arrange the slots.

## Exports

- `InputOTP` — the root; accepts `maxLength`, `value`, `onChange`, and `containerClassName`.
- `InputOTPGroup` — a row of slots.
- `InputOTPSlot` — one digit slot; requires an `index`.
- `InputOTPSeparator` — a divider (a minus icon) between groups.

## Usage

```tsx
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@indiecrafts/packages-web-ui/web/input-otp";

export function CodeField() {
  return (
    <InputOTP maxLength={4}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  );
}
```

## Source

`code/packages/web/ui/src/web/input-otp.tsx`
