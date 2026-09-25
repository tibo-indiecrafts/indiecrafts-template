"use client";

/**
 * Mount the compliance and version overlays for the app shell.
 *
 * @see docs/reference/projects/web/app/src/user-interface/ShellOverlays.md
 */
import { useLocale, useTranslations } from "next-intl";
import { UpdatePrompt } from "@indiecrafts/packages-web-version/update-prompt";
import type { ConsentMode } from "@indiecrafts/packages-shared-compliance/shared";
import { type Locale } from "@/config";
import { ConsentGate } from "./overlays/ConsentGate";
import { LegalGate } from "./overlays/LegalGate";

/**
 * Compliance + version overlays for the app shell. Mounted in `[locale]/layout`. A thin
 * composition root — each overlay is its own file under `overlays/` (ConsentGate · LegalGate),
 * over the shared consent/legal stores in `overlays/stores`.
 *
 * `mode` is the geo-resolved consent mode (from the layout's `cf-ipcountry`); `gpcSignal` is the
 * server-detected `Sec-GPC: 1` request header.
 */
export function ShellOverlays({
  commit,
  mode,
  gpcSignal,
}: {
  commit: string;
  mode: ConsentMode;
  gpcSignal: boolean;
}) {
  const tv = useTranslations("version");
  const locale = useLocale() as Locale;
  return (
    <>
      <ConsentGate mode={mode} gpcSignal={gpcSignal} />
      <LegalGate locale={locale} />
      <UpdatePrompt
        current={commit}
        message={tv("message")}
        reloadLabel={tv("reload")}
        dismissLabel={tv("dismiss")}
      />
    </>
  );
}
