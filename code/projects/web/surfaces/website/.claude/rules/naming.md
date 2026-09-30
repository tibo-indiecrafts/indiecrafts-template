---
description: File + symbol naming conventions.
---

# Naming conventions

Load when creating or renaming files, components, or config/message keys.

- **Components** — PascalCase (`DashboardCard`), one component per file, filename matches the component (`DashboardCard.tsx`).
- **Routes / slugs / folders** — kebab-case (`src/app/[locale]/case-studies/`).
- **Hooks** — `useX` camelCase (`useIsMobile`).
- **Message keys** — namespaced by page: `pages.<id>.blocks.<block>`. Block keys drop the library's `-NN` variant suffix (`features-01` → `features`).
- **Config** — read brand strings, URLs, colors, nav from `@/config`; never hard-code them in a component.
- **User-facing strings** — always in `messages/<locale>.json`, never inline.
- **Design tokens** — semantic role names (`brand`, `muted-foreground`), never appearance names (`bigRedButton`, `blue500`). See the `design-token-usage` rule.
