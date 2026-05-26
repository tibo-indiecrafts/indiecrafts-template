import { useTranslations } from "next-intl";
import type { MessageKey } from "@/types/messages";

/**
 * Translator hook for sections that accept caller-provided `MessageKey`
 * overrides while otherwise resolving labels from their own namespace.
 *
 *   const [t, tr, tRoot] = useScopedT("pages.home.blocks.features");
 *   <h2>{tr(props.titleKey, "title")}</h2>      // optional override + fallback
 *   <Button>{t("submit")}</Button>              // namespaced local key
 *   {items.map(i => <li>{tRoot(i.titleKey)}</li>)}  // required full path
 *
 * Without the split between `t` and `tr`, callers passing a canonical full
 * path (e.g. `"pages.home.blocks.features.title"`) would double-prefix the
 * namespace into `pages.home.blocks.features.pages.home.blocks.features.title`.
 */
export function useScopedT(namespace: Parameters<typeof useTranslations>[0]) {
  const t = useTranslations(namespace);
  const tRoot = useTranslations();
  function tr(
    overrideKey: MessageKey | undefined,
    fallback: string,
    vars?: Record<string, string | number | Date>,
  ): string {
    return overrideKey ? tRoot(overrideKey, vars) : t(fallback, vars);
  }
  return [t, tr, tRoot] as const;
}
