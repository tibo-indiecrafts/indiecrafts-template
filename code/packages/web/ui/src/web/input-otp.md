> shadcn `input-otp` · `src/user-interface/ui/input-otp.tsx`

**Use when** entering a short one-time verification code (email/SMS 2FA, PIN) where each character reads as a discrete box. **Don't** use for passwords, ID numbers, or any free-text field — that's a plain `Input`.

## Anatomy

- `InputOTP` — the field: one real (hidden) `<input>` driving every slot; wraps a flex container.
- `InputOTPGroup` — a run of adjacent slots sharing a rounded border.
- `InputOTPSlot` — one character cell; shows the typed `char`, an active ring, and a blinking fake caret.
- `InputOTPSeparator` — optional decorative divider (`role="separator"`, Lucide `MinusIcon`) between groups.

## Variants

| Variant               | Use for                         | Base (Tailwind defaults + tokens)                     |
| --------------------- | ------------------------------- | ----------------------------------------------------- |
| Digits-only (default) | SMS/email codes, PINs           | `pattern={REGEXP_ONLY_DIGITS}`, `inputMode="numeric"` |
| Alphanumeric          | mixed codes                     | `pattern={REGEXP_ONLY_DIGITS_AND_CHARS}`              |
| Grouped + separator   | long codes read in chunks (3+3) | two `InputOTPGroup` split by `InputOTPSeparator`      |
| Masked                | codes on shared/public screens  | render `●` instead of `char` in the slot              |

## Sizes

| Size    | Height             | Padding             | Text        |
| ------- | ------------------ | ------------------- | ----------- |
| Default | `h-9 w-9` (36px)   | none (fixed square) | `text-sm`   |
| Touch   | `h-10 w-10` (40px) | none                | `text-base` |

Default slot is 36px — below the 40px touch minimum. Bump to `h-10 w-10` on primary auth screens and mobile.

## States

- **active/focus-visible** — `data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50` on the current slot (only one slot is ever active).
- **filled** — shows `char`; caret hidden.
- **disabled** — container `has-disabled:opacity-50`, input `disabled:cursor-not-allowed`.
- **error** — `aria-invalid` on the slot → `aria-invalid:border-destructive` (+ `ring-destructive/20` when active). Always pair with a visible message; never color alone.
- No hover, active-press, or loading state — the slot isn't a button; show verification progress on the submit button instead.

## Hierarchy

One per view, near the top of a focused auth step; autofocus the first slot. Never place two OTP fields on the same screen.

## Restrictions

- Never build N separate `<input>`s or wire per-slot `onChange` — it's a single hidden input; read `value`/`onChange`/`onComplete` on `InputOTP` only.
- Never omit `autoComplete="one-time-code"` + `inputMode` + `pattern` — that's what enables SMS autofill and the numeric keypad.
- `maxLength` must equal the slot count, and slot `index` runs 0…maxLength-1; the separator is not a slot and takes no index.
- Never reach into slot internals — read `OTPInputContext`; don't fork `src/user-interface/ui/input-otp.tsx` (shadcn CLI-managed).
- Don't add a `<label>` per slot; give the field one label and `aria-label="Character N of M"` on slots after the first.
- Don't mask by default — masking hurts error-correction; only mask in shared-screen contexts.

## Tokens

- Color: `border-input` (idle), `border-ring` (active), `bg-input/30` (dark fill), `destructive` (error only).
- Radius: `rounded-md` via `first:rounded-l-md last:rounded-r-md` (group ends only).
- Elevation: `shadow-xs` per slot (flat); no card/overlay.
- Focus: `ring-ring/50 ring-[3px]` on the active slot — the required visible focus.
- Motion: `transition-all` (≤160ms) on state; `animate-caret-blink` (`duration-1000`) for the fake caret. Guard custom motion with `motion-reduce:`.
- Type: `text-sm`; icons Lucide 20px, `aria-hidden`.

Sources:

- https://ui.shadcn.com/docs/components/input-otp
- https://base-ui.com/react/components/otp-field
- https://ionicframework.com/docs/api/input-otp
- https://github.com/guilhermerodz/input-otp
