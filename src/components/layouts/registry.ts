import type { ComponentType, ReactNode } from "react";
import { DashboardLayout } from "./dashboard-layout";
import { DefaultLayout } from "./default-layout";
import { FullBleedLayout } from "./full-bleed-layout";
import { ProseLayout } from "./prose-layout";
import { SidebarLayout } from "./sidebar-layout";

export type LayoutName = "default" | "full-bleed" | "prose" | "sidebar" | "dashboard";

export type LayoutProps = Readonly<{
  children: ReactNode;

  aside?: ReactNode;

  header?: boolean | ReactNode;

  footer?: boolean | ReactNode;
}>;

export const layoutRegistry: Record<LayoutName, ComponentType<LayoutProps>> = {
  default: DefaultLayout,
  "full-bleed": FullBleedLayout,
  prose: ProseLayout,
  sidebar: SidebarLayout,
  dashboard: DashboardLayout,
};

export const DEFAULT_LAYOUT: LayoutName = "default";
