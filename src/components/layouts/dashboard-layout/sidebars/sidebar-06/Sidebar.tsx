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
  IconArrowLeft,
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
} from "@tabler/icons-react";
import type React from "react";
import { useState } from "react";
import { useScopedT } from "@/i18n/scoped-t";
import { sidebar06Namespace, sidebar06UserAvatarSrc } from "./config";
import { SidebarTeamSwitcherToggle } from "@/components/ui-molecules/sidebar/team-switcher/toggle";

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
  const [t] = useScopedT(sidebar06Namespace);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [selectedSubItem, setSelectedSubItem] = useState<string | null>(null);

  const activeItemData = sidebarItems.find((item) => item.id === activeItem);

  const handleItemClick = (item: SidebarItem) => {
    if (item.hasSubItems) {
      setActiveItem(item.id);
      setSelectedSubItem(null);
    }
  };

  const handleSubItemClick = (subItem: { id: string; route?: string }) => {
    setSelectedSubItem(selectedSubItem === subItem.id ? null : subItem.id);
  };

  const handleBackToMain = () => {
    setActiveItem(null);
    setSelectedSubItem(null);
  };

  return (
    <div className="bg-background flex h-dvh">
      <UISidebar
        side="left"
        variant="sidebar"
        collapsible="none"
        className="w-64 border-r"
      >
        {!activeItem ? (
          <>
            <SidebarHeader>
              <SidebarTeamSwitcherToggle
                teams={data.teams}
                namespace={sidebar06Namespace}
              />
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      const chevronIndicator = (
                        <IconChevronRight className="h-4 w-4 shrink-0 transition-transform" />
                      );

                      return (
                        <SidebarMenuItem key={item.id}>
                          <SidebarMenuButton
                            className="h-10 w-full px-3"
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="truncate">{t(`items.${item.id}`)}</span>
                            </div>
                            <div className="ml-auto flex min-w-fit shrink-0 items-center gap-1">
                              {(item.badge || item.hasSubItems) &&
                                (item.badge ? (
                                  <SidebarMenuBadge
                                    className={cn(
                                      "min-w-fit",
                                      item.hasSubItems && "gap-x-3",
                                    )}
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
                        <AvatarImage src={sidebar06UserAvatarSrc} alt={t("user.name")} />
                        <AvatarFallback className="rounded-full">
                          {t("user.fallback")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 text-left">
                        <div className="truncate text-sm font-medium">
                          {t("user.name")}
                        </div>
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
          </>
        ) : (
          activeItemData?.subItems && (
            <>
              <SidebarHeader className="flex flex-row items-center justify-between border-b px-4">
                <button
                  type="button"
                  onClick={handleBackToMain}
                  aria-label={t("back")}
                  className="hover:bg-sidebar-accent flex h-8 w-8 items-center justify-center rounded-md p-0"
                >
                  <IconArrowLeft className="h-4 w-4" aria-hidden="true" />
                </button>
                <h3 className="flex-1 text-center font-medium">
                  {t(`items.${activeItemData.id}`)}
                </h3>
                <div className="w-8" />
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
                              className="h-10 w-full px-3"
                              onClick={() => handleSubItemClick(subItem)}
                            >
                              <div className="flex min-w-0 flex-1 items-center gap-3">
                                <SubIcon className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                  {t(`subItems.${subItem.id}`)}
                                </span>
                              </div>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </>
          )
        )}
      </UISidebar>
    </div>
  );
}
