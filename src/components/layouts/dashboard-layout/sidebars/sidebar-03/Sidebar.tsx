"use client";

import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui-primitives/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Activity,
  DollarSign,
  Home,
  Infinity,
  LinkIcon,
  Package2,
  Percent,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { useScopedT } from "@/i18n/scoped-t";
import { LogoIcon } from "@/components/layouts/_shared/logo";
import { sidebar03Namespace, sidebar03Notifications } from "./config";
import type { Route } from "@/components/ui-molecules/nav/main/grouped";
import DashboardNavigation from "@/components/ui-molecules/nav/main/grouped";
import { NavNotifications } from "@/components/ui-molecules/nav/notifications";
import { TeamSwitcherGrouped } from "@/components/ui-molecules/team-switcher/grouped";

const dashboardRoutes: Route[] = [
  {
    id: "home",
    icon: <Home className="size-4" />,
    link: "#",
  },
  {
    id: "products",
    icon: <Package2 className="size-4" />,
    link: "#",
    subs: [
      { id: "catalogue", link: "#", icon: <Package2 className="size-4" /> },
      { id: "checkout-links", link: "#", icon: <LinkIcon className="size-4" /> },
      { id: "discounts", link: "#", icon: <Percent className="size-4" /> },
    ],
  },
  {
    id: "usage-billing",
    icon: <PieChart className="size-4" />,
    link: "#",
    subs: [
      { id: "meters", link: "#", icon: <PieChart className="size-4" /> },
      { id: "events", link: "#", icon: <Activity className="size-4" /> },
    ],
  },
  {
    id: "benefits",
    icon: <Sparkles className="size-4" />,
    link: "#",
  },
  {
    id: "customers",
    icon: <Users className="size-4" />,
    link: "#",
  },
  {
    id: "sales",
    icon: <ShoppingBag className="size-4" />,
    link: "#",
    subs: [
      { id: "orders", link: "#", icon: <ShoppingBag className="size-4" /> },
      { id: "subscriptions", link: "#", icon: <Infinity className="size-4" /> },
    ],
  },
  {
    id: "storefront",
    icon: <Store className="size-4" />,
    link: "#",
  },
  {
    id: "analytics",
    icon: <TrendingUp className="size-4" />,
    link: "#",
  },
  {
    id: "finance",
    icon: <DollarSign className="size-4" />,
    link: "#",
    subs: [
      { id: "incoming", link: "#" },
      { id: "outgoing", link: "#" },
      { id: "payout-account", link: "#" },
    ],
  },
  {
    id: "settings",
    icon: <Settings className="size-4" />,
    link: "#",
    subs: [
      { id: "general", link: "#" },
      { id: "webhooks", link: "#" },
      { id: "custom-fields", link: "#" },
    ],
  },
];

const teams = [
  { id: "alpha-inc", logo: LogoIcon, planKey: "free" },
  { id: "beta-corp", logo: LogoIcon, planKey: "free" },
  { id: "gamma-tech", logo: LogoIcon, planKey: "free" },
];

const brandHref = "#";

export default function Sidebar() {
  const [t] = useScopedT(sidebar03Namespace);
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <UISidebar variant="floating" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between",
        )}
      >
        <a href={brandHref} className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">{t("brand")}</span>
          )}
        </a>

        <motion.div
          key={isCollapsed ? "header-collapsed" : "header-expanded"}
          className={cn(
            "flex items-center gap-2",
            isCollapsed ? "flex-row md:flex-col-reverse" : "flex-row",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <NavNotifications
            notifications={sidebar03Notifications}
            namespace={sidebar03Namespace}
          />
          <SidebarTrigger />
        </motion.div>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} namespace={sidebar03Namespace} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <TeamSwitcherGrouped teams={teams} namespace={sidebar03Namespace} />
      </SidebarFooter>
    </UISidebar>
  );
}
