import type { ReactNode } from "react";
import { SkipLink } from "@/components/layouts/_shared/skip-link";
import { Header7 } from "@/components/layouts/_shared/site-headers/header-7";
import { SiteFooter } from "@/components/layouts/default-layout/site-footer";
import type { LayoutProps } from "../registry";

export function DefaultLayout({ children, header = true, footer = true }: LayoutProps) {
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <Header7 />)}
      <main id="main" tabIndex={-1} className="flex-1 pt-14 outline-none lg:pt-20">
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
