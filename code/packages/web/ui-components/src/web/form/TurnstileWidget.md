Cloudflare Turnstile — the client half of the server-side `verifyTurnstile`
(`@indiecrafts/packages-shared-security`). Renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set;
otherwise it renders nothing and the form submits unchanged (the server verify also
no-ops without `TURNSTILE_SECRET`).

Reports the solved token via `onToken`; the form sends it as `cf-turnstile-response`
and disables submit until it arrives (gate with `turnstileActive()`). On expiry/error
the token clears so the form re-blocks; remount (a changing `key`) resets the
challenge after a failed submit. Pass `siteKey` to override the key — the stories use
Cloudflare's documented test keys.
