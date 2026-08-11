import type { ReactNode } from "react";
import { getSiteSettings } from "@/lib/seo/site-seo";
import { SkipLink } from "./SkipLink";
import { Header } from "./Header";
import { Footer } from "./Footer";

/**
 * Production default layout, colocated in `@/user-interface/layout` so the app owns
 * its chrome without depending on the sibling component library.
 *
 * `<main>` gets `pt-14 lg:pt-20` to clear the fixed Header height (h-14
 * mobile / h-20 desktop). `flex-1` pushes Footer to viewport bottom when
 * page content is short (the [locale]/layout.tsx <body> is `flex
 * min-h-screen flex-col`).
 */

type Props = {
  children: ReactNode;
  header?: boolean | ReactNode;
  footer?: boolean | ReactNode;
};

export async function DefaultLayout({ children, header = true, footer = true }: Props) {
  // Brand logo comes from Sanity (`siteSettings`). Fetched once here (React
  // `cache()` dedupes with the layout's own `getSiteSettings` call) and passed
  // into the default Header/Footer so `Logo` stays a presentational component
  // renderable inside the client Header.
  const { brand } = await getSiteSettings();
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <Header logo={brand.logo} logoDark={brand.logoDark} />)}
      <main id="main" tabIndex={-1} className="flex-1 pt-14 outline-none lg:pt-20">
        {children}
      </main>
      {resolveSlot(footer, <Footer logo={brand.logo} logoDark={brand.logoDark} />)}
    </>
  );
}

function resolveSlot(value: boolean | ReactNode, fallback: ReactNode): ReactNode {
  if (value === false) return null;
  if (value === true) return fallback;
  return value;
}
