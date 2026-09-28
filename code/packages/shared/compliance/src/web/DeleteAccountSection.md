The **GDPR self-service "Delete my account" panel** — above the confirm control, an optional
churn exit-survey (a reason radio group + a feedback textarea + a competitor input, all
optional) — then a signed-in user types their account email to confirm and submits. Drives
`submitAccountErasure`, the one authenticated POST to the Slice-A erasure worker route
(`${apiUrl}/v1/erasure/self`), sending a bearer token from `getToken`, the typed email, and
any survey fields the user filled in. `200` → done, `207` → partial (erased; some stores need
manual follow-up), `400` → the typed email did not match the account, anything else → error.

Clerk-free and Next-free, so the `app` web surface uses it —
no next-intl or Clerk import inside. Mirrors the `./native` (RN) sibling.

## Props

All copy is **passed in** — the component imports no app messages.

| Prop            | Type                                                                                  | Notes                                                                                                                                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `copy`          | `DeleteAccountCopy`                                                                   | Heading, body, field labels, button, all four result states, + `survey` (the exit-survey copy).                                                                                                                                                                            |
| `apiUrl`        | `string`                                                                              | Base URL of the erasure worker route.                                                                                                                                                                                                                                      |
| `getToken`      | `() => Promise<string \| null>`                                                       | Resolves the bearer token for the request (Clerk session token in real surfaces).                                                                                                                                                                                          |
| `onDeleted`     | `() => void \| Promise<void>`                                                         | Called after a `done` or `partial` result.                                                                                                                                                                                                                                 |
| `submitErasure` | `(email: string, survey?: ChurnSurveyInput) => Promise<ErasureSelfResult>` (optional) | Injected Clerk-aware submit. A surface wraps `rawErasureFetch` in `useReverification` (client step-up modal + auto-retry) and maps the outcome with `mapErasureResponse`; the brick stays `@clerk/*`-free. Omitted → the default `submitAccountErasure` path (no step-up). |

## Where it's used

Mounted by each surface's account-delete panel (website, app `AccountDeletePanel`;
mobile `SignedInView`), which supplies `apiUrl`, `getToken` from Clerk, and
`onDeleted` (sign the user out / navigate away).
