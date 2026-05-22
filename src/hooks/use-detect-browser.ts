"use client";

import * as React from "react";

export type BrowserName =
  | "Chrome"
  | "Safari"
  | "Firefox"
  | "Edge"
  | "Opera"
  | "Unknown";

function detect(): BrowserName {
  if (typeof navigator === "undefined") return "Unknown";
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua) || /Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Edg\//.test(ua)) return "Chrome";
  if (/^((?!chrome|android).)*safari/i.test(ua)) return "Safari";
  if (/Firefox\//.test(ua)) return "Firefox";
  return "Unknown";
}

export function useDetectBrowser(): BrowserName {
  // SSR returns "Unknown"; the effect syncs the real UA after hydration.
  const [name, setName] = React.useState<BrowserName>("Unknown");
  React.useEffect(() => {
    setName(detect());
  }, []);
  return name;
}
