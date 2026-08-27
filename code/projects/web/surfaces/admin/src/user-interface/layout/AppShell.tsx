import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@indiecrafts/packages-web-ui/web/sidebar";
import { Toaster } from "@indiecrafts/packages-web-ui/web/sonner";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

/** The dashboard shell every `(dashboard)` page renders inside: sidebar + sticky header. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset id="main" tabIndex={-1}>
        <AppHeader />
        {children}
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
