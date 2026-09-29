# Capacitor Replaces Native — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Delete the React Native / Expo platform everywhere and ship the mobile app as a Capacitor shell that loads the hosted `app` surface — with fewer packages, forks, secrets and scripts than before.

**Architecture:** The Capacitor shell replaces the Expo app in place (`code/projects/mobile/surfaces/main`) and contains no UI: it points `server.url` at the `app` surface, bundles one generated offline page, and ships the committed `android/` + `ios/` projects. The `app` surface gains one client component, `NativeBridge`, that wires back button, deep links, system-browser links, status bar and splash — a no-op in a browser. Native-only backend features (`/v1/geo`, `EVENTS_TOKEN`, surface `mobile`) and every `src/native/` fork are deleted; web-only bricks move from `shared/` to `web/`.

**Tech Stack:** Capacitor 8.5.x (`@capacitor/{core,cli,android,ios}` 8.5.2, `app` 8.1.1, `browser` 8.0.4, `status-bar` 8.0.3, `splash-screen` 8.0.2) · Next.js 16 `app` surface · Cloudflare Worker api (vitest-pool-workers) · Sanity v6 · pnpm 10 + Turborepo · Node 22.

**Spec:** `docs/superpowers/specs/2026-09-29-capacitor-replaces-native-design.md`

## Clarifications vs the spec (decided while planning — all simplifications)

1. **Task order changed.** The shell swap happens right after the backend work (Task 3), because the shell lives in the Expo app's directory, registry row and doc page — swapping in one task keeps `check:doc-coverage` green. Relocations follow.
2. **No root `mobile:*` scripts.** The root `package.json` carries the user's unstaged react-doctor WIP. The shell's scripts live on the shell package and run with `pnpm --filter @indiecrafts/mobile-surfaces-main <script>` — the same way `admin` and `app` run. The only root `package.json` edits (removals + renames) go through the index-only helper in Task 3, Step 1.
3. **Dev URL is always `http://localhost:3002`.** `adb reverse` forwards the emulator's (or a USB device's) ports 3000/3002/8787 to the Mac, so the shell, Clerk's dev instance, the api and the website's legal pages all work on `localhost`. No `10.0.2.2` origin and no `allowedDevOrigins`.
4. **`CAP_SERVER_URL` is required.** No release pipeline exists yet (out of scope), so the shell has no "deployed URL" default; the release spec adds it. The dev scripts set the variable.
5. **Shell identity lives in `shell.json`** (`appId`, `appName`, `scheme`). `capacitor.config.ts`, the offline-page generator and `project-rename` all read or rewrite that one file — the same "literals + rename script" pattern the Expo `app.config.ts` used.
6. **One hex mirror in `ui-tokens`.** `buildHex()` emits the full resolved light + dark palette; the React Native `tokens.ts` and the NativeWind CSS outputs are deleted; `web/email` switches to `./hex`.
7. **Also removed:** the `appContent` Sanity `mobile` welcome section, the `shared/config` `./mobile` export, `deploy/all.mjs --only all`, and the Storybook `Web/` title prefix (single tree).
8. **Kept:** the platform skeleton READMEs under `code/projects/mobile/{shared,tools}/` (every platform has the same skeleton — a repo-wide convention); their Expo wording is corrected in Task 14.

## Global Constraints

- Node ≥ 22, pnpm 10. Capacitor 8.5.x; plugins 8.x. Android builds need **JDK 21**; iOS needs **Xcode 26** (human step — not installed).
- **Never stage** `.claude/settings.json`, `.vscode/tasks.json`, `.claude/hooks/react-doctor-changed.sh`. Edit root `package.json` **only** through `$SCRATCH/root-pkg.mjs` (Task 3, Step 1). Never commit `.env*`.
- **History is not rewritten:** existing `CHANGELOG.md` entries, `code/docs/**/changelog.md` (synced copies — never hand-edit), applied D1 migrations under `code/shared/api/db/**/migrations/`, and older `docs/superpowers/**` plans/specs.
- Every commit message ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- No brand string, URL or app id is hard-coded outside `shell.json` / `@/config`.
- Writing style (`.claude/rules/writing-style.md`) for docs, comments and commits: active voice, ≤ 20-word sentences, exact technical names.
- `$SCRATCH` = `/private/tmp/claude-501/-Users-home-Code-indiecrafts-template/c797f146-4c26-48a9-aa19-364a3b87c4f0/scratchpad`.
- The final gate (Task 14) greps for `expo`, `react-native`, `EXPO_`, `ui-native`, `src/native` and must find zero hits outside the history exclusions above.

## Review Focus

1. **Link routing edge inputs** — relative, same-origin, hash, protocol-relative (`//other.test`), `mailto:`/`tel:`, and malformed hrefs: only a cross-origin `http(s)` URL may open the system browser; everything else stays in the web view. Pinned in Task 4, Step 1.
2. **Deep-link parsing** — `<scheme>://`, `<scheme>://account/`, `<scheme>://legal/privacy?x=1`, and garbage input must map to a safe in-app path (`/` on failure), never throw. Pinned in Task 4, Step 1.
3. **Offline page with unsafe or missing input** — an app name or message containing `<`, `&`, `"` must be HTML-escaped; a device locale with no messages must fall back to English. Pinned in Task 3, Step 3.
4. **Bad `CAP_SERVER_URL`** — unset, empty, not `http(s)`, or with a trailing slash: a clear error, or a normalized origin. Pinned in Task 3, Step 3.
5. **Removed surface and token still sent by old clients** — `POST /v1/events` with the old ingest token must return 401; `GET /v1/announcements?surface=mobile` must return 400. Pinned in Task 1, Step 1 and Task 2, Step 1.

---

### Task 1: API — remove `EVENTS_TOKEN` and `GET /v1/geo`

**Files:**

- Modify: `code/shared/api/src/index.ts` (L29 import, L70-81 header, L87-91 Env, L204-206, L366-410 events gate, L604-606, L1250-1273 geo, L170-172 CORS comment, L285 comment)
- Modify: `code/shared/api/src/index.test.ts:85-168`
- Modify: `code/shared/api/vitest.config.ts:36-38`
- Modify: `code/shared/api/.dev.vars.example:7-8`, `code/shared/api/README.md:4`
- Modify: `code/shared/scripts/data/secrets.test.mjs` (fixture key)
- Modify: `.github/workflows/deploy.yml:89`
- Modify: `code/packages/shared/compliance/src/shared/regions.ts:5`

**Interfaces:**

