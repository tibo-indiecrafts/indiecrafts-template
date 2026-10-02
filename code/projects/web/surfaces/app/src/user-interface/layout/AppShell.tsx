/**
 * Wrap every app-group page in the sidebar and sticky-header shell.
 *
 * @see docs/reference/projects/web/app/src/user-interface/layout/AppShell.md
 */
import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@indiecrafts/packages-web-ui/web/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { AnnouncementChrome } from "@/user-interface/AnnouncementChrome";

/** The app shell every `(app)` page renders inside: sidebar + sticky header, then the
 *  signed-in announcement bar + card under it.
 *  `<Toaster>` lives at `[locale]/layout.tsx` (covers sign-in too), not here. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* min-w-0: as a flex item `main` would otherwise grow to its widest child (Clerk's
          account card) and push the page wider than the screen next to the sidebar. */}
      <SidebarInset id="main" tabIndex={-1} className="min-w-0">
        <AppHeader />
        {/* Under the navbar: the announcement bar, then the card (Clerk-gated: it reads
            `useAuth`, so it mounts only when Clerk is configured). */}
        {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? <AnnouncementChrome /> : null}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
