import type { ReactNode } from "react";
import { SkipLink } from "@/components/layouts/_shared/skip-link";
import { Header7 } from "@/components/layouts/_shared/site-headers/header-7";
import { SiteFooter } from "@/components/layouts/default-layout/site-footer";
import type { LayoutProps } from "../registry";

/**
 * Sections bleed to the viewport edges. Footer renders by default for
 * consistency across layouts; header is opt-in (auth flows usually
 * suppress nav during sign-in).
 *
 * Slot semantics for both `header` and `footer`:
 *   - `true` → render the layout's default (Header7 / SiteFooter)
 *   - `false` → render nothing
 *   - `ReactNode` → render that node in place of the default
 */
export function FullBleedLayout({
  children,
  header = false,
  footer = true,
}: LayoutProps) {
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <Header7 />)}
      <main id="main" tabIndex={-1} className="w-full flex-1 outline-none">
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
