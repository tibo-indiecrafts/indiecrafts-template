import type { ReactNode } from "react";
import { SkipLink } from "@/components/layouts/_shared/skip-link";
import { Header7 } from "@/components/layouts/_shared/site-headers/header-7";
import { SiteFooter } from "@/components/layouts/default-layout/site-footer";
import type { LayoutProps } from "../registry";

/**
 * Narrow reading column — for legal pages, blog posts, long-form content.
 * Wraps SkipLink + Header7 + a centered prose `<main>` + SiteFooter.
 *
 * Pass `header={false}` / `footer={false}` to opt out of the marketing
 * chrome, or pass a `ReactNode` to swap in a custom slot.
 */
export function ProseLayout({ children, header = true, footer = true }: LayoutProps) {
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <Header7 />)}
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-3xl flex-1 px-(--gutter) py-16 outline-none"
      >
        <article className="prose prose-neutral dark:prose-invert">{children}</article>
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
