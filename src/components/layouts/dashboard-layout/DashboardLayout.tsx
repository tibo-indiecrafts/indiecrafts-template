import type { ReactNode } from "react";
import { Sidebar07 } from "@/components/layouts/dashboard-layout/sidebars/sidebar-07";
import { DashboardHeader } from "@/components/ui-molecules/dashboard/header";
import { SkipLink } from "@/components/layouts/_shared/skip-link";
import { SiteFooter } from "@/components/layouts/default-layout/site-footer";
import { SidebarProvider } from "@/components/ui-primitives/sidebar";
import type { LayoutProps } from "../registry";

export function DashboardLayout({ children, footer = true }: LayoutProps) {
  return (
    <>
      <SkipLink />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <Sidebar07 variant="inset" />
        <div
          data-slot="sidebar-inset"
          className="bg-background relative flex w-full flex-1 flex-col md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2"
        >
          <DashboardHeader />
          <main id="main" tabIndex={-1} className="flex flex-1 flex-col outline-none">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">{children}</div>
            </div>
          </main>
          {resolveSlot(footer, <SiteFooter />)}
        </div>
      </SidebarProvider>
    </>
  );
}

function resolveSlot(value: boolean | ReactNode, fallback: ReactNode): ReactNode {
  if (value === false) return null;
  if (value === true) return fallback;
  return value;
}
