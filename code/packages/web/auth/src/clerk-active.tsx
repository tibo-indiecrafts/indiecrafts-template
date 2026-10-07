"use client";

/**
 * Tell client components whether Clerk is mounted above them.
 *
 * @see docs/reference/packages/web/auth/src/clerk-active.md
 */
import { createContext, useContext, type ReactNode } from "react";

const ClerkActiveContext = createContext(false);

/** Marks its subtree as running under `ClerkProvider`. `AppClerkProvider` renders it. */
export function ClerkActive({ children }: { children: ReactNode }) {
  return (
    <ClerkActiveContext.Provider value>{children}</ClerkActiveContext.Provider>
  );
}

/** True under `AppClerkProvider` (with a key). A surface that loads Clerk only when needed
 *  (the website) reads it to choose between Clerk UI and a Clerk-free fallback: Clerk's
 *  hooks throw without the provider. Imports nothing from Clerk, so it costs no bundle. */
export function useClerkActive(): boolean {
  return useContext(ClerkActiveContext);
}
