"use client";

import { ReactLenis } from "lenis/react";
import * as React from "react";

export interface SmoothScrollProps {
  children: React.ReactNode;
  /** When true, applies smooth scrolling to the entire viewport. */
  root?: boolean;
}

export function SmoothScroll({ children, root = true }: Readonly<SmoothScrollProps>) {
  return <ReactLenis root={root}>{children}</ReactLenis>;
}
