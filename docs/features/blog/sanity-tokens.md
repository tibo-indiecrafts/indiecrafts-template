# Sanity tokens — configuration reference

How to issue, store, rotate, and troubleshoot the API tokens this project uses. Pairs with [`sanity-setup.md`](./sanity-setup.md) — that document covers the schemas, routes, and test plan; this one focuses on auth and security.

Project ID: `qy2pp5sn` (override via `NEXT_PUBLIC_SANITY_PROJECT_ID`).

---

## 1. Where to issue tokens

### Web UI

1. Go to <https://www.sanity.io/manage>
2. Pick the project (here, `qy2pp5sn`)
3. Sidebar → **API** → **Tokens** → **Add API token**
4. Give it a descriptive name (e.g. `indiecrafts-template-read`)
5. Pick a role (see §3)
6. Save once — **the token is shown exactly one time**; copy it immediately and paste into your env file

### CLI

The Sanity CLI ships with `@sanity/cli`. You can invoke it without installing anything globally via `pnpm dlx sanity@latest`. First-time CLI use needs a one-shot OAuth login.

**Step 1 — log in once** (interactive; opens a browser tab, or prints the URL with `--no-open`):

```bash
pnpm dlx sanity@latest login --no-open
```

Pick the same provider (Google / GitHub / email) you used to create the project. Credentials get cached at `~/.config/sanity/config.json` and the same login serves every subsequent CLI command on this machine.

**Step 2 — mint the two robot tokens**:

```bash
pnpm dlx sanity@latest tokens add "indiecrafts-template-read" \
  --project qy2pp5sn --role=viewer

pnpm dlx sanity@latest tokens add "indiecrafts-template-seed" \
  --project qy2pp5sn --role=editor
```

Each command prints the freshly-minted token. Copy the `sk...` string into `.env.local` immediately — Sanity stores only the hash, so the plaintext is shown exactly once.

**Other useful CLI verbs**:

```bash
pnpm dlx sanity@latest tokens list                        # what's already in the project
pnpm dlx sanity@latest tokens remove <token-id>           # revoke
pnpm dlx sanity@latest projects list                      # confirm projectId
pnpm dlx sanity@latest debug --secrets                    # diagnose auth / env issues
```

Tokens created via either the Web UI or the CLI are **robot tokens** — no expiry, tied to the project (not your user). Use these for apps and scripts. Don't use **personal tokens** (your login session) in code — they silently rotate when you log out.

---

## 2. Built-in roles

| Role              | Reads              | Writes | Project settings    | Free plan | Use for                              |
| ----------------- | ------------------ | ------ | ------------------- | --------- | ------------------------------------ |
| **Viewer**        | yes (incl. drafts) | no     | none                | yes       | Runtime read client + draft preview  |
| **Editor**        | yes                | yes    | limited             | yes       | Seed scripts, import jobs            |
| **Deploy Studio** | —                  | —      | Studio deploys only | yes       | CI running `sanity deploy`           |
| **Administrator** | yes                | yes    | all                 | yes       | Break-glass; do not use in env files |

Free + Growth plans expose `viewer`, `editor`, `deploy-studio` for tokens. Custom roles require the Enterprise plan.

---

## 3. How our three env slots map

```bash
# .env.local

# ── Public (NEXT_PUBLIC_) — safe to expose to the browser bundle ──
NEXT_PUBLIC_SANITY_PROJECT_ID=qy2pp5sn
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-01-01

# ── Server-only — NEVER prefix with NEXT_PUBLIC_ ──
SANITY_API_READ_TOKEN=sk_...   # Viewer role (Free plan OK)
SANITY_API_WRITE_TOKEN=sk_...  # Editor role (Free plan OK)
```

| Slot                                         | Role       | Used by                                                                                               | Required when                                                                                                                          |
| -------------------------------------------- | ---------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` + `_DATASET` | —          | Studio + every client read                                                                            | **always** when `features.blog: true`                                                                                                  |
| `SANITY_API_READ_TOKEN`                      | **Viewer** | `src/sanity/token.ts` → `src/sanity/live.ts` (`defineLive`, `sanityFetch`) + `/api/draft-mode/enable` | draft preview, real-time live updates. Without it: public reads still work; the enable endpoint returns 503 with an actionable message |
| `SANITY_API_WRITE_TOKEN`                     | **Editor** | `scripts/seed-blog-demo.mjs` only                                                                     | running `pnpm seed`. Never read at runtime                                                                                             |

The Studio at `/studio` itself **does not need a token** — visitors authenticate via the regular Sanity session cookie when they open the page.

---

## 4. Security checklist

1. **Server-only by default.** Confirm `.env.local` is in `.gitignore` (it is — `!.env.example` keeps only the template tracked).
2. **Never prefix tokens with `NEXT_PUBLIC_`.** That would bake them into the client bundle.
3. **One token per use case.** Don't reuse the seed-time Editor token for runtime reads — if it leaks, write access is exposed.
4. **On Vercel / Netlify** put the same vars in the dashboard's Environment Variables panel. Re-deploy after adding.
5. **Rotate by revoking + reissuing.** In **Manage → API → Tokens**, click the row → **Revoke**. Re-create with a new name, update env, redeploy.

---

## 5. CORS origins

Tokens authorize **what** can be done; CORS controls **where** browser requests can come from. The two are separate.

Configure in the same dashboard: **Manage → API → CORS Origins → Add CORS origin**. Add:

| Origin                       | Why                                       |
| ---------------------------- | ----------------------------------------- |
| `http://localhost:3000`      | Local Studio dev                          |
| `https://<your-prod-domain>` | Production Studio + any client-side reads |

