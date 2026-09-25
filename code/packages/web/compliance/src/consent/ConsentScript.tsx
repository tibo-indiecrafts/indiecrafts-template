"use client";

/**
 * Load a next/script only after a consent category is granted.
 *
 * @see docs/reference/packages/web/compliance/src/consent/ConsentScript.md
 */

import type { ComponentProps } from "react";
import Script from "next/script";
import { ConsentGate } from "./ConsentGate";

/**
 * A `next/script` that loads only after the visitor grants `category`. For third-
 * party tags that set cookies but don't support Google Consent Mode (Meta Pixel,
 * Hotjar, LinkedIn Insight, …). Consent-Mode-aware tools (GA) load normally and
 * gate via the signal update instead.
 *
 *   <ConsentScript category="marketing" src="https://connect.facebook.net/..." strategy="afterInteractive" />
 */
export function ConsentScript({
  category,
  ...props
}: { category: string } & ComponentProps<typeof Script>) {
  return (
    <ConsentGate category={category}>
      <Script {...props} />
    </ConsentGate>
  );
}