- Consumes: nothing new.
- Produces: `/v1/events` accepts only `Authorization: Bearer <APP_API_TOKEN>`; `/v1/geo` returns 404 (falls through to the router's not-found).

- [ ] **Step 1: Rewrite the events tests to the single-token contract (failing test first)**

Replace the whole `describe("/v1/events — dual-token: …")` block in `code/shared/api/src/index.test.ts` (L85-168) with:

```ts
describe("/v1/events — trusted server token only", () => {
  const post = (token: string, body: Record<string, unknown>) =>
    new Request("https://api.test/v1/events", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
  const session = { kind: "session", event: "sign_in", surface: "app" };

  it("accepts the trusted APP_API_TOKEN", async () => {
    const res = await SELF.fetch(post(env.APP_API_TOKEN!, session));
    expect(res.status).toBe(201);
  });

  it("rejects the retired ingest token with 401 (not 403)", async () => {
    const res = await SELF.fetch(post("test-events-token", session));
    expect(res.status).toBe(401);
  });

  it("rejects a missing bearer with 401", async () => {
    const res = await SELF.fetch(
      new Request("https://api.test/v1/events", { method: "POST", body: "{}" }),
    );
    expect(res.status).toBe(401);
  });
});

describe("GET /v1/geo — removed", () => {
  it("is no longer routed", async () => {
    const res = await SELF.fetch("https://api.test/v1/geo");
    expect(res.status).toBe(404);
  });
});
```

Keep the file's existing imports; if `SELF`/`env` are imported under other names in the file header, use those names. Delete the old `ingest` const (L90-93) with the block.

- [ ] **Step 2: Run the tests to verify the geo test fails**

Run: `pnpm --filter @indiecrafts/shared-api exec vitest run src/index.test.ts`
Expected: FAIL — `GET /v1/geo — removed` gets 200. (The retired-token test may already pass once the binding is removed in Step 3.)

- [ ] **Step 3: Remove `EVENTS_TOKEN` from the Env, the events gate and the vitest binding**

In `code/shared/api/src/index.ts`:

- Delete the `EVENTS_TOKEN` doc comment + field (L87-91).
- Replace the `requireAdminBearer` doc (L203-206) with: `/** 401 unless the caller holds the trusted server token (\`APP_API_TOKEN\`); null when authorized. */`
- Replace L373-386 (the two-token comment and `bearer … ingest … if (!trusted && !ingest)`) with:

```ts
// Every caller is a first-party server holding APP_API_TOKEN — never a browser.
const unauthorized = requireAdminBearer(request, env, cors);
if (unauthorized) return unauthorized;
```

- Delete L402-406 (the least-privilege comment + the `if (!trusted && body.kind !== "session" …) 403` line).
- Replace the L408-410 country comment with: `// Country: the calling server passes the real user's; else the edge header.`
- Search the block for any remaining `trusted` identifier (`grep -n "trusted" code/shared/api/src/index.ts`); every use means "caller is authorized" and is now always true — delete the condition and keep the guarded code.

In `code/shared/api/vitest.config.ts` delete L36-38 (the comment + `EVENTS_TOKEN: "test-events-token",`).

- [ ] **Step 4: Remove the `/v1/geo` route**

In `code/shared/api/src/index.ts` delete L1250-1273 (comment + `if (url.pathname === "/v1/geo") { … }`). Delete `resolveRegulation` from the L29 import (keep the other names on that line). Keep `PUBLIC_CORS` — `/v1/announcements` still uses it. Edit comments:

- L285: drop `/v1/geo, ` so it reads `(The PUBLIC reads — /v1/announcements — build their own cacheable Response.)`.
- L170-172: replace "Native (RN) sends no Origin" with `// Server-to-server callers send no Origin; browser origins are allowlisted here.`
- L604-606: replace "When native surfaces call the api directly" with `// When a caller omits the country, the edge header is the fallback.`
- L70-81 header: replace "deploy shell for the non-web clients (mobile)" with "shared versioned API for the web surfaces and partners", and delete the sentence "native callers send no `Origin`".

- [ ] **Step 5: Remove the token from config, CI and docs fixtures**

- `code/shared/api/.dev.vars.example`: delete L7-8 (`# EVENTS_TOKEN=""` + its note).
- `code/shared/api/README.md:4`: replace "(`mobile`, partners)" with "(partners)".
- `.github/workflows/deploy.yml`: delete L89 `EVENTS_TOKEN: ${{ secrets.EVENTS_TOKEN }}`.
- `code/shared/scripts/data/secrets.test.mjs`: replace every `EVENTS_TOKEN` with `IP_HASH_SALT` and every `"ci-events"` with `"ci-salt"` (the test only needs _a_ secret key name; `IP_HASH_SALT` is a real api secret).
- `code/packages/shared/compliance/src/shared/regions.ts:5`: replace the sentence mentioning the web/native shells and `GET /v1/geo` with `Each web surface resolves the mode server-side from its own \`cf-ipcountry\` header.`

- [ ] **Step 6: Run the api suite, the scripts tests and tsc**

Run: `pnpm --filter @indiecrafts/shared-api test && pnpm --filter @indiecrafts/shared-api exec tsc --noEmit && pnpm test:scripts`
Expected: PASS everywhere; api count = previous 282 minus the removed dual-token cases plus the 4 new ones.

- [ ] **Step 7: Commit**

```bash
git add code/shared/api code/shared/scripts/data/secrets.test.mjs .github/workflows/deploy.yml code/packages/shared/compliance/src/shared/regions.ts
git commit -m "refactor(api): remove the mobile-only EVENTS_TOKEN and GET /v1/geo

/v1/events accepts only APP_API_TOKEN again — every caller is a
first-party server. /v1/geo existed only for the Expo app.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Surface `mobile` merges into `app`

**Files:**

- Modify: `code/packages/shared/announcement/src/types.ts:3,8`
- Modify: `code/packages/shared/announcement/src/resolve.test.ts:41,47,52,53,116,152`
- Modify: `code/packages/web/announcement/src/sanity/surfaces.ts:18-22,34`
- Modify: `code/projects/web/surfaces/website/src/sanity/app-content.ts:14-15,44,59-64,69`
- Modify: `code/projects/web/surfaces/website/sanity.config.ts:80`
- Modify: `code/projects/web/surfaces/website/scripts/seed-demo.mjs:3215` (+ the `appContent` seed block if it seeds `mobile`)
- Modify: `code/shared/api/src/consent/legal.test.ts:21`, `code/shared/api/src/index.ts:1277,1358,1364`
- Test: `code/shared/api/src/index.test.ts` (new `?surface=mobile` case)
- Create then delete (never committed): `code/projects/web/surfaces/website/scripts/_migrate-mobile-surface.mjs`

**Interfaces:**

- Produces: `SURFACES = ["website", "app"] as const`; `type Surface = "website" | "app"`.

- [ ] **Step 1: Write the failing test for the removed surface**

Append to `code/shared/api/src/index.test.ts`:

```ts
describe("GET /v1/announcements — surface validation", () => {
  it("rejects the removed mobile surface with 400", async () => {
    const res = await SELF.fetch(
      "https://api.test/v1/announcements?surface=mobile&locale=en",
    );
    expect(res.status).toBe(400);
  });
});
```

Run: `pnpm --filter @indiecrafts/shared-api exec vitest run src/index.test.ts -t "surface validation"`
Expected: FAIL (200 — `mobile` is still valid).

- [ ] **Step 2: Drop `mobile` from the surface list**

`code/packages/shared/announcement/src/types.ts`: L8 → `export const SURFACES = ["website", "app"] as const;` and L3 doc → `(website · app)`.

`code/packages/web/announcement/src/sanity/surfaces.ts`: delete L21 (`mobile: "Application mobile",`) and set the L34 description to `"Où afficher cette annonce. Vide = partout (site web et application)."`.

In `code/packages/shared/announcement/src/resolve.test.ts`, replace every `"mobile"` surface value with `"app"` (L41, 47, 52, 53, 116, 152); where a test used `["website","mobile"]` to prove "not app", use `["website"]` so the assertion keeps its meaning.

`code/shared/api/src/consent/legal.test.ts:21`: `surface: "mobile"` → `surface: "app"`.
`code/shared/api/src/index.ts` comments: L1277 `surfaces (app, mobile)` → `surfaces (website, app)`; L1358 and L1364 drop `· mobile` / `+ mobile`.

- [ ] **Step 3: Remove the `mobile` welcome section**

In `code/projects/web/surfaces/website/src/sanity/app-content.ts`: delete `welcomeSection("mobile", "Application mobile"),` (L44) and the `mobile: { welcome: { … } }` block in `initialValue` (L59-64). Rewrite the doc comment (L12-16) to: `Contenu de l'app (singleton) — the editor-owned welcome message shown at the top of the \`app\` home screen (also inside the Capacitor shell). Two sections: \`shared\` and \`web\`. Read live (short-cached), so an edit appears without a redeploy.`Set the preview subtitle (L69) to`"Message de bienvenue — application"`.
`sanity.config.ts:80`: comment → `// The \`appContent\` welcome singleton — read live by the app surface.`
`seed-demo.mjs:3215`: `surfaces: ["website", "app", "mobile"]`→`surfaces: ["website", "app"]`; run `grep -n "mobile" code/projects/web/surfaces/website/scripts/seed-demo.mjs`and delete any`mobile:`key inside the`appContent` seed object.

- [ ] **Step 4: Run the tests**

Run: `pnpm --filter @indiecrafts/packages-shared-announcement test && pnpm --filter @indiecrafts/shared-api test && pnpm tsc:fast`
Expected: PASS.

- [ ] **Step 5: Migrate stored Sanity data (one-off script, never committed)**

Create `code/projects/web/surfaces/website/scripts/_migrate-mobile-surface.mjs`:

```js
// One-off: surface "mobile" → "app" on announcements; drop the appContent mobile section.
import { createClient } from "@sanity/client";

export const mapSurfaces = (list) => [
  ...new Set(list.map((s) => (s === "mobile" ? "app" : s))),
];

if (process.argv[2] !== "--run") {
  // Self-check of the mapping before touching data.
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  if (!eq(mapSurfaces(["mobile"]), ["app"])) throw new Error("mobile-only");
  if (!eq(mapSurfaces(["app", "mobile"]), ["app"])) throw new Error("dedupe");
  if (!eq(mapSurfaces(["website", "mobile"]), ["website", "app"]))
    throw new Error("mixed");
  console.log("✓ mapping ok — rerun with --run to patch");
  process.exit(0);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const docs = await client.fetch(`*["mobile" in surfaces]{ _id, surfaces }`);
for (const d of docs) {
  await client
    .patch(d._id)
    .set({ surfaces: mapSurfaces(d.surfaces) })
    .commit();
  console.log(
    `surfaces ${d._id}: ${d.surfaces.join(",")} → ${mapSurfaces(d.surfaces).join(",")}`,
  );
}
const content = await client.fetch(
  `*[_type == "appContent" && defined(mobile)]._id`,
);
for (const id of content) {
  await client.patch(id).unset(["mobile"]).commit();
  console.log(`appContent ${id}: unset mobile`);
}
console.log(
  `✓ ${docs.length} announcement(s), ${content.length} appContent doc(s) patched`,
);
```

Run from `code/projects/web/surfaces/website`:
`node scripts/_migrate-mobile-surface.mjs` → Expected: `✓ mapping ok`.
Then: `node --env-file=.env.local scripts/_migrate-mobile-surface.mjs --run` → Expected: one line per patched doc, then the `✓` summary.
Then: `rm "code/projects/web/surfaces/website/scripts/_migrate-mobile-surface.mjs"` (run from the repo root; quote the path).

- [ ] **Step 6: Commit**

```bash
git add code/packages/shared/announcement code/packages/web/announcement code/projects/web/surfaces/website/src/sanity/app-content.ts code/projects/web/surfaces/website/sanity.config.ts code/projects/web/surfaces/website/scripts/seed-demo.mjs code/shared/api
git status --porcelain | grep _migrate && echo "STOP: migration script must not be committed"
git commit -m "refactor(announcement): merge the mobile surface into app

The Capacitor shell renders the app surface, so 'mobile' is gone from
SURFACES, the Studio options and appContent. Stored Sanity data was
migrated by a one-off script (mobile → app, de-duplicated).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Replace the Expo app with the Capacitor shell

**Files:**

- Delete: everything under `code/projects/mobile/surfaces/main/` (the Expo app, incl. `app.config.ts`, `eas.json`, `metro.config.js`, `babel.config.js`, `jest.config.js`, `app/`, `components/`, `lib/`, `hooks/`, `config/`, `messages/`, `api/`, `cron/`, `workers/`, `.env.example`). Local-only `.env`, `.env.local`, `.expo/` are removed from disk but were never tracked.
- Delete: `code/shared/scripts/deploy/expo.mjs`, `.github/workflows/deploy-native.yml`, `code/docs/reference/projects/mobile/main/**`
- Create (shell): `code/projects/mobile/surfaces/main/{package.json,shell.json,capacitor.config.ts,tsconfig.json,.gitignore}`, `src/server-url.ts`, `src/server-url.test.ts`, `scripts/offline-page.mjs`, `scripts/offline-page.test.mjs`, `scripts/build-www.mjs`, `messages/en.json`, `messages/fr.json`, `.claude/CLAUDE.md`, `README.md`, `CHANGELOG.md` (keep the existing file; append), generated `android/` + `ios/`
- Create: `$SCRATCH/root-pkg.mjs`
- Modify: `code/shared/scripts/lib/apps.mjs`, `apps.test.mjs`, `code/shared/scripts/deploy/all.mjs`, `code/shared/scripts/checks/secret-leak.mjs` (+ test), `code/shared/scripts/dev/tsc-fast.mjs`, `pnpm-workspace.yaml` (expo excludes), `code/projects/web/surfaces/website/scripts/project-rename.mjs`, `.github/workflows/deploy.yml:26-27`, root `package.json` (via helper)
- Modify: `code/docs/projects/mobile/main/index.md` (rewrite), `code/docs/.vitepress/config.mts:357`
- Create: reference docs for the 5 shell source files under `code/docs/reference/projects/mobile/main/`

**Interfaces:**

- Produces: `resolveServerUrl(env: Record<string, string | undefined>): string` (`src/server-url.ts`); `renderOfflinePage({ appName, messages }: { appName: string; messages: Record<string, { title: string; body: string; retry: string }> }): string` (`scripts/offline-page.mjs`); `shell.json` = `{ appId, appName, scheme }`; shell scripts `www`, `sync`, `android`, `ios`, `test`, `tsc`, `verify`.

- [ ] **Step 1: Create the root `package.json` index-only helper**

Create `$SCRATCH/root-pkg.mjs`:

```js
// Apply one regex edit to root package.json in BOTH the index (from its staged/HEAD
// blob — never the unstaged WIP) and the working copy. Stages only this edit.
// Usage: node root-pkg.mjs '<regex source>' '<flags>' '<replacement>'
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const [src, flags, rep] = process.argv.slice(2);
const re = new RegExp(src, flags);
const edit = (text) => {
  const out = text.replace(re, rep);
  if (out === text) throw new Error(`no match for /${src}/${flags}`);
  JSON.parse(out); // must stay valid JSON
  return out;
};
const staged = execFileSync("git", ["show", ":package.json"], {
  encoding: "utf8",
});
const blob = execFileSync("git", ["hash-object", "-w", "--stdin"], {
  input: edit(staged),
})
  .toString()
  .trim();
execFileSync("git", [
  "update-index",
  "--cacheinfo",
  `100644,${blob},package.json`,
]);
writeFileSync("package.json", edit(readFileSync("package.json", "utf8")));
console.log(
  `✓ root package.json: /${src}/${flags} applied to index + working copy`,
);
```

- [ ] **Step 2: Delete the Expo app and its tooling**

```bash
git rm -r -q code/projects/mobile/surfaces/main code/docs/reference/projects/mobile/main code/shared/scripts/deploy/expo.mjs .github/workflows/deploy-native.yml
rm -rf code/projects/mobile/surfaces/main   # untracked leftovers (.env, .expo, node_modules)
node "$SCRATCH/root-pkg.mjs" '^\s*"deploy:mobile:main:[^\n]*\n' 'gm' ''
```

Then edit:

- `code/shared/scripts/lib/apps.mjs`: header L5 drop "like mobile/desktop" wording → `(which can't see non-Cloudflare apps)`; L12 → `//   capacitor — the Capacitor shell around the app surface (mobile) — NOT deployed by these runners`; L18 comment → `/** The deploy environments every Cloudflare app supports. */`; L25 → `@property {"next-cf"|"worker-cf"|"capacitor"} class`; the mobile row `class: "expo"` → `class: "capacitor"`; replace `deployable` (L127-138) with:

```js
/**
 * Deployable apps in deploy order — the Cloudflare apps. The Capacitor shell has no
 * release pipeline yet (it ships with the App Store spec), so it is never deployed here.
 */
export function deployable() {
  return APPS.filter(isCloudflare).sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}
```

and in the CLI block replace `let list = deployable({ only: "all" }); // registry order` with `let list = [...APPS].sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug));` and the usage comment `--class <next-cf|worker-cf|capacitor>`.

- `code/shared/scripts/lib/apps.test.mjs`: L13 → `new Set(["next-cf", "worker-cf", "capacitor"])`; replace the L61-67 test with:

```js
test("deployable() never includes the Capacitor shell", () => {
  assert.ok(deployable().every((a) => a.class !== "capacitor"));
});
```

and change any other `deployable({ only: "cloudflare" })` call in the file to `deployable()`.

- `code/shared/scripts/deploy/all.mjs`: replace the header (L1-9) with:

```js
// Deploy every Cloudflare app to one env, in registry order, fail-fast. Each app
// self-deploys via its own `deploy:<slug>:<env>` script (read from the registry,
// `scripts/lib/apps.mjs`), so this runner never hardcodes per-app steps.
//
//   node scripts/deploy/all.mjs <dev|staging|prod> [--yes] [--dry-run]
```

delete the `onlyIdx`/`only` parsing (L21-26) and the `--only` validation (L42-45); simplify `passthru` to `args.slice(1).filter((a) => a !== "--dry-run")`; the usage error → `"Usage: deploy/all.mjs <dev|staging|prod> [--yes] [--dry-run]"`; `deployable({ only })` → `deployable()`.

- `code/shared/scripts/checks/secret-leak.mjs`: L28 → `const PUBLIC_PREFIXES = ["NEXT_PUBLIC_", "VITE_"];`; delete the `EXPO_PUBLIC_API_TOKEN` example lines (L12-13) and reword L4-5 + L124 to name only `NEXT_PUBLIC_`/`VITE_`. In `secret-leak.test.mjs` delete `const EXPO = …` (L15) and rewrite the L64-73 allowlist test to use a `NEXT_PUBLIC_` fixture (same assertions, prefix swapped, drop the mobile file names — use `code/projects/web/surfaces/app/src/x.ts`).
- `code/shared/scripts/dev/tsc-fast.mjs`: delete the mobile comment (L18-21) and the `"code/projects/mobile/surfaces/main"` entry (L24); if `TSGO_UNSUPPORTED` becomes empty, delete it and its use.
- `pnpm-workspace.yaml`: in both exclude lists delete the Expo-only entries — `expo`, `expo-*`, `"@expo/*"`, and their `# mobile (expo)` comments (L49-50, L117-118). Leave the `react-native` / `@react-native/*` / Flow / Metro / `fbjs` / `fbemitter` lines for Task 5 (Storybook still pulls `react-native-web` until then).
- `.github/workflows/deploy.yml`: delete the L26-27 comment about the native app workflow.
- `code/projects/web/surfaces/website/scripts/project-rename.mjs`: replace block 4 (L111-128 `nativeFiles`) with:

```js
// 4. The Capacitor shell keeps its identity in its own files (never a wrangler.toml),
// so the infra walk never reaches it: the app id + name + URL scheme in shell.json,
// mirrored into the committed native projects.
const P = TEMPLATE_PREFIX;
const SHELL = "code/projects/mobile/surfaces/main";
const nativeFiles = [
  {
    path: `${SHELL}/shell.json`,
    subs: [
      [new RegExp(`"dev\\.${P}\\.`, "g"), `"dev.${slug}.`],
      [new RegExp(`("(?:appName|scheme)":\\s*)"${P}"`, "g"), `$1"${slug}"`],
    ],
  },
  {
    path: `${SHELL}/android/app/src/main/AndroidManifest.xml`,
    subs: [
      [new RegExp(`android:scheme="${P}"`, "g"), `android:scheme="${slug}"`],
    ],
  },
  {
    path: `${SHELL}/ios/App/App/Info.plist`,
    subs: [
      [new RegExp(`<string>${P}</string>`, "g"), `<string>${slug}</string>`],
    ],
  },
];
```

(the loop below it is unchanged; rename `nativeRenamed` log text if it says "Expo" → "shell").

- [ ] **Step 3: Write the shell's failing tests**

Create `code/projects/mobile/surfaces/main/src/server-url.test.ts`:

```ts
import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveServerUrl } from "./server-url.ts";

test("returns the origin of a valid CAP_SERVER_URL, trailing slash stripped", () => {
  assert.equal(
    resolveServerUrl({ CAP_SERVER_URL: "http://localhost:3002/" }),
    "http://localhost:3002",
  );
  assert.equal(
    resolveServerUrl({ CAP_SERVER_URL: "https://app.example.com" }),
    "https://app.example.com",
  );
});

test("throws a clear error when CAP_SERVER_URL is unset or empty", () => {
  assert.throws(() => resolveServerUrl({}), /CAP_SERVER_URL/);
  assert.throws(
    () => resolveServerUrl({ CAP_SERVER_URL: "" }),
    /CAP_SERVER_URL/,
  );
});

test("rejects a non-http(s) or malformed URL", () => {
  assert.throws(
    () => resolveServerUrl({ CAP_SERVER_URL: "ftp://x.test" }),
    /http/,
  );
  assert.throws(
    () => resolveServerUrl({ CAP_SERVER_URL: "not a url" }),
    /CAP_SERVER_URL/,
  );
});
```

Create `code/projects/mobile/surfaces/main/scripts/offline-page.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { renderOfflinePage } from "./offline-page.mjs";

const messages = {
  en: {
    title: "You're offline",
    body: "Check your connection.",
    retry: "Try again",
  },
  fr: {
    title: "Vous êtes hors ligne",
    body: "Vérifiez votre connexion.",
    retry: "Réessayer",
  },
};

test("embeds every locale and the app name", () => {
  const html = renderOfflinePage({ appName: "Acme", messages });
  assert.match(html, /<title>Acme<\/title>/);
  assert.match(html, /Try again/);
  assert.match(html, /Réessayer/);
});

test("escapes HTML in the app name and messages", () => {
  const html = renderOfflinePage({
    appName: `A<b>&"`,
    messages: { en: { title: "<script>x</script>", body: "&", retry: `"` } },
  });
  assert.doesNotMatch(html, /<script>x<\/script>/);
  assert.match(html, /A&lt;b&gt;&amp;&quot;/);
});

