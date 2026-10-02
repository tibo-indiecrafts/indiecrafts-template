"use client";

/**
 * Hand the server-read brand to client screens (the error boundary).
 *
 * @see docs/reference/projects/web/app/src/user-interface/BrandProvider.md
 */
import { createContext, use, type ReactNode } from "react";
import type { Brand } from "@/lib/brand";

const BrandContext = createContext<Brand | null>(null);

/** The layout reads the brand on the server and provides it here, so the client error
 *  boundary shows the logo without fetching — it must render even when Sanity is down. */
export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand | null;
  children: ReactNode;
}) {
  return <BrandContext value={brand}>{children}</BrandContext>;
}

export const useBrand = () => use(BrandContext);
