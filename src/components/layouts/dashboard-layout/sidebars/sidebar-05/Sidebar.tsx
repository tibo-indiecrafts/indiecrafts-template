"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui-primitives/sidebar";
import { cn } from "@/lib/utils";
import {
  IconActivityHeartbeat,
  IconArchive,
  IconBackground,
  IconBellRinging,
  IconBrandGoogle,
  IconBrandMeta,
  IconBrandNpm,
  IconBrandOpenai,
  IconBug,
  IconChartBar,
  IconChevronRight,
  IconCloud,
  IconDatabase,
  IconFileText,
  IconFolder,
  IconFolders,
  IconGitCommit,
  IconGitMerge,
  IconGitPullRequest,
  IconHome,
  IconKey,
  IconLockExclamation,
  IconLockPassword,
  IconLogout,
  IconNorthStar,
  IconPackageExport,
  IconPackages,
  IconPasswordFingerprint,
  IconPlayerPlay,
  IconScanEye,
  IconSettings,
  IconShieldLock,
  IconStar,
  IconTarget,
  IconTerminal2,
  IconUser,
  IconUserPlus,
  IconWebhook,
  IconX,
} from "@tabler/icons-react";
import type React from "react";
import { useState } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import { sidebar05Namespace, sidebar05UserAvatarSrc } from "./config";
import { TeamSwitcherToggle } from "@/components/ui-molecules/team-switcher/toggle";

const data = {
  teams: [
    { id: "openai", logo: IconBrandOpenai },
    { id: "anthropic", logo: IconNorthStar },
    { id: "google", logo: IconBrandGoogle },
    { id: "meta", logo: IconBrandMeta },
  ],
};

interface SidebarItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  hasSubItems?: boolean;
  route?: string;
  subItems?: {
    id: string;
    icon: React.ComponentType<{ className?: string }>;
    route?: string;
  }[];
}

const sidebarItems: SidebarItem[] = [
  {
    id: "overview",
    icon: IconHome,
    hasSubItems: true,
    subItems: [
      { id: "dashboard", icon: IconChartBar, route: "/overview/dashboard" },
      { id: "activity", icon: IconActivityHeartbeat, route: "/overview/activity" },
      { id: "insights", icon: IconTarget, route: "/overview/insights" },
    ],
  },
  {
    id: "repositories",
    icon: IconFolders,
    badge: "12",
    hasSubItems: true,
    subItems: [
      { id: "all-repos", icon: IconFolder, route: "/repositories" },
      { id: "starred", icon: IconStar, route: "/repositories/starred" },
      { id: "archived", icon: IconArchive, route: "/repositories/archived" },
    ],
  },
  {
    id: "pull-requests",
    icon: IconGitPullRequest,
    badge: "3",
    hasSubItems: true,
    subItems: [
      { id: "open-prs", icon: IconGitPullRequest, route: "/pull-requests/open" },
      { id: "review-requests", icon: IconScanEye, route: "/pull-requests/review" },
      { id: "merged", icon: IconGitMerge, route: "/pull-requests/merged" },
    ],
  },
  {
    id: "issues",
    icon: IconBug,
    badge: "7",
    hasSubItems: true,
    subItems: [
      { id: "open-issues", icon: IconBug, route: "/issues/open" },
      { id: "assigned", icon: IconUserPlus, route: "/issues/assigned" },
      { id: "created", icon: IconGitCommit, route: "/issues/created" },
    ],
  },
  {
    id: "actions",
    icon: IconBackground,
    hasSubItems: true,
    subItems: [
      { id: "workflows", icon: IconPlayerPlay, route: "/actions/workflows" },
      { id: "runners", icon: IconTerminal2, route: "/actions/runners" },
      { id: "deployments", icon: IconCloud, route: "/actions/deployments" },
    ],
  },
  {
    id: "packages",
    icon: IconPackages,
    hasSubItems: true,
    subItems: [
      { id: "published", icon: IconPackageExport, route: "/packages/published" },
      { id: "container-registry", icon: IconDatabase, route: "/packages/containers" },
      { id: "npm-packages", icon: IconBrandNpm, route: "/packages/npm" },
    ],
  },
  {
    id: "security",
    icon: IconLockPassword,
    badge: "2",
    hasSubItems: true,
    subItems: [
      { id: "alerts", icon: IconLockExclamation, route: "/security/alerts" },
      { id: "advisories", icon: IconShieldLock, route: "/security/advisories" },
      { id: "secrets", icon: IconPasswordFingerprint, route: "/security/secrets" },
    ],
  },
  {
    id: "settings",
    icon: IconSettings,
    hasSubItems: true,
    subItems: [
      { id: "profile", icon: IconUser, route: "/settings/profile" },
      { id: "notifications", icon: IconBellRinging, route: "/settings/notifications" },
      { id: "webhooks", icon: IconWebhook, route: "/settings/webhooks" },
      { id: "api-keys", icon: IconKey, route: "/settings/api-keys" },
    ],
  },
  {
    id: "docs",
    icon: IconFileText,
    hasSubItems: false,
    route: "/docs",
  },
];

