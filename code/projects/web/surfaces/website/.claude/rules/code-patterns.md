---
description: Wrong→right code patterns for the app's most-violated rules. Replicate the ✅, never the ❌.
---

# Code patterns (❌ / ✅)

Auto-loads in the `code/projects/web/surfaces/website` subtree. Each NEVER in the app `CLAUDE.md` has a concrete
pattern here — **replicate the ✅, never ship the ❌.**

## Errors — never swallow

❌
```ts
try { await publish(doc); } catch { /* ignore */ }
```
✅
```ts
import { logger } from "@indiecrafts/logger";
try {
  await publish(doc);
} catch (error) {
  logger.error("publish failed", { id: doc._id, error });
  throw error; // let the caller decide; never silently continue
}
```

## Hydration state — `useSyncExternalStore`, not `useEffect`

❌
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []); // set-state-in-effect → cascading render + hydration flash
```
✅
```tsx
const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
// or reset state during render on a prop transition — never setState inside an effect body
```

## Sanity / remote images — size at the CDN

❌
```tsx
<img src={post.coverUrl} /> // ships the full-resolution original
```
✅
```tsx
import Image from "next/image";
<Image src={post.coverUrl} alt={post.alt} width={1200} height={630} sizes="(max-width:768px) 100vw, 720px" />
// the images.loaderFile rewrites to ?w=&q=&auto=format&fit=max. Raw <img> only with an explicit ?w=… param.
```

## Navigation — typed app routing, never `next/link`

❌
```tsx
import Link from "next/link"; // bypasses locale prefixing + typed routes
```
✅
```tsx
import { Link } from "@/i18n/routing"; // app routes; modules use @indiecrafts/i18n
```

## Color / spacing — tokens, never raw values

❌
```tsx
<div className="bg-[#4f69d9] p-[13px]" />
```
✅
```tsx
<div className="bg-brand p-3" /> // semantic token + the xs–xl spacing scale (DESIGN.md)
```

## Types — fix the type, never `as any`

❌
```ts
const data = (await res.json()) as any;
```
✅
```ts
const data = (await res.json()) as PostPayload; // a real type; if truly unknown, `unknown` + a guard
```

## Sanity client — reuse the singleton

❌
```ts
const client = createClient({ projectId, dataset }); // new client per route
```
✅
```ts
import { client } from "@indiecrafts/sanity/client"; // one shared client
```

## User-facing strings — `messages/`, never inline

❌
```tsx
<button>Save changes</button>
```
✅
```tsx
const t = useTranslations("common");
<button>{t("saveChanges")}</button> // every visible string lives in messages/<locale>.json
```

## CSV export — escape formula injection, don't just quote

❌
```js
rows.map((r) => FIELDS.map((f) => `"${r[f]}"`).join(",")); // "=HYPERLINK(..)" runs in Excel
```
✅
```js
import { csvCell } from "./lib/csv.mjs"; // RFC-4180 quote + prefix a leading = + - @ with '
rows.map((r) => FIELDS.map((f) => csvCell(r[f])).join(",")); // user content can't execute
```

## Sanitize at the right layer — never a hand-rolled deny-list

❌
```ts
if (/<script|SELECT|--|DROP/i.test(input)) reject(); // regex "XSS/SQL detector" — false confidence
```
✅
```ts
// Escape/parameterize at the sink, per context: React escapes JSX; GROQ params bind values;
// csvCell guards CSV; Turnstile + withGuard gate the request. No allow/deny regex stands in for it.
```
