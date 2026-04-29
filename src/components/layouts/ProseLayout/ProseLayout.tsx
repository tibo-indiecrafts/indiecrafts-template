import type { ReactNode } from "react";
import { SkipLink } from "@/components/layouts/_shared/SkipLink";
import { SiteHeader } from "@/components/layouts/DefaultLayout/SiteHeader";
import { SiteFooter } from "@/components/layouts/DefaultLayout/SiteFooter";
import type { LayoutProps } from "../registry";

/**
 * Narrow reading column — for legal pages, blog posts, long-form content.
 * Wraps SkipLink + SiteHeader + a centered prose `<main>` + SiteFooter.
 *
 * Pass `header={false}` / `footer={false}` to opt out of the marketing
 * chrome, or pass a `ReactNode` to swap in a custom slot.
 */
export function ProseLayout({ children, header = true, footer = true }: LayoutProps) {
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <SiteHeader />)}
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
