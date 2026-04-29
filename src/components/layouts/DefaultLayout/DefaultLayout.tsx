import type { ReactNode } from "react";
import { SkipLink } from "@/components/layouts/_shared/SkipLink";
import { SiteHeader } from "@/components/layouts/DefaultLayout/SiteHeader";
import { SiteFooter } from "@/components/layouts/DefaultLayout/SiteFooter";
import type { LayoutProps } from "../registry";

/**
 * Marketing chrome — `SkipLink + SiteHeader + <main> + SiteFooter`. Sections
 * run edge-to-edge inside `<main>`; each section owns its own container.
 *
 * Pass `header={false}` / `footer={false}` to opt out, or pass a `ReactNode`
 * to swap in a custom slot. SkipLink + the `<main id="main">` landmark are
 * always rendered (required for keyboard a11y).
 */
export function DefaultLayout({ children, header = true, footer = true }: LayoutProps) {
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <SiteHeader />)}
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      {resolveSlot(footer, <SiteFooter />)}
    </>
  );
}

function resolveSlot(value: boolean | ReactNode, fallback: ReactNode): ReactNode {
  if (value === false) return null;
  if (value === true) return fallback;
  return value;
}
