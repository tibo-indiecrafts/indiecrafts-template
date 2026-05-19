"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface BlurVignetteContextValue {
  radius: string;
  inset: string;
  transitionLength: string;
  blur: string;
}

const BlurVignetteContext = React.createContext<BlurVignetteContextValue>({
  radius: "24px",
  inset: "20px",
  transitionLength: "44px",
  blur: "6px",
});

export function useBlurVignetteContext() {
  return React.useContext(BlurVignetteContext);
}

export interface BlurVignetteProps {
  children: React.ReactNode;
  className?: string;
  radius?: string;
  inset?: string;
  transitionLength?: string;
  blur?: string;
}

export function BlurVignette({
  children,
  className,
  radius = "24px",
  inset = "20px",
  transitionLength = "44px",
  blur = "6px",
}: Readonly<BlurVignetteProps>) {
  return (
    <BlurVignetteContext.Provider value={{ radius, inset, transitionLength, blur }}>
      <div
        className={cn("relative aspect-square overflow-hidden", className)}
        style={{ borderRadius: radius }}
      >
        {children}
      </div>
    </BlurVignetteContext.Provider>
  );
}

export interface BlurVignetteArticleProps {
  children?: React.ReactNode;
  className?: string;
}

export function BlurVignetteArticle({
  children,
  className,
}: Readonly<BlurVignetteArticleProps>) {
  const { radius, inset, transitionLength, blur } = useBlurVignetteContext();

  return (
    <div
      aria-hidden="true"
      className={cn("blur-vignette pointer-events-none absolute inset-0", className)}
      style={
        {
          "--radius": radius,
          "--inset": inset,
          "--transition-length": transitionLength,
          "--blur": blur,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
