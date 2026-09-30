---
description: Wrong→right code patterns for the app's most-violated rules. Replicate the ✅, never the ❌.
---

# Code patterns (❌ / ✅)

Each NEVER in the app `CLAUDE.md` has a concrete pattern here — **replicate the ✅, never ship the ❌.**

## Errors — never swallow

```ts
try { await publish(doc); } catch { /* ignore */ } // ❌
try { await publish(doc); } catch (error) { // ✅ log (@indiecrafts/packages-shared-logger), let the caller decide
  logger.error("publish failed", { id: doc._id, error });
  throw error;
}
```

## Hydration state — `useSyncExternalStore`, not `useEffect`

```tsx
// ❌ set-state-in-effect → cascading render + hydration flash
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
// ✅ (or reset state during render on a prop transition — never setState inside an effect body)
const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
```

## Sanity / remote images — size at the CDN

```tsx
// ❌ ships the full-resolution original
<img src={post.coverUrl} />
// ✅ images.loaderFile rewrites to ?w=&q=&auto=format&fit=max (raw <img> only with an explicit ?w=…)
import Image from "next/image";
<Image src={post.coverUrl} alt={post.alt} width={1200} height={630} sizes="(max-width:768px) 100vw, 720px" />
```

## Navigation — typed app routing, never `next/link`

```tsx
import Link from "next/link"; // ❌ bypasses locale prefixing + typed routes
import { Link } from "@/i18n/routing"; // ✅ app routes; modules use @indiecrafts/packages-web-i18n
```

## Color / spacing — tokens, never raw values

```tsx
<div className="bg-[#4f69d9] p-[13px]" /> // ❌
<div className="bg-brand p-3" /> // ✅ semantic token + the xs–xl spacing scale (DESIGN.md)
```

## Types — fix the type, never `as any`

```ts
const data = (await res.json()) as any; // ❌
const data = (await res.json()) as PostPayload; // ✅ a real type; if truly unknown, `unknown` + a guard
```

## Sanity client — reuse the singleton

```ts
const client = createClient({ projectId, dataset }); // ❌ a new client per route
import { client } from "@indiecrafts/packages-web-sanity/client"; // ✅ one shared client
```

## User-facing strings — `messages/`, never inline

```tsx
<button>Save changes</button> // ❌
const t = useTranslations("common"); // ✅ every visible string lives in messages/<locale>.json
<button>{t("saveChanges")}</button>
```

## CSV export — escape formula injection, don't just quote

```js
rows.map((r) => FIELDS.map((f) => `"${r[f]}"`).join(",")); // ❌ "=HYPERLINK(..)" runs in Excel
import { csvCell } from "./lib/csv.mjs"; // ✅ RFC-4180 quote + prefix a leading = + - @ with '
rows.map((r) => FIELDS.map((f) => csvCell(r[f])).join(","));
```

## Sanitize at the right layer — never a hand-rolled deny-list

```ts
if (/<script|SELECT|--|DROP/i.test(input)) reject(); // ❌ regex "XSS/SQL detector" — false confidence
// ✅ escape/parameterize at the sink, per context: React escapes JSX; GROQ params bind values;
// csvCell guards CSV; Turnstile + withGuard gate the request. No allow/deny regex stands in for it.
```
