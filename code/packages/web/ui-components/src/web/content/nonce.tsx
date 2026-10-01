"use client";
/**
 * Hand the request's CSP nonce to client components that render scripts.
 *
 * @see docs/reference/packages/web/ui-components/src/web/content/nonce.md
 */
import { createContext, useContext, type ReactNode } from "react";

const NonceContext = createContext<string | undefined>(undefined);

/** Set once in the root layout from the proxy's `x-nonce` request header. */
export function NonceProvider({
  nonce,
  children,
}: {
  nonce: string | undefined;
  children: ReactNode;
}) {
  return <NonceContext value={nonce}>{children}</NonceContext>;
}

/** The request nonce, or `undefined` outside a `NonceProvider` (Storybook, tests). */
export const useNonce = () => useContext(NonceContext);
