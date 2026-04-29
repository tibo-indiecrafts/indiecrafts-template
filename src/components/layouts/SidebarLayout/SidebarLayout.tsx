"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { SkipLink } from "@/components/layouts/_shared/SkipLink";
import { SiteHeader } from "@/components/layouts/DefaultLayout/SiteHeader";
import { SiteFooter } from "@/components/layouts/DefaultLayout/SiteFooter";
import type { LayoutProps } from "../registry";
import { sidebarLayoutNamespace } from "./config";

/**
 * Two-column layout with a sticky aside. Wraps the standard marketing chrome
 * (SkipLink + SiteHeader + `<main>` + SiteFooter) and renders the `aside`
 * slot to the left of `children`. Pass `header={false}` / `footer={false}`
 * to opt out of the marketing chrome.
 */
export function SidebarLayout({
  children,
  aside,
  header = true,
  footer = true,
}: LayoutProps) {
  const t = useTranslations(sidebarLayoutNamespace);
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <SiteHeader />)}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-(--max-container) flex-1 gap-10 px-(--gutter) py-12 outline-none lg:grid-cols-[16rem_1fr]"
      >
        {aside ? (
          <aside className="lg:sticky lg:top-24 lg:self-start" aria-label={t("asideLabel")}>
            {aside}
          </aside>
        ) : null}
        <div>{children}</div>
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