test("falls back to English for an unknown device locale", () => {
  const html = renderOfflinePage({ appName: "Acme", messages });
  assert.match(html, /MESSAGES\[lang\] \?\? MESSAGES\.en/);
});
```

Run: `cd code/projects/mobile/surfaces/main && node --experimental-strip-types --test src/*.test.ts scripts/*.test.mjs`
Expected: FAIL — modules not found.

- [ ] **Step 4: Implement the shell**

`code/projects/mobile/surfaces/main/shell.json`:

```json
{
  "appId": "dev.indiecrafts.app",
  "appName": "indiecrafts",
  "scheme": "indiecrafts"
}
```

`src/server-url.ts`:

```ts
/**
 * Resolve the URL the Capacitor shell loads.
 *
 * @see docs/reference/projects/mobile/main/src/server-url.md
 */

/**
 * The hosted `app` surface origin the shell loads, from `CAP_SERVER_URL`. Required —
 * the dev scripts set it (`http://localhost:3002`, via `adb reverse` on Android); a
 * release build sets the deployed app URL. Returns the origin (no trailing slash).
 */
export function resolveServerUrl(
  env: Record<string, string | undefined>,
): string {
  const raw = env.CAP_SERVER_URL?.trim();
  if (!raw)
    throw new Error("CAP_SERVER_URL is required (e.g. http://localhost:3002)");
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`CAP_SERVER_URL is not a valid URL: ${raw}`);
  }
  if (url.protocol !== "http:" && url.protocol !== "https:")
    throw new Error(`CAP_SERVER_URL must be http(s): ${raw}`);
  return url.origin;
}
```

`capacitor.config.ts`:

```ts
/**
 * Configure the Capacitor shell around the hosted app surface.
 *
 * @see docs/reference/projects/mobile/main/capacitor.config.md
 */
import type { CapacitorConfig } from "@capacitor/cli";
import shell from "./shell.json";
import { resolveServerUrl } from "./src/server-url";

const url = resolveServerUrl(process.env);

const config: CapacitorConfig = {
  appId: shell.appId,
  appName: shell.appName,
  webDir: "www",
  server: {
    url,
    // Plain HTTP only for local dev (localhost via adb reverse).
    cleartext: url.startsWith("http://"),
    errorPath: "offline.html",
  },
  plugins: {
    SplashScreen: { launchAutoHide: false },
  },
};

export default config;
```

`scripts/offline-page.mjs`:

```js
/**
 * Render the shell's bundled offline page.
 *
 * @see docs/reference/projects/mobile/main/scripts/offline-page.md
 */

const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );

/** The page Capacitor shows when the app surface cannot load (`server.errorPath`).
 *  Every locale ships inline; the device language picks one, English as fallback. */
