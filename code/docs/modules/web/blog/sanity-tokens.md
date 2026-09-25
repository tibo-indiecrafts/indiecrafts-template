---
title: "Sanity tokens — configuration reference"
description: "How to issue, store, rotate, and troubleshoot the API tokens this project uses."
status: stable
---

# Sanity tokens — configuration reference

How to issue, store, rotate, and troubleshoot the API tokens this project uses. Pairs with [`sanity-setup.md`](/modules/web/blog/sanity-setup) (schemas, routes, QA); this page is auth + security.

Project ID: `qy2pp5sn` (the value in this repo's `.env.local`; override per client via `NEXT_PUBLIC_SANITY_PROJECT_ID`).

---

## 1. Env slots

`code/projects/web/surfaces/website/.env.example` documents four Sanity slots. Public values are safe in the browser bundle; tokens are server-only.

```bash
# .env.local (never committed — .gitignore keeps only .env.example)

# ── Public (NEXT_PUBLIC_) — exposed to the browser ──
NEXT_PUBLIC_SANITY_PROJECT_ID=qy2pp5sn
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01

# ── Server-only — NEVER prefix with NEXT_PUBLIC_ ──
SANITY_API_READ_TOKEN=sk_...   # Viewer role
SANITY_API_WRITE_TOKEN=sk_...  # Editor role
```

| Slot                                         | Role       | Read by                                                                                                                                                                                       | Required when                                                                                      |
| -------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` + `_DATASET` | —          | `@indiecrafts/packages-web-sanity/env` (asserted — throws if missing) → Studio + every client read                                                                                            | always, when Studio/blog are on                                                                    |
| `NEXT_PUBLIC_SANITY_API_VERSION`             | —          | `@indiecrafts/packages-web-sanity/env` (defaults to `2025-01-01` if unset)                                                                                                                    | optional; pin it to keep query semantics stable                                                    |
| `SANITY_API_READ_TOKEN`                      | **Viewer** | `@indiecrafts/packages-web-sanity/token` → `@indiecrafts/packages-web-sanity/client` + `@indiecrafts/packages-web-sanity/live` (`sanityFetch` / `sanityFetchLive`) + `/api/draft-mode/enable` | draft preview + live updates. Without it: public reads still work; the enable endpoint returns 503 |
| `SANITY_API_WRITE_TOKEN`                     | **Editor** | `code/projects/web/surfaces/website/scripts/seed-demo.mjs` only (`pnpm seed`)                                                                                                                 | running the seed. Never read at runtime                                                            |

The Studio at `/studio` needs **no token** — visitors authenticate with their own Sanity session cookie.

> **Note.** Sanity requires an auth token even for "public" datasets unless an explicit allow-public policy is set. `@indiecrafts/packages-web-sanity/client` reads `SANITY_API_READ_TOKEN` inline: on the server it's sent on every request; in the browser bundle the non-`NEXT_PUBLIC_` var is stripped, so the client makes anonymous requests (fine — the only browser consumer is the embedded Studio with its cookie).

---

## 2. Built-in roles

| Role              | Reads              | Writes | Project settings    | Use for                             |
| ----------------- | ------------------ | ------ | ------------------- | ----------------------------------- |
| **Viewer**        | yes (incl. drafts) | no     | none                | Runtime read client + draft preview |
| **Editor**        | yes                | yes    | limited             | Seed scripts, import jobs           |
| **Deploy Studio** | —                  | —      | Studio deploys only | CI running `sanity deploy`          |
| **Administrator** | yes                | yes    | all                 | Break-glass; never put in env files |

Free + Growth plans expose `viewer`, `editor`, `deploy-studio` for tokens. Custom roles need the Enterprise plan.

Tokens minted via the Web UI or CLI are **robot tokens** — no expiry, tied to the project (not your user). Use these for apps and scripts. **Personal tokens** (your login session) silently rotate when you log out — never put one in code.

---

## 3. Where to issue tokens

### Web UI

1. <https://www.sanity.io/manage> → pick the project (`qy2pp5sn`)
2. **API → Tokens → Add API token**
3. Descriptive name (e.g. `indiecrafts-template-read`)
4. Pick a role (§2)
5. Save once — the token is shown **exactly once**; copy it into `.env.local` immediately (Sanity stores only the hash)

### CLI

The Sanity CLI runs without a global install via `pnpm dlx sanity@latest`. First use needs a one-shot OAuth login.

```bash
# 1. Log in once (opens a browser, or prints the URL with --no-open).
#    Cached at ~/.config/sanity/config.json for every later command.
pnpm dlx sanity@latest login --no-open

# 2. Mint the two robot tokens
pnpm dlx sanity@latest tokens add "indiecrafts-template-read" \
  --project qy2pp5sn --role=viewer
pnpm dlx sanity@latest tokens add "indiecrafts-template-seed" \
  --project qy2pp5sn --role=editor
```

Each `tokens add` prints the `sk...` string once — paste into `.env.local` immediately.

Other useful verbs:

```bash
pnpm dlx sanity@latest tokens list                 # what's already in the project
pnpm dlx sanity@latest tokens remove <token-id>    # revoke
pnpm dlx sanity@latest projects list               # confirm projectId
pnpm dlx sanity@latest debug --secrets             # diagnose auth / env
```

---

## 4. Security checklist

1. **Server-only by default.** `.env.local` is gitignored; only `.env.example` is tracked.
2. **Never prefix a token with `NEXT_PUBLIC_`** — it would bake into the client bundle.
3. **One token per use case.** Don't reuse the seed Editor token for runtime reads — if it leaks, write access leaks.
4. **On Cloudflare** set the same values on the Worker — public vars in `wrangler.toml` / GitHub Environment **vars**, tokens as **secrets** (`wrangler secret put … --env <env>`) — then re-deploy.
5. **Rotate by revoke + reissue.** Manage → API → Tokens → row → **Revoke**; recreate with a new name, update env, redeploy.

---

## 5. CORS origins

Tokens authorize **what**; CORS controls **where** browser requests originate. Separate concerns.

Manage → API → **CORS Origins → Add CORS origin**:

| Origin                       | Why                                       |
| ---------------------------- | ----------------------------------------- |
| `http://localhost:3000`      | Local Studio dev                          |
| `https://<your-prod-domain>` | Production Studio + any client-side reads |

Tick **Allow credentials** so the Studio's session cookie is sent.

**Server-side reads (`sanityFetch` / `sanityFetchLive` in `@indiecrafts/packages-web-sanity/live`) are not subject to CORS** — they originate from the Next.js server, not the browser. CORS only matters for browser-side requests (the embedded Studio + any client-side `@sanity/client` use).

---

## 6. Step-by-step for this project

Two equivalent paths — the CLI path is scriptable; the Web UI path is faster if you'd rather click.

### Path A — CLI-driven

```bash
# 1. One-time interactive login (browser OAuth)
pnpm dlx sanity@latest login --no-open

# 2. Mint the read token (Viewer)
pnpm dlx sanity@latest tokens add "indiecrafts-template-read" \
  --project qy2pp5sn --role=viewer

# 3. Mint the write token (Editor)
pnpm dlx sanity@latest tokens add "indiecrafts-template-seed" \
  --project qy2pp5sn --role=editor

# 4. Write tokens into .env.local
cat >> code/projects/web/surfaces/website/.env.local <<EOF
SANITY_API_READ_TOKEN=<paste viewer token>
SANITY_API_WRITE_TOKEN=<paste editor token>
EOF

# 5. Seed demo content (uses the Editor token → SANITY_API_WRITE_TOKEN)
pnpm seed
# → "✓ Committed transaction <id>"

# 6. Restart dev so the new env is picked up
pnpm dev

# 7. Verify draft mode is wired (uses the Viewer token). /api/draft-mode/disable
#    is the safe canary: 307 redirect when wired, 404 when features.studio is off.
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/disable

# 8. Spot-check the public surface
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog          # 200
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/fr/blog        # 200
curl -sS  -o /dev/null -w "%{http_code}\n" http://localhost:3000/blog/rss.xml   # 200
```

### Path B — Web UI

```bash
# 1. Open the tokens dashboard
open "https://www.sanity.io/manage/personal/project/qy2pp5sn/api/tokens"

# 2. Add 'indiecrafts-template-read' role=Viewer; copy the token.
# 3. Add 'indiecrafts-template-seed' role=Editor; copy the token.
# 4. Paste both into code/projects/web/surfaces/website/.env.local:
#      SANITY_API_READ_TOKEN=<viewer token>
#      SANITY_API_WRITE_TOKEN=<editor token>
# 5. Seed + verify — same as Path A steps 5-8
pnpm seed
pnpm dev
```

### Login-less on CI / shared machines

If `sanity login` isn't an option (no browser), authenticate the CLI with an existing token. Issue **one** Editor token from the Web UI, then:

```bash
SANITY_AUTH_TOKEN=<editor-token> pnpm dlx sanity@latest tokens add \
  "indiecrafts-template-read" --project qy2pp5sn --role=viewer
```

That mints the Viewer token using the Editor token's authority — no browser. Later commands either re-supply `SANITY_AUTH_TOKEN=` inline or read the cached login at `~/.config/sanity/config.json`.

---

## 7. Troubleshooting

| Symptom                                                    | Cause                                           | Fix                                                                             |
| ---------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------- |
| `✗ Missing SANITY_API_WRITE_TOKEN` from `pnpm seed`        | Editor token not in env                         | Add `SANITY_API_WRITE_TOKEN`, or run `SANITY_API_WRITE_TOKEN=<token> pnpm seed` |
| `✗ Missing NEXT_PUBLIC_SANITY_PROJECT_ID` from `pnpm seed` | Project ID not in env                           | Set `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local`                             |
| `401 Unauthorized` from the seed                           | Editor token missing / wrong / revoked          | Re-issue an Editor robot token into `SANITY_API_WRITE_TOKEN`                    |
| `403 Insufficient permissions` from the seed               | Token has Viewer role, seed needs writes        | Re-create with **Editor** role                                                  |
| Draft preview returns **503**                              | Read token not set at server start              | Add `SANITY_API_READ_TOKEN`, restart dev                                        |
| Draft-mode endpoints return **404**                        | `features.studio` is off                        | Enable the Studio feature flag                                                  |
| CORS error in the Studio console                           | Origin missing in Manage → API → CORS Origins   | Add the origin, tick **Allow credentials**, refresh                             |
| Studio loads but everything is empty                       | Token fine, dataset empty                       | Run `pnpm seed`                                                                 |
| Tokens vanish from the dashboard after months              | Personal tokens auto-rotate; robot tokens don't | Re-issue as a robot token (the Manage UI does this by default)                  |
| `sanity login` opens a blank tab                           | Browser can't handle the deep link              | Re-run with `--no-open`; copy the printed URL manually                          |
| `sanity tokens add` → `not authenticated`                  | CLI auth cache missing                          | Re-run `sanity login`, or pass `SANITY_AUTH_TOKEN=<token>` inline               |
| `sanity tokens add` → `project not found`                  | Wrong `--project` ID or no access               | `sanity projects list` to confirm; if missing access, contact an admin          |

---

## 8. Sources

- [Roles and permissions | Sanity Docs](https://www.sanity.io/docs/content-lake/roles-concepts)
- [Authentication | Sanity Docs](https://www.sanity.io/docs/content-lake/http-auth)
- [Tokens CLI command reference | Sanity Docs](https://www.sanity.io/docs/cli-reference/tokens)
