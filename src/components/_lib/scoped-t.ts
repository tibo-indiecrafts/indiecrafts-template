import { useTranslations } from "next-intl";
import type { MessageKey } from "@/types/messages";

/**
 * Translator hook for sections that accept caller-provided MessageKey
 * overrides while otherwise resolving labels from their own namespace.
 *
 * `t(localKey)` resolves under the namespace as usual; `tr(overrideKey,
 * fallback, vars?)` routes a foreign-namespace MessageKey through the
 * ROOT translator and only falls back to the namespaced `fallback` key
 * when no override is set. `tRoot(fullPath)` is the unwrapped root
 * translator — use it for list items whose `MessageKey` is always a
 * required full path (no fallback meaningful).
 *
 * Without this split, callers passing the canonical full path
 * (e.g. `"blocks.login-01.title"`) would double-prefix into
 * `blocks.login-01.blocks.login-01.title`.
 *
 * Usage:
 *   const [t, tr, tRoot] = useScopedT("blocks.login-01");
 *   <h2>{tr(props.titleKey, "title")}</h2>          // optional override + fallback
 *   <Button>{t("submit")}</Button>                  // namespaced local key
 *   {props.items.map(item => <li>{tRoot(item.titleKey)}</li>)}  // required full path
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
