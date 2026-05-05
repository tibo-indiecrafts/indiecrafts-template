"use client";

import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog as UIDialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { Switch } from "@/components/ui-primitives/switch";
import { useScopedT } from "@/i18n/scoped-t";
import { dialog06Namespace } from "./config";
import type { DialogBlock } from "./schema";

/**
 * Create-workspace modal — title + description + name field + private
 * toggle panel below. Sourced from `@blocks-so/dialog-06`.
 */
export default function Dialog(props: Readonly<DialogBlock>) {
  const [t, tr] = useScopedT(dialog06Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const nameId = `${props.id}-workspace-name`;
  const privateId = `${props.id}-private`;

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{tr(props.triggerKey, "trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="p-0 sm:max-w-lg">
        <DialogHeader className="px-6 pt-4">
          <DialogTitle className="text-foreground text-lg font-semibold text-balance">
            {tr(props.titleKey, "title")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-2 text-sm leading-6 text-pretty">
            {tr(props.descriptionKey, "description")}
          </DialogDescription>
        </DialogHeader>

        <form action="#" method="POST">
          <div className="px-6 pb-4">
            <Label htmlFor={nameId} className="text-sm font-medium">
              {tr(props.nameLabelKey, "nameLabel")}
              <span className="text-destructive">{t("nameRequired")}</span>
            </Label>
            <Input
              type="text"
              id={nameId}
              name="workspace-name"
              placeholder={tr(props.namePlaceholderKey, "namePlaceholder")}
              className="mt-2"
              required
            />
            <Button type="submit" className="mt-4 w-full">
              {tr(props.submitKey, "submit")}
            </Button>
          </div>
          <div className="bg-muted rounded-b-md border-t px-6 py-4">
            <div className="flex items-start space-x-3">
              <div className="mt-1 pt-0.5">
                <Switch id={privateId} name="private" />
              </div>
              <div>
                <Label htmlFor={privateId} className="text-sm font-medium">
                  {tr(props.privateLabelKey, "privateLabel")}
                </Label>
                <p className="text-muted-foreground text-sm text-pretty">
                  {tr(props.privateDescriptionKey, "privateDescription")}
                </p>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </UIDialog>
  );
}
