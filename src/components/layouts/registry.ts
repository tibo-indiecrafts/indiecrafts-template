/**
 * Layout registry — each page blueprint picks one via `layout: "<name>"`.
 *
 * A "layout" here is an in-page wrapper (not a Next.js file-system layout).
 * It controls the **chrome** around the composed sections: container width,
 * whether the header/footer show, sidebars, prose containers, etc.
 *
 * Each layout lives in its own folder with:
 *   ├── <Name>Layout.tsx   component
 *   └── index.ts           barrel re-export
 *
 * Add a layout in 3 steps:
 *   1. Create src/components/layouts/<Name>Layout/ with the component + index.ts.
 *      Layout-specific chrome (header, sidebar, etc.) lives INSIDE that folder
 *      as siblings; cross-layout chrome lives in src/components/layouts/_shared/.
 *   2. Register it below under a kebab-case key.
 *   3. Reference it from any page config: `layout: "<key>"`.
 */

import type { ComponentType, ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { DefaultLayout } from "./DefaultLayout";
import { FullBleedLayout } from "./FullBleedLayout";
import { ProseLayout } from "./ProseLayout";
import { SidebarLayout } from "./SidebarLayout";

export type LayoutName = "default" | "full-bleed" | "prose" | "sidebar" | "dashboard";

export type LayoutProps = Readonly<{
  children: ReactNode;
  /** Optional slot for sidebar/aside content (only used by layouts that support it) */
  aside?: ReactNode;
  /**
   * Header chrome. `true` (the layout's default), `false` (no header), or a
   * custom `ReactNode` to render in place of the default. Layouts pick their
   * own default — DefaultLayout/Prose/Sidebar default to `true` (SiteHeader),
   * FullBleedLayout defaults to `false`, DashboardLayout uses DashboardHeader.
   */
  header?: boolean | ReactNode;
  /** Same shape as `header` but for the footer slot. */
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
