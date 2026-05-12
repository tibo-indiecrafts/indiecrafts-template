"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { SkipLink } from "@/components/layouts/_shared/skip-link";
import { Header7 } from "@/components/layouts/_shared/site-headers/header-7";
import { SiteFooter } from "@/components/layouts/default-layout/site-footer";
import type { LayoutProps } from "../registry";
import { sidebarLayoutNamespace } from "./config";

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
      {resolveSlot(header, <Header7 />)}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto grid w-full max-w-(--max-container) flex-1 gap-10 px-(--gutter) py-12 outline-none lg:grid-cols-[16rem_1fr]"
      >
        {aside ? (
          <aside
            className="lg:sticky lg:top-24 lg:self-start"
            aria-label={t("asideLabel")}
          >
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
