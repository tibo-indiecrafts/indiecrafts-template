"use client";

import { AppWindowIcon as Apps } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog as UIDialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { Label } from "@/components/ui-primitives/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui-primitives/select";
import { Separator } from "@/components/ui-primitives/separator";
import { dialog11Namespace } from "./config";
import type { DialogBlock } from "./schema";

const FRAMEWORKS = ["react", "vue", "angular", "svelte", "vanilla"] as const;
const PACKAGE_MANAGERS = ["npm", "yarn", "pnpm", "bun"] as const;
const LINTERS = [
  "eslint-prettier",
  "eslint",
  "prettier",
  "biome",
  "oxlint",
  "none",
] as const;
const TESTERS = ["jest", "vitest", "cypress", "none"] as const;

export default function Dialog(props: Readonly<DialogBlock>) {
  const t = useTranslations(dialog11Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const frameworkId = `${props.id}-framework`;
  const packageManagerId = `${props.id}-package-manager`;
  const linterId = `${props.id}-linter`;
  const testingId = `${props.id}-testing`;

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="gap-0 overflow-visible p-0 sm:max-w-2xl">
        <DialogHeader className="mb-0 border-b px-6 py-4">
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>

        <form action="#" method="POST">
          <div className="flex flex-col-reverse md:flex-row">
            <div className="flex flex-col justify-between md:w-80 md:border-r">
              <div className="grow">
                <div className="border-t p-6 md:border-none">
                  <div className="flex items-center space-x-3">
                    <div className="bg-muted inline-flex shrink-0 items-center justify-center rounded-sm p-3">
                      <Apps className="text-foreground size-5" aria-hidden="true" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-foreground text-sm font-medium text-balance">
                        {t("starterTitle")}
                      </h3>
                      <p className="text-muted-foreground text-sm text-pretty">
                        {t("starterSubtitle")}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <h4 className="text-foreground text-sm font-medium text-balance">
                    {t("descriptionHeading")}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
                    {t("descriptionBody")}
                  </p>
                  <h4 className="text-foreground mt-6 text-sm font-medium text-balance">
                    {t("infoHeading")}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm leading-6 text-pretty">
                    {t("infoBody")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between border-t p-4">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    {t("cancel")}
                  </Button>
                </DialogClose>
                <Button type="submit" size="sm">
                  {t("submit")}
                </Button>
              </div>
            </div>

            <div className="flex-1 space-y-6 p-6 md:px-6 md:pt-6 md:pb-8">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-muted text-foreground inline-flex size-6 items-center justify-center rounded-sm text-sm">
                    1
                  </div>
                  <Label
                    htmlFor={frameworkId}
                    className="text-foreground text-sm font-medium"
                  >
                    {t("frameworkLabel")}
                  </Label>
                </div>
                <Select defaultValue="react" name="framework">
                  <SelectTrigger id={frameworkId} className="w-full">
                    <SelectValue placeholder={t("frameworkPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {FRAMEWORKS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`frameworks.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="bg-muted text-foreground inline-flex size-6 items-center justify-center rounded-sm text-sm">
                    2
                  </div>
                  <Label
                    htmlFor={packageManagerId}
                    className="text-foreground text-sm font-medium"
                  >
                    {t("packageManagerLabel")}
                  </Label>
                </div>
                <Select defaultValue="npm" name="package-manager">
                  <SelectTrigger id={packageManagerId} className="w-full">
                    <SelectValue placeholder={t("packageManagerPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PACKAGE_MANAGERS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`packageManagers.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center space-x-3">
                  <div className="bg-muted text-foreground inline-flex size-6 items-center justify-center rounded-sm text-sm">
                    3
                  </div>
                  <Label
                    htmlFor={linterId}
                    className="text-foreground text-sm font-medium"
                  >
                    {t("linterLabel")}
                  </Label>
                </div>
                <p className="text-muted-foreground mt-1 text-xs text-pretty">
                  {t("linterHelp")}
                </p>
                <Select defaultValue="eslint-prettier" name="linter">
                  <SelectTrigger id={linterId} className="mt-4 w-full">
                    <SelectValue placeholder={t("linterPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {LINTERS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`linters.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center space-x-3">
                  <div className="bg-muted text-foreground inline-flex size-6 items-center justify-center rounded-sm text-sm">
                    4
                  </div>
                  <Label
                    htmlFor={testingId}
                    className="text-foreground text-sm font-medium"
                  >
                    {t("testingLabel")}
                  </Label>
                </div>
                <p className="text-muted-foreground mt-1 text-xs text-pretty">
                  {t("testingHelp")}
                </p>
                <Select defaultValue="jest" name="testing-tool">
                  <SelectTrigger id={testingId} className="mt-4 w-full">
                    <SelectValue placeholder={t("testingPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {TESTERS.map((value) => (
                      <SelectItem key={value} value={value}>
                        {t(`testers.${value}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </UIDialog>
  );
}