export default function Sidebar() {
  const [t] = useScopedT(sidebar05Namespace);
  const [activeItem, setActiveItem] = useState<string | null>("overview");
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  const activeItemData = sidebarItems.find((item) => item.id === activeItem);

  const handleItemClick = (item: SidebarItem) => {
    if (item.hasSubItems) {
      const isActive = activeItem === item.id;
      setActiveItem(isActive ? null : item.id);
      if (isActive) {
        setSelectedSubItem(null);
      }
    } else {
      if (activeItem) {
        setActiveItem(null);
        setSelectedSubItem(null);
      }
    }
  };

  const handleSubItemClick = (subItem: { id: string; route?: string }) => {
    setSelectedSubItem(selectedSubItem === subItem.id ? null : subItem.id);
  };

  return (
    <div className="bg-background flex h-dvh">
      <UISidebar
        side="left"
        variant="sidebar"
        collapsible="none"
        className="w-64 border-r"
      >
        <SidebarHeader>
          <TeamSwitcherToggle teams={data.teams} namespace={sidebar05Namespace} />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  const chevronIndicator = (
                    <IconChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform",
                        isActive && "rotate-90",
                      )}
                    />
                  );

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        className="h-10 w-full px-3"
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <Icon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{t(`items.${item.id}.label`)}</span>
                        </div>
                        <div className="ml-auto flex min-w-fit shrink-0 items-center gap-1">
                          {(item.badge || item.hasSubItems) &&
                            (item.badge ? (
                              <SidebarMenuBadge
                                className={cn("min-w-fit", item.hasSubItems && "gap-x-3")}
                              >
                                {item.badge}
                                {item.hasSubItems && chevronIndicator}
                              </SidebarMenuBadge>
                            ) : (
                              chevronIndicator
                            ))}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton className="h-12 w-full px-3">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src={sidebar05UserAvatarSrc} alt={t("user.name")} />
                    <AvatarFallback className="rounded-full">
                      {t("user.fallback")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="truncate text-sm font-medium">{t("user.name")}</div>
                    <div className="text-muted-foreground truncate text-xs">
                      {t("user.email")}
                    </div>
                  </div>
                </div>
                <IconLogout className="h-4 w-4 shrink-0" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </UISidebar>

      {activeItem && activeItemData?.subItems && (
        <UISidebar
          side="left"
          variant="sidebar"
          collapsible="none"
          className="animate-in slide-in-from-left-5 w-72 border-r duration-200"
        >
          <SidebarHeader className="flex flex-row items-center justify-between border-b px-4">
            <h3 className="font-medium">{t(`items.${activeItemData.id}.label`)}</h3>
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              aria-label={t("closePanel")}
              className="hover:bg-sidebar-accent flex h-6 w-6 items-center justify-center rounded-md p-0"
            >
              <IconX className="h-4 w-4" aria-hidden="true" />
            </button>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {activeItemData.subItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSelected = selectedSubItem === subItem.id;

                    return (
                      <SidebarMenuItem key={subItem.id}>
                        <SidebarMenuButton
                          isActive={isSelected}
                          className="h-auto w-full justify-start gap-3 px-3 py-2"
                          onClick={() => handleSubItemClick(subItem)}
                        >
                          <SubIcon className="mt-0.5 h-5 w-5 shrink-0 self-start" />

                          <div className="min-w-0 flex-1 text-left">
                            <div className="font-medium">
                              {t(`subItems.${subItem.id}.label`)}
                            </div>
                            <div className="text-muted-foreground mt-0.5 text-xs">
                              {t(`subItems.${subItem.id}.description`)}
                            </div>
                          </div>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </UISidebar>
      )}
    </div>
  );
}