Tick **Allow credentials** so the Studio's session cookie is sent on requests.

**Server-side reads (our `sanityFetchLive`) are NOT subject to CORS** — those originate from the Next.js server, not the browser. CORS only matters for browser-side requests (the embedded Studio + any client-side `@sanity/client` use).

---

## 6. Step-by-step for this project

Two equivalent paths — pick one. The CLI path is fully scriptable; the Web UI path is faster if you'd rather click than type.

### Path A — fully CLI-driven (recommended)

```bash
# 1. One-time interactive login (browser OAuth)
pnpm dlx sanity@latest login --no-open

# 2. Mint the read token (Viewer role)
pnpm dlx sanity@latest tokens add "indiecrafts-template-read" \
  --project qy2pp5sn --role=viewer
# → copies the printed sk... into the next step

# 3. Mint the write token (Editor role)
pnpm dlx sanity@latest tokens add "indiecrafts-template-seed" \
  --project qy2pp5sn --role=editor

# 4. Write tokens into .env.local
cat >> .env.local <<EOF
SANITY_API_READ_TOKEN=<paste viewer token>
SANITY_API_WRITE_TOKEN=<paste editor token>
EOF

# 5. Seed demo content (uses the Editor token)
pnpm seed
# → "✓ Committed transaction <uuid>"

# 6. Restart dev so the new env is picked up
pnpm dev

# 7. Verify draft preview is wired (uses the Viewer token).
#    /api/draft-mode/disable is the always-safe canary — 307 when wired,
#    404 if the `features.studio` flag is off (the editing surface it belongs to).
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/disable

# 8. Spot-check the public surface
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog        # 200
curl -sSL -o /dev/null -w "%{http_code}\n" http://localhost:3000/fr/blog        # 200
curl -sS  -o /dev/null -w "%{http_code}\n" http://localhost:3000/en/blog/rss.xml # 200
```

### Path B — Web UI

```bash
# 1. Open the dashboard
open "https://www.sanity.io/manage/personal/project/qy2pp5sn/api/tokens"

# 2. Add 'indiecrafts-template-read' with role=Viewer; copy the token.
# 3. Add 'indiecrafts-template-seed' with role=Editor; copy the token.

# 4. Paste both into .env.local (existing keys already present):
#    SANITY_API_READ_TOKEN=<viewer token>
#    SANITY_API_WRITE_TOKEN=<editor token>

# 5. Seed + verify — same as steps 5-8 in Path A
pnpm seed
pnpm dev
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/disable
```

### Skipping the login step on shared / CI machines

If `sanity login` isn't an option (no browser, no OAuth provider available, CI runner), you can authenticate the CLI directly with an existing token instead. Issue **one** Editor token from the Web UI, then:

```bash
SANITY_AUTH_TOKEN=<editor-token> pnpm dlx sanity@latest tokens add \
  "indiecrafts-template-read" --project qy2pp5sn --role=viewer
```

That mints the Viewer token using the Editor token's authority, no browser required. Subsequent CLI commands either re-supply `SANITY_AUTH_TOKEN=` inline or read from `~/.config/sanity/config.json` if you've already logged in.

---

## 7. Quick troubleshooting

| Symptom                                                    | Cause                                             | Fix                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `401 Unauthorized` from the seed script                    | Editor token missing / wrong / revoked            | Re-issue an Editor robot token, paste into `SANITY_API_WRITE_TOKEN` |
| `403 Insufficient permissions` from the seed script        | Token has Viewer role but the seed needs writes   | Re-create with **Editor** role                                      |
| Draft preview returns 503 with `set SANITY_API_READ_TOKEN` | Read token not in env at server start             | Add `SANITY_API_READ_TOKEN`, restart dev                            |
| CORS error in the Studio browser console                   | Missing origin in **Manage → API → CORS Origins** | Add the origin, tick **Allow credentials**, refresh                 |
| Studio loads but everything is empty                       | Token is fine but dataset is empty                | Run `pnpm seed`                                                     |
| Tokens vanish from the dashboard after months              | Personal tokens auto-rotate; robot tokens do not  | Re-issue as a **robot token** (Manage UI does this by default)      |
| `sanity login` opens a blank browser tab                   | Browser doesn't handle the deep link              | Re-run with `--no-open`; copy the printed URL manually              |
| `sanity tokens add` fails with `not authenticated`         | CLI auth cache missing (`~/.config/sanity/`)      | Re-run `sanity login`, or pass `SANITY_AUTH_TOKEN=<token>` inline   |
| `sanity tokens add` fails with `project not found`         | Wrong `--project` ID, or your user lacks access   | `sanity projects list` to confirm; if missing access, contact admin |

---

## 8. Sources

- [Roles and permissions | Sanity Docs](https://www.sanity.io/docs/content-lake/roles-concepts)
- [Authentication | Sanity Docs](https://www.sanity.io/docs/content-lake/http-auth)
- [Tokens CLI command reference | Sanity Docs](https://www.sanity.io/docs/cli-reference/tokens)
- [Roles | Sanity Docs](https://www.sanity.io/docs/user-guides/roles)