export function renderOfflinePage({ appName, messages }) {
  const safe = Object.fromEntries(
    Object.entries(messages).map(([k, m]) => [
      k,
      { title: esc(m.title), body: esc(m.body), retry: esc(m.retry) },
    ]),
  );
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(appName)}</title>
<style>
:root{color-scheme:light dark;--bg:#fff;--fg:#0a0a0a;--muted:#696969}
@media (prefers-color-scheme:dark){:root{--bg:#0a0a0a;--fg:#fafafa;--muted:#a1a1a1}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:16px system-ui,sans-serif;padding:24px;box-sizing:border-box;text-align:center}
p{color:var(--muted)}button{font:inherit;padding:12px 20px;border-radius:10px;border:1px solid currentColor;background:none;color:inherit}
</style></head>
<body><main><h1 id="t"></h1><p id="b"></p><button id="r" type="button"></button></main>
<script>
const MESSAGES = ${JSON.stringify(safe)};
const lang = (navigator.language || "en").slice(0, 2);
const m = MESSAGES[lang] ?? MESSAGES.en;
document.documentElement.lang = MESSAGES[lang] ? lang : "en";
document.getElementById("t").innerHTML = m.title;
document.getElementById("b").innerHTML = m.body;
const r = document.getElementById("r");
r.innerHTML = m.retry;
r.onclick = () => location.reload();
</script></body></html>
`;
}
```

(The colors are the neutral page defaults of an error screen shown with no app loaded — they are not brand tokens; the brand lives in the app surface.)

`scripts/build-www.mjs`:

```js
/**
 * Generate the shell's www/ (the bundled offline page) from shell.json + messages.
 *
 * @see docs/reference/projects/mobile/main/scripts/build-www.md
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { renderOfflinePage } from "./offline-page.mjs";

const read = (p) =>
  JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const shell = read("../shell.json");
const messages = {
  en: read("../messages/en.json").offline,
  fr: read("../messages/fr.json").offline,
};

mkdirSync(new URL("../www/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../www/offline.html", import.meta.url),
  renderOfflinePage({ appName: shell.appName, messages }),
);
writeFileSync(
  new URL("../www/index.html", import.meta.url),
  renderOfflinePage({ appName: shell.appName, messages }),
);
console.log("✓ www/ generated (offline.html + index.html)");
```

(`index.html` exists because Capacitor requires `webDir` to hold one; with `server.url` set it is never shown.)

`messages/en.json`:

```json
{
  "offline": {
    "title": "You're offline",
    "body": "Check your connection, then try again.",
    "retry": "Try again"
  }
}
```

`messages/fr.json`:

```json
{
  "offline": {
    "title": "Vous êtes hors ligne",
    "body": "Vérifiez votre connexion, puis réessayez.",
    "retry": "Réessayer"
  }
}
```

`package.json`:

```json
{
  "name": "@indiecrafts/mobile-surfaces-main",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "www": "node scripts/build-www.mjs",
    "sync": "pnpm www && cap sync",
    "android": "pnpm www && adb reverse tcp:3000 tcp:3000 && adb reverse tcp:3002 tcp:3002 && adb reverse tcp:8787 tcp:8787 && CAP_SERVER_URL=http://localhost:3002 cap run android --target ${ANDROID_TARGET:-emulator-5554}",
    "ios": "pnpm www && CAP_SERVER_URL=http://localhost:3002 cap run ios",
    "test": "node --experimental-strip-types --test src/*.test.ts scripts/*.test.mjs",
    "tsc": "tsc --noEmit",
    "verify": "pnpm tsc && pnpm test"
  },
  "dependencies": {
    "@capacitor/android": "^8.5.2",
    "@capacitor/app": "^8.1.1",
    "@capacitor/browser": "^8.0.4",
    "@capacitor/core": "^8.5.2",
    "@capacitor/ios": "^8.5.2",
    "@capacitor/splash-screen": "^8.0.2",
    "@capacitor/status-bar": "^8.0.3"
  },
  "devDependencies": {
    "@capacitor/cli": "^8.5.2",
    "@types/node": "^22",
    "typescript": "^5"
  }
}
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["capacitor.config.ts", "src/**/*.ts"]
}
```

`.gitignore`:

```
www/
node_modules/
```

- [ ] **Step 5: Install, run the shell tests, generate the native projects**

```bash
pnpm install
pnpm --filter @indiecrafts/mobile-surfaces-main test     # Expected: PASS (6 tests)
pnpm --filter @indiecrafts/mobile-surfaces-main tsc      # Expected: no output
cd code/projects/mobile/surfaces/main
pnpm www
CAP_SERVER_URL=http://localhost:3002 npx cap add android
CAP_SERVER_URL=http://localhost:3002 npx cap add ios
```

If `cap add ios` fails because Xcode is missing: stop, report it, and continue without `ios/` — never hand-write the iOS project. It becomes a human step in Task 12.

- [ ] **Step 6: Register the custom URL scheme**

In `android/app/src/main/AndroidManifest.xml`, inside the main `<activity>`, add:

```xml
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="indiecrafts" />
</intent-filter>
```

In `ios/App/App/Info.plist` (if generated), inside the top-level `<dict>`, add:

```xml
<key>CFBundleURLTypes</key>
<array><dict><key>CFBundleURLSchemes</key><array><string>indiecrafts</string></array></dict></array>
```

(`project-rename` from Step 2 rewrites both with `shell.json`.)

- [ ] **Step 7: Brief, README, docs page, reference docs, sidebar**

`code/projects/mobile/surfaces/main/.claude/CLAUDE.md`:

```markdown
# @indiecrafts/mobile-surfaces-main — the Capacitor shell

Auto-loads under `code/projects/mobile/surfaces/main/**`. A Capacitor 8 shell around the hosted
`app` surface — **no UI of its own**. `server.url` loads the app; every screen, string and
flow lives in `code/projects/web/surfaces/app`. The app's `NativeBridge` wires the plugins.

**Platform class:** `capacitor` (registry row in `code/shared/scripts/lib/apps.mjs`; not deployed
by the Cloudflare runners — the release pipeline comes with the App Store spec).

- **Identity:** `shell.json` (`appId` · `appName` · `scheme`) — the one home; `project-rename` rewrites it + the native projects.
- **Server URL:** `src/server-url.ts` → `CAP_SERVER_URL` (required). Dev = `http://localhost:3002`.
- **Offline:** `scripts/build-www.mjs` renders `www/offline.html` from `messages/*.json` (`server.errorPath`).
- **Run:** start the app surface + api (`pnpm dev` + `pnpm --filter @indiecrafts/web-surfaces-app dev`), boot the `qa` emulator, then `pnpm --filter @indiecrafts/mobile-surfaces-main android` (JDK 21). iOS: `… ios` (Xcode 26).
- **Native projects:** `android/` + `ios/` are committed; `www/` is generated (git-ignored).

Full guide → [`code/docs/projects/mobile/main/index.md`](../../../../docs/projects/mobile/main/index.md).
```

`README.md`: two lines — what it is + the run command above.

Rewrite `code/docs/projects/mobile/main/index.md` with frontmatter `title: "Mobile shell (Capacitor)"`, `status: stable`, and sections: **What it is** (the brief's first paragraph) · **Prerequisites** (Node 22, JDK 21 — `brew install --cask zulu@21` then `export JAVA_HOME=$(/usr/libexec/java_home -v 21)`; Android SDK + an AVD; Xcode 26 for iOS) · **Run on Android** (the numbered steps: `pnpm dev`; `pnpm --filter @indiecrafts/web-surfaces-app dev`; `emulator @qa`; `pnpm --filter @indiecrafts/mobile-surfaces-main android` — and why `adb reverse` makes `localhost` work) · **Run on iOS** · **Physical device** (USB + the same `adb reverse`; `ANDROID_TARGET=<serial>`) · **Configuration** (`shell.json`, `CAP_SERVER_URL`, offline page) · **Limits** (needs a network; sign-in is password + email code; App Store release needs one native feature — see the later spec).
`code/docs/.vitepress/config.mts:357`: `{ text: "Mobile (Expo)", … }` → `{ text: "Mobile shell (Capacitor)", link: "/projects/mobile/main/" }`.
Create one reference page per shell source file, in the repo's reference format (frontmatter `title`/`description`/`status: stable`, then `## Purpose`, `## Exports`, `## Source`): `capacitor.config.md`, `src/server-url.md`, `scripts/offline-page.md`, `scripts/build-www.md` under `code/docs/reference/projects/mobile/main/`.

- [ ] **Step 8: Verify**

Run: `pnpm check:doc-coverage && pnpm test:scripts && pnpm tsc:fast && pnpm --filter @indiecrafts/mobile-surfaces-main verify`
Expected: all green; doc-coverage reports every source file documented.

- [ ] **Step 9: Commit**

```bash
git add -A code/projects/mobile code/shared/scripts code/docs/projects/mobile code/docs/reference/projects/mobile code/docs/.vitepress/config.mts .github pnpm-workspace.yaml pnpm-lock.yaml code/projects/web/surfaces/website/scripts/project-rename.mjs
git status --porcelain | grep -E '^(A|M) +(\.claude/settings|\.vscode/tasks|\.claude/hooks/react-doctor)' && echo "STOP: WIP staged"
git diff --cached --stat package.json   # expect only the 3 deploy:mobile lines removed
git commit -m "feat(mobile): replace the Expo app with a Capacitor shell

The mobile project is now a Capacitor 8 shell that loads the hosted app
surface (CAP_SERVER_URL), with a generated offline page and committed
android/ios projects. Removes EAS, the native deploy workflow, the Expo
deploy runner, --only all, and the EXPO_PUBLIC_ secret-leak rules.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: `NativeBridge` in the `app` surface

**Files:**

- Create: `code/projects/web/surfaces/app/src/lib/shell-links.ts`, `src/lib/shell-links.test.ts`
- Create: `code/projects/web/surfaces/app/src/user-interface/shell/NativeBridge.tsx`
- Modify: `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx` (mount), `code/projects/web/surfaces/app/package.json` (deps)
- Create: `code/docs/reference/projects/web/app/src/lib/shell-links.md`, `code/docs/reference/projects/web/app/src/user-interface/shell/NativeBridge.md`

**Interfaces:**

- Produces: `isExternalUrl(href: string, appOrigin: string): boolean`; `deepLinkPath(url: string): string`; `<NativeBridge />` (renders `null`).

- [ ] **Step 1: Write the failing tests**

`code/projects/web/surfaces/app/src/lib/shell-links.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { deepLinkPath, isExternalUrl } from "./shell-links";

const APP = "https://app.example.com";

describe("isExternalUrl", () => {
  it("is true only for a cross-origin http(s) URL", () => {
    expect(isExternalUrl("https://example.com/privacy-policy", APP)).toBe(true);
    expect(isExternalUrl("http://other.test/x", APP)).toBe(true);
    expect(isExternalUrl("//other.test/x", APP)).toBe(true);
  });
  it("keeps relative, same-origin and hash links in the web view", () => {
    expect(isExternalUrl("/account", APP)).toBe(false);
    expect(isExternalUrl("account?tab=data", APP)).toBe(false);
    expect(isExternalUrl(`${APP}/legal`, APP)).toBe(false);
    expect(isExternalUrl("#main", APP)).toBe(false);
  });
  it("leaves non-http schemes and malformed hrefs alone", () => {
    expect(isExternalUrl("mailto:hi@example.com", APP)).toBe(false);
    expect(isExternalUrl("tel:+33100000000", APP)).toBe(false);
    expect(isExternalUrl("javascript:void(0)", APP)).toBe(false);
    expect(isExternalUrl("http://[bad", APP)).toBe(false);
  });
});

describe("deepLinkPath", () => {
  it("maps host + path + query to an in-app path", () => {
    expect(deepLinkPath("indiecrafts://account?tab=data")).toBe(
      "/account?tab=data",
    );
    expect(deepLinkPath("indiecrafts://legal/privacy")).toBe("/legal/privacy");
    expect(deepLinkPath("indiecrafts://account/")).toBe("/account");
  });
  it("falls back to the root for an empty or malformed link", () => {
    expect(deepLinkPath("indiecrafts://")).toBe("/");
    expect(deepLinkPath("not a url")).toBe("/");
  });
});
```

Run: `pnpm --filter @indiecrafts/web-surfaces-app exec vitest run src/lib/shell-links.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 2: Implement the helpers**

`code/projects/web/surfaces/app/src/lib/shell-links.ts`:

```ts
/**
 * Decide how the Capacitor shell routes links and deep links.
 *
 * @see docs/reference/projects/web/app/src/lib/shell-links.md
 */

/** True when `href` leaves the app: an absolute http(s) URL on another origin. Relative,
 *  same-origin, hash, `mailto:`/`tel:` and malformed hrefs stay in the web view. */
export function isExternalUrl(href: string, appOrigin: string): boolean {
  let url: URL;
  try {
    url = new URL(href, appOrigin);
  } catch {
    return false;
  }
  return (
    (url.protocol === "https:" || url.protocol === "http:") &&
    url.origin !== appOrigin
  );
}

/** The in-app path for a custom-scheme deep link: `<scheme>://account?tab=data` →
 *  `/account?tab=data`. Returns `/` for an empty or malformed link. */
export function deepLinkPath(url: string): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return "/";
  }
  const path = `/${u.host}${u.pathname}`
    .replace(/\/{2,}/g, "/")
    .replace(/(.)\/$/, "$1");
  return `${path}${u.search}`;
}
```

Run: `pnpm --filter @indiecrafts/web-surfaces-app exec vitest run src/lib/shell-links.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 3: Add the Capacitor client packages to the app**

```bash
pnpm --filter @indiecrafts/web-surfaces-app add @capacitor/core@^8.5.2 @capacitor/app@^8.1.1 @capacitor/browser@^8.0.4 @capacitor/status-bar@^8.0.3 @capacitor/splash-screen@^8.0.2
```

- [ ] **Step 4: Implement `NativeBridge` and mount it**

`code/projects/web/surfaces/app/src/user-interface/shell/NativeBridge.tsx`:

```tsx
"use client";

/**
 * Wire the Capacitor shell's native events into the app — a no-op in a browser.
 *
 * @see docs/reference/projects/web/app/src/user-interface/shell/NativeBridge.md
 */
import { useEffect } from "react";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { deepLinkPath, isExternalUrl } from "@/lib/shell-links";

/** Inside the Capacitor shell: Android back → history (exit at the root), deep links →
 *  the matching route, cross-origin links (legal pages, external sites) → the system
 *  browser, then the status bar is set and the splash screen hidden. */
export function NativeBridge() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const href = event.target.closest("a[href]")?.getAttribute("href");
      if (!href || !isExternalUrl(href, window.location.origin)) return;
      event.preventDefault();
      void Browser.open({ url: new URL(href, window.location.href).href });
    };
    document.addEventListener("click", onClick, true);

    const back = App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
      else void App.exitApp();
    });
    const open = App.addListener("appUrlOpen", ({ url }) => {
      window.location.assign(deepLinkPath(url));
    });

    void StatusBar.setStyle({ style: Style.Default });
    void SplashScreen.hide();

    return () => {
      document.removeEventListener("click", onClick, true);
      void back.then((h) => h.remove());
      void open.then((h) => h.remove());
    };
  }, []);

  return null;
}
```

In `code/projects/web/surfaces/app/src/app/[locale]/layout.tsx`: add `import { NativeBridge } from "@/user-interface/shell/NativeBridge";` and render `<NativeBridge />` as the first child inside `<NextIntlClientProvider>` (before `<OfflineBanner … />`).

Create the two reference pages (frontmatter + `## Purpose` + `## Exports` + `## Source`, same format as Task 3, Step 7).

- [ ] **Step 5: Verify**

Run: `pnpm --filter @indiecrafts/web-surfaces-app test && pnpm tsc:fast && pnpm check:doc-coverage && npx oxlint code/projects/web/surfaces/app/src`
Expected: all green.

- [ ] **Step 6: Commit**

```bash
git add code/projects/web/surfaces/app code/docs/reference/projects/web/app pnpm-lock.yaml
git commit -m "feat(app): NativeBridge wires the Capacitor shell's native events

Back button, deep links, system-browser links, status bar and splash —
a no-op in a browser. Link routing and deep-link parsing are pure,
tested helpers (shell-links.ts).

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Delete every native fork, `ui-native`, and the Storybook native root

**Files:**

- Delete: `code/packages/mobile/` (whole scope), `code/packages/shared/compliance/src/native/`, `code/packages/shared/system-pages/src/native/`, `code/packages/shared/ui-icons/src/native/`, `code/packages/web/ui/src/native/`, `code/packages/web/ui-components/src/native/`, `code/packages/shared/config/src/mobile/`
- Delete: `code/docs/packages/mobile/ui-native.md`, `code/docs/reference/packages/mobile/`, `code/docs/reference/packages/shared/{compliance,system-pages,ui-icons}/src/native/`, `code/docs/reference/packages/shared/config/src/mobile/`
- Delete: `code/projects/web/tools/storybook/stories/Tokens-Native.mdx`
- Modify: `package.json` + exports/peers of `compliance`, `system-pages`, `ui-icons`, `config`
- Modify: Storybook `.storybook/main.ts`, `.storybook/preview.tsx`, `stories/_swatch.tsx`, `stories/Introduction.mdx`, `package.json`, `vitest.config.ts:12`
- Modify: every story file whose `title` starts with `Web/` (111 files)
- Modify: `pnpm-workspace.yaml` (RN excludes), `code/docs/.vitepress/config.mts:526-532`

**Interfaces:**

- Produces: package export maps without `./native`/`./mobile`; Storybook titles without the `Web/` root.

- [ ] **Step 1: Delete the forks and the scope**

```bash
git rm -r -q code/packages/mobile code/packages/shared/compliance/src/native code/packages/shared/system-pages/src/native code/packages/shared/ui-icons/src/native code/packages/web/ui/src/native code/packages/web/ui-components/src/native code/packages/shared/config/src/mobile code/docs/packages/mobile code/docs/reference/packages/mobile code/docs/reference/packages/shared/compliance/src/native code/docs/reference/packages/shared/system-pages/src/native code/docs/reference/packages/shared/ui-icons/src/native code/docs/reference/packages/shared/config/src/mobile code/projects/web/tools/storybook/stories/Tokens-Native.mdx
```

- [ ] **Step 2: Clean the export maps and peers**

- `code/packages/shared/compliance/package.json`: delete exports `./native`, `./native/*`; dependency `@indiecrafts/packages-mobile-ui-native`; peers `react-native`, `@react-native-async-storage/async-storage` and their `peerDependenciesMeta` entries (delete `peerDependenciesMeta` if it becomes empty).
- `code/packages/shared/system-pages/package.json`: delete exports `./native`, `./native/*`; peer `react-native` + its meta.
- `code/packages/shared/ui-icons/package.json`: delete exports `./native`, `./native/*`; peers `lucide-react-native`, `react-native-svg` + their meta.
- `code/packages/shared/config/package.json`: delete export `./mobile` (L10).
- `code/docs/.vitepress/config.mts`: delete the `Mobile` group (L526-532) and change the L50 comment to `packages/{shared,web}/`.

- [ ] **Step 3: Strip the Storybook native plumbing**

`.storybook/main.ts`: delete the `reactNativeWeb` const (L37-40) and its comment; delete `brickStories("@indiecrafts/packages-mobile-ui-native")` and the "Native + cross-platform bricks" comment (L61-65) — keep the `system-pages`, `ui-icons`, `compliance` globs with the comment `// Cross-surface web bricks.`; delete the `optimizeDeps.include "react-native-web"` lines (L84-88) and the `/^react-native$/` alias entry with its comment (L103-106); fix the L2 doc to drop "react-native".
`.storybook/preview.tsx`: delete the `react-native` import block (L8-11) and the `ThemeProvider` import (L12); delete the native theme decorator (L53-66); set the doc line to `Configure the gallery Storybook preview: a theme toolbar keyed on data-theme.`; replace `storySort.order` with:

```ts
        order: [
          "Introduction",
          "Design Tokens",
          ["Colors", "Typography & Radius", "Sidebar & Charts"],
          "Adaptive & container queries",
          "UI Components",
          "Chrome",
          "Compliance",
          "System Pages",
          "Icons",
          "UI",
          "*",
        ],
```

and its comment to `// Sidebar IA: docs + tokens first, then domain components, UI atoms last.`
`stories/_swatch.tsx`: delete `HexSwatch` and `NativePalette` (L27-67).
`stories/Introduction.mdx`: delete the Native-tokens and `ui-native` lines (L8-9, L15, L21-22) and change "forked **web + native**" (L24) to "web".
`package.json`: delete `"@indiecrafts/packages-mobile-ui-native"` (L19) and `"react-native-web"` (L45). `vitest.config.ts:12`: comment → `(web bricks)`.

- [ ] **Step 4: Drop the `Web/` title root from every story**

```bash
git ls-files 'code/**/*.stories.tsx' 'code/**/*.mdx' | xargs grep -lE '(title: |title=)"Web/' | while IFS= read -r f; do
  node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f,fs.readFileSync(f,"utf8").replace(/((?:title: |title=)")Web\//g,"$1"))' "$f"
done
git grep -nE '(title: |title=)"(Web|Native)/' -- 'code/**/*.stories.tsx' 'code/**/*.mdx' && echo "STOP: prefix left" || echo "✓ no Web/ or Native/ roots left"
```

- [ ] **Step 5: Drop the React Native workspace excludes, reinstall**

`pnpm-workspace.yaml`: delete the remaining mobile block entries in both lists — `react-native`, `@react-native/*`, `@react-native-community/*`, `flow-parser`, `flow-*`, `jscodeshift`, `metro`, `metro-*`, `fbjs`, `fbemitter` and their mobile comments (L49-59, L113-123) — and change L10 to `(scope = shared · web)`. Then `pnpm install`.

- [ ] **Step 6: Verify**

```bash
pnpm tsc:fast && pnpm test && pnpm --filter @indiecrafts/web-tools-storybook build-storybook --quiet && pnpm check:doc-coverage && pnpm tokens:check
git grep -nE 'react-native|ui-native|packages-mobile|src/native' -- code ':!**/CHANGELOG.md' ':!code/docs/**/changelog.md' ':!code/packages/shared/ui-tokens/**' ':!code/packages/web/email/**' ':!code/docs/reference/packages/shared/ui-tokens/**'
```

Expected: all green; the grep prints nothing. (The `ui-tokens` native output and its email consumer go in Task 6; stale wording in briefs and docs goes in Task 14 — if the grep hits only brief/doc prose, note it for Task 14 and continue.)

- [ ] **Step 7: Commit**

```bash
git add -A code pnpm-workspace.yaml pnpm-lock.yaml
git commit -m "refactor(packages): delete every native fork and the ui-native brick

compliance, system-pages, ui-icons and config lose their ./native and
./mobile exports; the mobile/ scope and the web placeholders are gone.
Storybook drops react-native-web, the Native root and the Web/ title
prefix — one sidebar tree.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: `ui-tokens` — one hex mirror

**Files:**

- Modify: `code/packages/shared/ui-tokens/scripts/build-tokens.mjs` (L6-12 header, L236-356)
- Modify: `code/packages/shared/ui-tokens/package.json` (exports `./native`, `./nativewind.css`)
- Delete: `code/packages/shared/ui-tokens/src/native/`, `src/generated/nativewind.css`, `code/docs/reference/packages/shared/ui-tokens/src/native/`
- Modify: `code/packages/web/email/src/theme.ts`
- Test: `code/packages/shared/ui-tokens/src/tokens.test.ts` (append)
- Regenerate: `code/packages/shared/ui-tokens/src/generated/hex.ts`

**Interfaces:**

- Produces: `hexColors.light` and `hexColors.dark` — every semantic + component color name → hex (superset of the old 3 keys).

- [ ] **Step 1: Write the failing test**

Append to `code/packages/shared/ui-tokens/src/tokens.test.ts`:

```ts
import { hexColors } from "./generated/hex";

describe("hex mirror", () => {
  it("carries the full palette email needs, in both themes", () => {
    for (const theme of ["light", "dark"] as const)
      for (const key of [
        "background",
        "foreground",
        "brand",
        "brand-foreground",
        "muted",
        "muted-foreground",
        "border",
        "destructive",
      ])
        expect(
          hexColors[theme][key as keyof (typeof hexColors)["light"]],
        ).toMatch(/^#[0-9a-f]{6}$/);
  });
});
```

(Keep the file's existing `describe`/`expect` import; add `it` to it if missing.)
Run: `pnpm --filter @indiecrafts/packages-shared-ui-tokens test`
Expected: FAIL — `brand-foreground` is undefined.

- [ ] **Step 2: Emit the full palette, delete the native outputs**

In `build-tokens.mjs`: delete `buildNative()` and `buildNativeWind()`; replace `buildHex()` with:

```js
function buildHex() {
  const block = (o) =>
    Object.entries(o)
      .map(([k, v]) => `    "${k}": "${v}",`)
      .join("\n");
  return `// GENERATED by scripts/build-tokens.mjs — DO NOT EDIT.
// Resolved hex mirror of every color token — for places that cannot read oklch()
// or CSS variables: the PWA manifest and email templates.
export const hexColors = {
  light: {
${block(themeColors("light"))}
  },
  dark: {
${block(themeColors("dark"))}
  },
} as const;
`;
}
```

Remove the two deleted builders from `outputs` (keep `tokens.css` + `hex.ts`), delete `mkdirSync(here("../src/native"), …)`, rename the section banner `// ── native + hex ──` → `// ── hex ──`, and cut the header's output list to the two remaining files.
In `package.json` exports delete `"./native"` and `"./nativewind.css"`.

```bash
git rm -r -q code/packages/shared/ui-tokens/src/native code/packages/shared/ui-tokens/src/generated/nativewind.css code/docs/reference/packages/shared/ui-tokens/src/native
pnpm tokens:build
```

- [ ] **Step 3: Point email at `./hex`**

`code/packages/web/email/src/theme.ts`: import → `import { hexColors } from "@indiecrafts/packages-shared-ui-tokens/hex";`, `const c = tokens.light.color;` → `const c = hexColors.light;`, and the doc sentence → "`pnpm tokens:build` emits a resolved hex mirror (`@indiecrafts/packages-shared-ui-tokens/hex`); inlining it is the only way an email can track the design system — the same bridge the PWA manifest uses."

- [ ] **Step 4: Verify**

Run: `pnpm --filter @indiecrafts/packages-shared-ui-tokens test && pnpm tokens:check && pnpm --filter @indiecrafts/packages-web-email test && pnpm tsc:fast`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add code/packages/shared/ui-tokens code/packages/web/email code/docs/reference/packages/shared/ui-tokens
git commit -m "refactor(ui-tokens): one hex mirror instead of three outputs

hex.ts now carries every resolved color; email reads it. The React
Native tokens.ts and NativeWind CSS outputs are deleted.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Brick-move codemod (throwaway tool)

**Files:**

- Create: `$SCRATCH/move-brick.mjs` (never committed)

**Interfaces:**

- Produces: `node $SCRATCH/move-brick.mjs <name>` — moves `code/packages/shared/<name>` → `code/packages/web/<name>`, its docs + reference docs, and rewrites every tracked reference; prints the files changed.

- [ ] **Step 1: Write the codemod**

```js
// Move a brick shared/<name> → web/<name>: git mv code + docs, then rewrite every
// tracked text reference. History (changelogs, applied migrations, older superpowers
// docs) and the user's WIP files are never touched. Usage: node move-brick.mjs <name>
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const name = process.argv[2];
if (!name) throw new Error("usage: move-brick.mjs <name>");
const git = (...a) => execFileSync("git", a, { encoding: "utf8" });

const moves = [
  [`code/packages/shared/${name}`, `code/packages/web/${name}`],
  [`code/docs/packages/shared/${name}.md`, `code/docs/packages/web/${name}.md`],
  [
    `code/docs/reference/packages/shared/${name}`,
    `code/docs/reference/packages/web/${name}`,
  ],
];
for (const [from, to] of moves) if (existsSync(from)) git("mv", from, to);

const SKIP = [
  /(^|\/)CHANGELOG\.md$/,
  /^code\/docs\/.*changelog\.md$/,
  /\/db\/.*\/migrations\//,
  /^docs\/superpowers\/(?!plans\/2026-09-29|specs\/2026-09-29)/,
  /^pnpm-lock\.yaml$/,
  /^\.claude\/settings\.json$/,
  /^\.vscode\/tasks\.json$/,
  /^package\.json$/,
];
const TEXT = /\.(ts|tsx|mts|mjs|cjs|js|json|jsonc|md|mdx|css|yml|yaml|toml)$/;
const subs = [
  [
    new RegExp(`@indiecrafts/packages-shared-${name}\\b`, "g"),
    `@indiecrafts/packages-web-${name}`,
  ],
  [new RegExp(`packages/shared/${name}\\b`, "g"), `packages/web/${name}`],
  [
    new RegExp(`/packages/shared/${name}(?=["')#\\s])`, "g"),
    `/packages/web/${name}`,
  ],
];
const changed = [];
for (const file of git("ls-files").split("\n").filter(Boolean)) {
  if (!TEXT.test(file) || SKIP.some((re) => re.test(file)) || !existsSync(file))
    continue;
  const src = readFileSync(file, "utf8");
  let out = src;
  for (const [re, rep] of subs) out = out.replace(re, rep);
  if (out !== src) {
    writeFileSync(file, out);
    changed.push(file);
  }
}
console.log(
  `✓ moved ${name}; ${changed.length} file(s) rewritten:\n  ${changed.join("\n  ")}`,
);
console.log(
  "Root package.json is SKIPPED — edit it with root-pkg.mjs if it names this brick.",
);
```

- [ ] **Step 2: Dry-check it on nothing**

Run: `node "$SCRATCH/move-brick.mjs"` → Expected: `usage: move-brick.mjs <name>` error. (No commit — the tool stays in the scratchpad.)

---

### Task 8: Merge `shared/version` into `web/version`

**Files:**

- Move: `code/packages/shared/version/src/index.ts` → `code/packages/web/version/src/version.ts`; `src/version.test.ts` → `code/packages/web/version/src/version.test.ts`
- Delete: `code/packages/shared/version/`, `code/docs/packages/shared/version.md`, `code/docs/reference/packages/shared/version/`
- Modify: `code/packages/web/version/{package.json,src/use-version-check.ts,.claude/CLAUDE.md}`, `code/projects/web/surfaces/{app,website}/next.config.ts`, `code/projects/web/surfaces/app/package.json`, `code/packages/_registry.md:42`, `code/docs/.vitepress/config.mts:498`, `code/docs/packages/web/version.md`, `code/docs/shared/architecture/{cross-platform-shell,multi-app}.md`

**Interfaces:**

- Produces: `@indiecrafts/packages-web-version` exports `./use-version-check`, `./update-prompt`, **new** `./version` (`VersionResponse`, `VERSION_ENDPOINT`, `versionId`, `isUpdateAvailable`).

- [ ] **Step 1: Move the core and its test**

```bash
git mv code/packages/shared/version/src/index.ts code/packages/web/version/src/version.ts
git mv code/packages/shared/version/src/version.test.ts code/packages/web/version/src/version.test.ts
git rm -r -q code/packages/shared/version code/docs/packages/shared/version.md code/docs/reference/packages/shared/version
```

In `version.test.ts` change its import to `./version`. In `version.ts` set the `@see` to `docs/reference/packages/web/version/src/version.md` and the doc to: `The version-check core — the compare + the /api/version response shape. String identity, not semver: a deploy stamps a new opaque id.`

- [ ] **Step 2: Rewire the web brick**

`code/packages/web/version/package.json`: delete the `@indiecrafts/packages-shared-version` dependency; add export `"./version": "./src/version.ts"`; add `"test": "vitest run"` to scripts (and `"vitest"` only if other web bricks declare it locally — match `code/packages/web/email/package.json`).
`src/use-version-check.ts`: imports from `./version`; L17 → `export { isUpdateAvailable } from "./version";`.
Remove `@indiecrafts/packages-shared-version` from `transpilePackages` in `code/projects/web/surfaces/app/next.config.ts:25` and `code/projects/web/surfaces/website/next.config.ts:49`, and from `code/projects/web/surfaces/app/package.json:31`.
Create `code/docs/reference/packages/web/version/src/version.md` (reference format). Fold the core's description into `code/docs/packages/web/version.md` (one "Core" section listing the four exports). Delete the `shared/version` row in `code/packages/_registry.md` (L42) and the sidebar line in `config.mts` (L498). Update the brick's brief: the compare now lives here (`./version`), string identity, not semver.
In `cross-platform-shell.md` and `multi-app.md` replace `packages-shared-version` with `packages-web-version/version`.

- [ ] **Step 3: Verify**

Run: `pnpm install && pnpm --filter @indiecrafts/packages-web-version test && pnpm tsc:fast && pnpm check:doc-coverage && git grep -n "packages-shared-version" -- ':!**/CHANGELOG.md' ':!code/docs/**/changelog.md' ':!docs/superpowers'`
Expected: tests + tsc + coverage green; grep prints nothing.

- [ ] **Step 4: Commit**

```bash
git add -A code pnpm-lock.yaml
git commit -m "refactor(version): merge the shared version core into web/version

Its only consumers are web; one brick instead of two.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Move `system-pages` to `web/`

**Files:** everything the codemod rewrites (inventory: app/website `package.json` + `next.config.ts` + `tsconfig.json` paths, 5 website src files, app layout, Storybook `main.ts`/`package.json`/`Introduction.mdx`, docs, `_registry.md:39`, `config.mts:493`) + `code/packages/web/system-pages/package.json` `name`.

**Interfaces:**

- Produces: `@indiecrafts/packages-web-system-pages` with exports `./shared`, `./web`, `./web/*`, `./proxy`.

- [ ] **Step 1: Run the codemod**

Run: `node "$SCRATCH/move-brick.mjs" system-pages`
Expected: `✓ moved system-pages; N file(s) rewritten` listing the package.json, next.config/tsconfig files, src imports and docs.

- [ ] **Step 2: Fix the one relative path and the registry row**

`ui-tokens/src/globals.css:11` `@source "../../system-pages/src";` resolves from `code/packages/shared/ui-tokens/src` to `shared/system-pages` — now wrong. Change it to `@source "../../../web/system-pages/src";` (Task 11 restores the short form when ui-tokens moves too). In `code/packages/_registry.md` move the row from the `shared/` table to the `web/` table. In `code/docs/.vitepress/config.mts` move the sidebar entry from the shared list (L486-499) to the web list (L500-525).

- [ ] **Step 3: Verify**

Run: `pnpm install && pnpm tsc:fast && pnpm test && pnpm check:doc-coverage && pnpm --filter @indiecrafts/web-tools-storybook build-storybook --quiet && git grep -n "packages-shared-system-pages\|packages/shared/system-pages" -- ':!**/CHANGELOG.md' ':!code/docs/**/changelog.md' ':!docs/superpowers'`
Expected: green; grep prints nothing.

- [ ] **Step 4: Commit**

```bash
git add -A code pnpm-lock.yaml
git commit -m "refactor(system-pages): move to web/ — it runs only in the browser

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Move `ui-icons` to `web/`

**Files:** everything the codemod rewrites (blog module, page-builder, ui-components, app/website configs + src, Storybook, docs, `_registry.md:37`, `config.mts:495`) + root `package.json` L38-39 (`brands:build`/`brands:check` filter names).

**Interfaces:**

- Produces: `@indiecrafts/packages-web-ui-icons` with exports `./shared`, `./web`, `./web/*`.

- [ ] **Step 1: Run the codemod and fix the root scripts**

```bash
node "$SCRATCH/move-brick.mjs" ui-icons
node "$SCRATCH/root-pkg.mjs" '@indiecrafts/packages-shared-ui-icons' 'g' '@indiecrafts/packages-web-ui-icons'
```

Expected: codemod lists the rewritten files; helper prints `✓ root package.json …`.

- [ ] **Step 2: Registry + sidebar**

Move the row in `code/packages/_registry.md` from `shared/` to `web/`; move the sidebar entry in `config.mts` to the web list.

- [ ] **Step 3: Verify**

Run: `pnpm install && pnpm brands:check && pnpm tsc:fast && pnpm test && pnpm check:doc-coverage && pnpm --filter @indiecrafts/web-tools-storybook build-storybook --quiet && git grep -n "packages-shared-ui-icons\|packages/shared/ui-icons" -- ':!**/CHANGELOG.md' ':!code/docs/**/changelog.md' ':!docs/superpowers'`
Expected: green; grep prints nothing.

- [ ] **Step 4: Commit**

```bash
git add -A code pnpm-lock.yaml
git diff --cached --stat package.json   # expect only the 2 brands:* lines
git commit -m "refactor(ui-icons): move to web/ — it runs only in the browser

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Move `ui-tokens` to `web/`

**Files:** everything the codemod rewrites (root `CLAUDE.md`, every brief and rule naming `DESIGN.md`, `.claude/agents/project/*`, `.claude/skills/*`, `.claude/hooks/guard.mjs`, `.prettierignore`, `.vscode/settings.json`, all consumers' configs, website `check-contrast.mjs` + `PRODUCT.md`, Storybook `preview.css` + token stories, docs, `_registry.md:36`, `config.mts:496`) + root `package.json` L36-37.

**Interfaces:**

- Produces: `@indiecrafts/packages-web-ui-tokens` with exports `./globals.css`, `./typeset.css`, `./hex`, `./tokens.json`; `DESIGN.md` at `code/packages/web/ui-tokens/DESIGN.md`.

- [ ] **Step 1: Run the codemod and fix the root scripts**

```bash
node "$SCRATCH/move-brick.mjs" ui-tokens
node "$SCRATCH/root-pkg.mjs" '@indiecrafts/packages-shared-ui-tokens' 'g' '@indiecrafts/packages-web-ui-tokens'
```

- [ ] **Step 2: Fix `globals.css` `@source` lines**

In `code/packages/web/ui-tokens/src/globals.css`: delete the stale L4 `@source "../../../../projects/web/src";` (that directory does not exist); set the system-pages line back to `@source "../../system-pages/src";` (both bricks now sit in `web/`). The other `../../../web/…` and `../../../../modules/…` lines resolve unchanged (same depth).

- [ ] **Step 3: Relative paths the name-based codemod may miss**

Run: `git grep -n "shared/ui-tokens" -- ':!**/CHANGELOG.md' ':!code/docs/**/changelog.md' ':!docs/superpowers'` and rewrite each hit to `web/ui-tokens` (expected: `check-contrast.mjs:24`, website `.claude/CLAUDE.md` `@../../../../../packages/…/DESIGN.md` imports, `PRODUCT.md` — all already covered by the codemod's `packages/shared/ui-tokens` rule; this is the proof step). Move the registry row and sidebar entry to `web/`.

- [ ] **Step 4: Verify**

Run: `pnpm install && pnpm tokens:check && pnpm tsc:fast && pnpm test && pnpm check:doc-coverage && pnpm check:claude-md && pnpm --filter @indiecrafts/web-surfaces-website verify:contrast && pnpm --filter @indiecrafts/web-tools-storybook build-storybook --quiet`
Expected: all green. Then start the website (`pnpm dev`) and `curl -s localhost:3000 | grep -c 'bg-background'` → Expected: > 0 (Tailwind still sees the class sources).

- [ ] **Step 5: Commit**

```bash
git add -A code .claude/agents .claude/skills .claude/hooks/guard.mjs .prettierignore .vscode/settings.json CLAUDE.md pnpm-lock.yaml
git status --porcelain | grep -E '^(A|M) +(\.claude/settings|\.vscode/tasks|\.claude/hooks/react-doctor)' && echo "STOP: WIP staged"
git commit -m "refactor(ui-tokens): move to web/ — every consumer is a browser

DESIGN.md now lives at code/packages/web/ui-tokens/DESIGN.md; every brief,
rule, agent and skill path follows. shared/ now holds only bricks the api
or workers use too.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Capacitor dev environment — run it on the `qa` emulator

**Files:** none changed unless the smoke run finds a bug (fix it test-first in the owning task's files).

- [ ] **Step 1: Install JDK 21 (operator step — ask the user first)**

Ask: "Install JDK 21 with `brew install --cask zulu@21`?" Only after a yes:

```bash
brew install --cask zulu@21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
java -version   # Expected: openjdk version "21…"
```

- [ ] **Step 2: Start the stack and the emulator**

```bash
pnpm dev                                              # background: website :3000 + api :8787 + cron/workers
pnpm --filter @indiecrafts/web-surfaces-app dev       # background: app :3002
~/Library/Android/sdk/emulator/emulator @qa &         # background
adb wait-for-device && adb shell getprop sys.boot_completed   # Expected: 1
```

- [ ] **Step 3: Build, install and launch the shell**

Run: `JAVA_HOME=$(/usr/libexec/java_home -v 21) pnpm --filter @indiecrafts/mobile-surfaces-main android`
Expected: Gradle builds, `cap run` installs and launches; `adb shell dumpsys activity activities | grep -m1 mResumedActivity` shows the shell's `appId`.

- [ ] **Step 4: Programmatic smoke checks**

```bash
adb logcat -d | grep -iE "capacitor|chromium" | tail -20        # Expected: the page at http://localhost:3002 loaded, no "net::ERR"
adb shell input keyevent KEYCODE_BACK                            # Expected: app stays (history) or exits at root — no crash
adb shell am start -W -a android.intent.action.VIEW -d "indiecrafts://account" dev.indiecrafts.app   # Expected: Status: ok
```

Then pause for the user's visual checks (Task 15 cards): app loads, back button, deep link lands on `/account`, a legal link opens Chrome, airplane mode on a cold start shows the offline page.

- [ ] **Step 5: iOS (human, needs Xcode 26)**

Document only; do not install Xcode. The user runs `pnpm --filter @indiecrafts/mobile-surfaces-main ios` once Xcode 26 is installed.

---

### Task 13: Sign-in is password + email code

**Files:**

- Modify: `code/docs/shared/architecture/auth.md` (L10-11, L26-30, L80-85, L112, 119, 172-179)

- [ ] **Step 1: Rewrite the auth doc**

- L10-11 → `Sign-in uses **password** or an **email one-time code**, on every surface (website · app · the Capacitor shell). Social connections are off: Google and other OAuth providers refuse to run inside an embedded web view, and one method set keeps every surface identical.`
- The per-platform SDK table (L26-30): delete the `mobile | Expo | @clerk/clerk-expo …` row; add a line under the table: `The Capacitor shell loads the app surface, so it uses \`@clerk/nextjs\` like the app.`
- Delete "Email verification for social" (L80-85).
- L112, L119, L172-179: remove Expo/native mentions (`MarketingNudgeGate`, native banner, "web + native") — the web mounts are the only ones.
- Add a section `## Clerk dashboard settings` with the operator steps: **User & Authentication → Email**: enable _Email address_ (required), _Password_, _Email verification code_; **SSO connections**: disable every social provider; save for the dev and prod instances.

- [ ] **Step 2: Operator step (the user)**

Ask the user to apply the Clerk dashboard settings above on the dev instance (and prod when ready). This is a ledger card in Task 15; no code enforces it.

- [ ] **Step 3: Verify + commit**

```bash
pnpm docs:build   # Expected: success (dead links fail the build)
git add code/docs/shared/architecture/auth.md
git commit -m "docs(auth): sign-in is password + email code on every surface

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Docs, briefs, ADR, changelogs — and the final gate

**Files (each listed with the exact lines from the inventory):**

- Briefs: `CLAUDE.md` L26-27, 53, 66 · `code/projects/.claude/CLAUDE.md` L8-10, 24 · `code/projects/_registry.md` L32-36, 81, 96-98 · `code/packages/.claude/CLAUDE.md` L5-6, 28, 33, 48-51, 66 · `code/packages/_registry.md` L8-16, 28, 40-41, 49-51, 63-67, 92-96 · `code/docs/.claude/CLAUDE.md` L6-7 · `code/modules/.claude/CLAUDE.md` L5-6, 17, 24 · `code/shared/api/.claude/CLAUDE.md` L3, 10-11, 30-32, 43-44, 106 · briefs of `announcement` (L7, 12), `compliance` (L6, 8, 13), `config` (L17-21), `query` (L4, 12), `ui-fonts` (L5-6), `utils` (L5), `locale-suggest` (L13), `web/ui` (L9-11), `web/ui-components` (L23, 30-32), `system-pages`, `ui-icons`, `ui-tokens` (+ `DESIGN.md` L161-172), Storybook (L5-7, 27-28) · `code/projects/web/surfaces/website/.claude/rules/design-token-usage.md:10` · `code/projects/mobile/{shared,tools}/**/README.md`
- Source comments: `code/packages/shared/compliance/src/{shared/index.ts:5-6, shared/consent.ts:3,6,26, shared/consent-signals.ts:3-4, shared/legal.ts:3,146,180, shared/account-copy.ts:4, web/index.ts:1-5, web/signals.ts:6, web/DeleteAccountSection.md:10,27}` · `code/packages/shared/config/src/web/site.ts:37-38`
- Docs: `code/docs/shared/architecture/cross-platform-shell.md` (rewrite) · `code/docs/packages/shared/compliance.md` · `code/docs/packages/web/compliance.md` · `code/docs/shared/api/index.md` L24, 32, 45, 79 · `code/docs/projects/web/website/setup/deployment.md:133` · `code/docs/projects/web/website/config/cookie-consent-geo.md` L116, 128 · `code/docs/projects/web/tools/storybook.md` · `code/docs/packages/README.md` · `code/docs/packages/linking-a-package.md`
- Create: `code/docs/contributing/adr/0001-capacitor-over-expo.md`; Modify: `code/docs/contributing/adr/index.md` (Log), `config.mts` (ADR sidebar)
- Changelogs (new entries only): `code/packages/CHANGELOG.md`, `code/shared/api/CHANGELOG.md`, `code/projects/mobile/surfaces/main/CHANGELOG.md`, `code/projects/web/surfaces/app/CHANGELOG.md`, `code/projects/web/surfaces/website/CHANGELOG.md`, `code/projects/web/tools/storybook/CHANGELOG.md`, `code/docs/CHANGELOG.md`

- [ ] **Step 1: Briefs say what is true now**

Apply these rules to every brief line listed above, then keep each brief ≤ 90 lines:

- Replace "Expo", "React Native", "native", "the Expo shell", "web + native", "`./native`" with the single truth: "the web surfaces" / "the `app` surface (also inside the Capacitor shell)".
- `CLAUDE.md` folder map: `mobile/surfaces/main` = "the Capacitor shell around `app`"; packages = `packages/{shared,web}`; "admin/mobile: tsc" → "admin: tsc · mobile shell: tsc + test".
- `code/packages/.claude/CLAUDE.md`: scopes are `shared · web`; recount live bricks from `ls code/packages/{shared,web}` and write the numbers; `shared/` = "the api or workers use it too", `web/` = "browser only"; delete the `mobile/` scope bullet and the "Multi-platform inside a brick" paragraph (no brick forks per platform any more).
- `code/projects/.claude/CLAUDE.md` + `_registry.md`: mobile row = class `capacitor`, `code/projects/mobile/surfaces/main`; deploy scripts list `deploy/{all,next,worker}.mjs`; delete "native apps via `--only all`".
- `code/packages/_registry.md`: delete the `### mobile/` section and ui-native row; the moved bricks sit in the `web/` table; the "(mobile)" query line and mobile scope counts go.
- api brief: L3 "non-web clients (`mobile`, partners)" → "partners and the web surfaces"; delete the `EVENTS_TOKEN` sentences (L10-11, L43-44); L30-32 → "website · app (and the Capacitor shell, which is the app)"; delete L106 "CORS-allowlist the mobile origins".
- Platform skeleton READMEs under `code/projects/mobile/{shared,tools}`: replace "Expo" with "Capacitor shell"; keep them as the platform skeleton.

- [ ] **Step 2: Source comments**

Apply the same rule to the compliance and config comments listed above. `compliance/src/web/index.ts` L1-5 has a garbled sentence — rewrite it to: `The shadcn consent + legal UI — Next-free, so the \`app\` surface (and the Capacitor shell that loads it) uses it directly.` `site.ts:37-38`: drop `EXPO_PUBLIC_WEBSITE_URL`from the comment (keep`VITE_WEBSITE_URL`only if Vite is a real consumer —`git grep -n VITE_WEBSITE_URL`; else drop it too).

- [ ] **Step 3: Architecture docs**

Rewrite `cross-platform-shell.md` as "Mobile shell": one web codebase (the `app` surface); the Capacitor shell loads it by URL; `NativeBridge` owns the native events; what is shared (`shared/` bricks with the api) vs browser-only (`web/`); links to the mobile page and ADR 0001. Keep it ≤ 60 lines. Remove the native rows from both compliance docs. Remove `/v1/geo` from `shared/api/index.md` (L24, 32, 45, 79) and from `cookie-consent-geo.md` (L116, 128: "each web surface reads `cf-ipcountry` server-side"). Remove `EVENTS_TOKEN` from `deployment.md:133`. Rewrite the Storybook doc's native sections (L3, 9, 22-23, 38-40, 75-78, 92, 108-109) to the single tree.

- [ ] **Step 4: ADR 0001**

Create `code/docs/contributing/adr/0001-capacitor-over-expo.md`:

```markdown
---
title: "ADR 0001 — Capacitor over Expo"
status: accepted
order: 3
---

# ADR 0001 — Capacitor over Expo

**Status:** accepted · **Date:** 2026-09-29 · **Deciders:** the maintainer

## Context

The mobile app was a separate React Native / Expo codebase. It forced a native fork into
five shared bricks, a native-only design system (`ui-native`), native-only API features
(`/v1/geo`, the `EVENTS_TOKEN` bearer, surface `mobile`) and an EAS pipeline. Every
feature shipped twice.

## Decision

Ship mobile as a Capacitor 8 shell that loads the hosted `app` surface (`server.url`).
All UI lives in the web app; one client component (`NativeBridge`) wires the native
plugins. Delete the Expo app, every native fork, and the native-only backend features.
Sign-in is password + email code on every surface.

## Consequences

- One UI codebase; `shared/` bricks are the ones the api uses, the rest are `web/`.
- Web deploys update the mobile app without store review.
- The shell needs a network; a failed first load shows a bundled offline page.
- A public App Store release needs one real native feature (Guideline 4.2) and a release
  pipeline — both belong to a later spec, as does OAuth through the system browser.
```

Add it to the ADR index Log and a sidebar line after "ADR template" in `config.mts`.

- [ ] **Step 5: Changelog entries (one per area, in its own log)**

Add an `### Removed` / `### Changed` entry under `## [Unreleased]` in each changelog listed above, in plain language with the why: packages (native forks + `ui-native` + `config/mobile` deleted; `version` merged; `system-pages`/`ui-icons`/`ui-tokens` moved to `web/` with the rename table; one hex mirror); api (`EVENTS_TOKEN` + `/v1/geo` removed, surface `mobile` gone, runbook `wrangler secret delete EVENTS_TOKEN --env <env>`); mobile (Expo → Capacitor shell, how to run); app (`NativeBridge`); website (announcement/appContent `mobile` removed + data migrated); storybook (single tree); docs (ADR 0001, mobile page, auth methods).

- [ ] **Step 6: The final gate**

```bash
pnpm install --frozen-lockfile
pnpm tsc && pnpm test && pnpm test:scripts && pnpm check:doc-coverage && pnpm check:claude-md && pnpm check:secret-leak && node code/shared/scripts/checks/tags-report.mjs --check && pnpm tokens:check && pnpm brands:check && npx oxlint code && pnpm docs:build
pnpm --filter @indiecrafts/mobile-surfaces-main verify
git grep -niE '\bexpo\b|react-native|EXPO_|ui-native|src/native|EVENTS_TOKEN|/v1/geo' -- . \
  ':!**/CHANGELOG.md' ':!code/docs/**/changelog.md' ':!code/shared/api/db/**/migrations/**' \
  ':!docs/superpowers/**' ':!pnpm-lock.yaml' ':!code/docs/contributing/adr/0001-capacitor-over-expo.md'
```

Expected: every command green; the grep prints nothing. Any hit is unfinished work — fix it in the file it names, then rerun.

- [ ] **Step 7: Commit**

```bash
git add -A code CLAUDE.md
git status --porcelain | grep -E '^(A|M) +(\.claude/settings|\.vscode/tasks|\.claude/hooks/react-doctor|package\.json)' && echo "STOP: WIP staged"
git commit -m "docs: the codebase describes one web platform plus a Capacitor shell

Briefs, registries, architecture docs, ADR 0001 and every area changelog
now match the code: no Expo, no native forks.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Ledger artifacts

**Files:** claude.ai artifacts only (no repo files).

- Legal Banner QA — `https://claude.ai/artifact/NUYh6iNNWxPTMqzr7VVDcT`
- The QA Runbook — `https://claude.ai/artifact/6kvpxCUWU13bnHvrQdBmdt`
- The Test Ledger — `https://claude.ai/artifact/6BiTmGBj6imqYBMqqATDen`

- [ ] **Step 1: Read each artifact** (`Artifact` tool, `action: "read"`), and list every card or step that names Expo, Expo Go, React Native, `EXPO_PUBLIC_*`, AsyncStorage, the native prompt, `/v1/geo`, `EVENTS_TOKEN`, or the `mobile` surface.

- [ ] **Step 2: Replace those cards with Capacitor cards** (preserve each artifact's design and storage key; bump the key suffix when steps change, as done for `legal-banner-qa-v2`):
  1. Shell boots on the `qa` emulator and loads the `app` surface (`pnpm --filter @indiecrafts/mobile-surfaces-main android`).
  2. Android back button: goes back in history; exits at the root.
  3. Deep link `adb shell am start -a android.intent.action.VIEW -d "indiecrafts://account" dev.indiecrafts.app` lands on `/account`.
  4. A legal link (privacy / terms) opens in the system browser, not in the shell.
  5. Airplane mode + cold start shows the offline page; Retry reloads once online.
  6. Splash hides after load; status bar follows the system theme.
  7. Sign-in inside the shell with password, then with an email code.
  8. Clerk dashboard: social connections off, password + email code on (human).
  9. Legal re-acceptance banner appears inside the shell after a Sanity bump; accepting it clears it on the website for the same signed-in user.
  10. An announcement tagged `app` shows in the shell; `?surface=mobile` on the api returns 400.
  11. iOS simulator run — **human, needs Xcode 26**.

- [ ] **Step 3: Publish each updated artifact to its own URL** (`Artifact` publish with `url`), then tell the user which cards changed.

---

## Self-review (done while writing)

- **Spec coverage:** §1 deletions → Tasks 3, 5 (forks), 6 (token outputs); relocations → Tasks 7-11; simplification sweep → Task 14. §2 shell → Tasks 3, 4, 12; offline → Task 3; sign-in → Task 13; legal/consent → unchanged by design (verified by ledger card 9). §3 backend → Tasks 1, 2. §4 tooling/CI → Tasks 3, 6; tests → every task; docs/ADR/changelogs → Task 14; ledger → Task 15. "Done means" → Task 14, Step 6.
- **Placeholder scan:** none; every code step carries its code, every edit names its file + lines.
- **Type consistency:** `resolveServerUrl(env)`, `renderOfflinePage({ appName, messages })`, `isExternalUrl(href, appOrigin)`, `deepLinkPath(url)`, `hexColors.light|dark`, `deployable()` (no argument) are used with the same signatures everywhere.
- **Review Focus:** the five lines each have their pinning test in the owning task (Tasks 1-4).

## Follow-ups (after this plan)

Each item gets its own brainstorm → spec → plan. None blocks this branch.

- **iOS run.** Install Xcode 26, then `pnpm --filter @indiecrafts/mobile-surfaces-main ios`. Run the same five checks as the Android run (cold start, offline + Retry, splash, deep link, sign-in stays in the WebView).
- **vinext on Cloudflare (user request, 2026-09-29).** Replace the OpenNext build of the `next-cf` apps (`website`, `admin`, `app`) with vinext (Cloudflare's Vite-based implementation of the Next.js API). Start with a spike on `app`, the smallest surface. It must prove that next-intl routing + `proxy.ts`, Clerk, the Sanity reads and the version route work. Then plan `website` (ISR, Sanity Studio, the page builder). The registry class `next-cf`, `scripts/deploy/next.mjs` and the CI build jobs change with it.
- **`app` sign-up is unreachable when signed out.** `src/proxy.ts` treats only `sign-in` as public. Add `sign-up`, with a test.
- **`app` dev port.** `next dev` has no fixed port; the shell expects :3002, which `pnpm docs` also uses. Pick one free port and set it in the `dev` script.
