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

```bash
pnpm dlx sanity@latest tokens add "indiecrafts-template-read" \
  --project qy2pp5sn --role=viewer

pnpm dlx sanity@latest tokens add "indiecrafts-template-seed" \
  --project qy2pp5sn --role=editor
```

Tokens created via either path are **robot tokens** — no expiry, tied to the project (not your user). Use these for apps and scripts. Don't use **personal tokens** (your login session) in code — they silently rotate when you log out.

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
| `SANITY_API_WRITE_TOKEN`                     | **Editor** | `scripts/seed-blog-demo.mjs` only                                                                     | running `pnpm seed:blog`. Never read at runtime                                                                                        |

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

```bash
# 1. Open the dashboard
open "https://www.sanity.io/manage/personal/project/qy2pp5sn/api/tokens"

# 2. Add 'indiecrafts-template-read' with role=Viewer; copy the token.
# 3. Add 'indiecrafts-template-seed' with role=Editor; copy the token.

# 4. Paste both into .env.local (existing keys already present):
#    SANITY_API_READ_TOKEN=<viewer token>
#    SANITY_API_WRITE_TOKEN=<editor token>

# 5. Seed demo content (uses the Editor token):
pnpm seed:blog

# 6. Restart dev so the new env is picked up:
pnpm dev

# 7. Verify draft preview is wired (uses the Viewer token):
#    /api/draft-mode/disable is the always-safe canary — 307 → / when wired,
#    404 if the blog feature flag is off.
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/draft-mode/disable
```

---

## 7. Quick troubleshooting

| Symptom                                                    | Cause                                             | Fix                                                                 |
| ---------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `401 Unauthorized` from the seed script                    | Editor token missing / wrong / revoked            | Re-issue an Editor robot token, paste into `SANITY_API_WRITE_TOKEN` |
| `403 Insufficient permissions` from the seed script        | Token has Viewer role but the seed needs writes   | Re-create with **Editor** role                                      |
| Draft preview returns 503 with `set SANITY_API_READ_TOKEN` | Read token not in env at server start             | Add `SANITY_API_READ_TOKEN`, restart dev                            |
| CORS error in the Studio browser console                   | Missing origin in **Manage → API → CORS Origins** | Add the origin, tick **Allow credentials**, refresh                 |
| Studio loads but everything is empty                       | Token is fine but dataset is empty                | Run `pnpm seed:blog`                                                |
| Tokens vanish from the dashboard after months              | Personal tokens auto-rotate; robot tokens do not  | Re-issue as a **robot token** (Manage UI does this by default)      |

---

## 8. Sources

- [Roles and permissions | Sanity Docs](https://www.sanity.io/docs/content-lake/roles-concepts)
- [Authentication | Sanity Docs](https://www.sanity.io/docs/content-lake/http-auth)
- [Tokens CLI command reference | Sanity Docs](https://www.sanity.io/docs/cli-reference/tokens)
- [Roles | Sanity Docs](https://www.sanity.io/docs/user-guides/roles)
