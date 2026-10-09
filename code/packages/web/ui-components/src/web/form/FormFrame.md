> The shared frame of every public form · `FormFrame.tsx` + `GuardedFields.tsx` + `useGuardedSubmit.ts`

**Use when** you build a new public form (a block or a page). The contact, waitlist, newsletter
and lead-magnet forms are all built from these parts; a new form writes only its own fields and
its endpoint.

## The parts

| Part                         | Gives you                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useGuardedSubmit(endpoint)` | `submit(fields)` — POSTs your fields plus `consent`, the page `language`, `source`, the honeypot, `startedAt` and the Turnstile token. `201` → success. |
| `FormFrame`                  | The section, the `card` / `inline` / `banner` card, the heading (`headingAs`) and body, then the success line or your form.                             |
| `GuardedFields`              | The `<form>`: the honeypot, your fields (`children`), the consent box, Turnstile, an optional `footer`, the error line.                                 |
| `FormInput` · `SubmitButton` | A labelled input (the label is the placeholder, for screen readers) and the submit, disabled until consent + Turnstile allow it.                        |

## Add a form

1. **Client form** — `useGuardedSubmit("/api/<name>")`, then `FormFrame` › `GuardedFields` ›
   your fields. Copy falls back to the host app's `forms.*` messages (add `forms.<name>.*` in
   every locale).
2. **Server wrapper** — `formBlock("<flag>", props)` (the code flag + the Studio switch), as in
   `Contact.tsx`. A new flag goes in `BlockFeatures` (`../features.ts`).
3. **Schema + query** — the block in `@indiecrafts/packages-web-page-builder`, and its Studio
   switch in `MODULES_FRAGMENT` if it has a settings singleton.
4. **Route** — a `withGuard` route in the app (same-site origin, body cap, rate limit,
   Turnstile) that validates at the boundary and answers `201` on success.
5. **Story + docs** — a colocated `*.stories.tsx` and `*.md`, like this one.

**Multistep:** keep one `useGuardedSubmit` and one state for the whole form. Render the earlier
steps inside `FormFrame` with your own "Next" buttons, and `GuardedFields` (honeypot, consent,
Turnstile, submit) on the last step only; its `onSubmit` sends every step's values in one
`submit()`. `startedAt` is set when the form first renders, so a slow multistep visitor still
passes the timing check.
