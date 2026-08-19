import type { routing } from "@/i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    // Messages type intentionally left loose so config-driven `t(key)` calls
    // with runtime-dynamic keys compile. Missing translations are surfaced by
    // next-intl at request time (warnings) and covered by lint rules.
  }
}
