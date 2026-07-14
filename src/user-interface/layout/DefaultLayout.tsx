import type { ReactNode } from "react";
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

export function DefaultLayout({ children, header = true, footer = true }: Props) {
  return (
    <>
      <SkipLink />
      {resolveSlot(header, <Header />)}
      <main id="main" tabIndex={-1} className="flex-1 pt-14 outline-none lg:pt-20">
        {children}
      </main>
      {resolveSlot(footer, <Footer />)}
    </>
  );
}

function resolveSlot(value: boolean | ReactNode, fallback: ReactNode): ReactNode {
  if (value === false) return null;
  if (value === true) return fallback;
  return value;
}
