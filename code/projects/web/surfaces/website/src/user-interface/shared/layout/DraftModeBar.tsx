"use client";

/**
 * Show an "exit preview" bar when draft mode is on outside the Studio.
 *
 * @see docs/reference/projects/web/website/src/user-interface/shared/layout/DraftModeBar.md
 */

import { useIsPresentationTool } from "next-sanity/hooks";

/**
 * The draft-mode cookie outlives the Studio tab, so an editor can land on the
 * public site and see drafts as if they were live. This bar says so and links
 * to `/api/draft-mode/disable`. Inside the Studio's preview iframe the Studio
 * has its own control, so the bar stays hidden there.
 */
export function DraftModeBar({ label, exit }: { label: string; exit: string }) {
  const inPresentation = useIsPresentationTool();
  if (inPresentation !== false) return null;
  return (
    <div
      role="status"
      data-bottom-bar
      className="bg-foreground text-background fixed inset-x-0 bottom-0 z-50 flex min-h-14 flex-wrap items-center justify-center gap-3 px-4 py-2 text-sm"
    >
      <span>{label}</span>
      {/* An API route that clears a cookie: a full page load, never a client transition. */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- see above */}
      <a
        href="/api/draft-mode/disable"
        className="focus-visible:ring-ring rounded-sm font-medium underline underline-offset-4 focus-visible:ring-2 focus-visible:outline-none"
      >
        {exit}
      </a>
    </div>
  );
}
