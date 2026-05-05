import type { ReactNode } from "react";
import { SkipLink } from "@/components/layouts/_shared/skip-link";
import { Header7 } from "@/components/layouts/_shared/site-headers/header-7";
import { SiteFooter } from "@/components/layouts/default-layout/site-footer";
import type { LayoutProps } from "../registry";

/**
 * Marketing chrome — `SkipLink + Header7 + <main> + SiteFooter`. Sections
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
      {resolveSlot(header, <Header7 />)}
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
