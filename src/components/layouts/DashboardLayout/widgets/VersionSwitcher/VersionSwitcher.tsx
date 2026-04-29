"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, GalleryVerticalEnd } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui-primitives/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui-primitives/sidebar";
import { versionSwitcherNamespace } from "./config";

export type VersionSwitcherProps = {
  versions: string[];
  defaultVersion: string;
};

export function VersionSwitcher({ versions, defaultVersion }: VersionSwitcherProps) {
  const t = useTranslations(versionSwitcherNamespace);
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <GalleryVerticalEnd className="size-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-medium">{t("brandLabel")}</span>
                <span>
                  {t("versionPrefix")}
                  {selectedVersion}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" aria-hidden="true" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width)"
            align="start"
          >
            {versions.map((version) => (
              <DropdownMenuItem
                key={version}
                onSelect={() => setSelectedVersion(version)}
              >
                {t("versionPrefix")}
                {version}{" "}
                {version === selectedVersion && (
                  <Check className="ml-auto" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
