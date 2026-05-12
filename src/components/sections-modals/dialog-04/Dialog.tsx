"use client";

import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog as UIDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/i18n/scoped-t";
import { dialog04Namespace } from "./config";
import type { DialogBlock } from "./schema";

export default function Dialog(props: Readonly<DialogBlock>) {
  const [, tr] = useScopedT(dialog04Namespace);
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);
  const usernameId = `${props.id}-username`;

  return (
    <UIDialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-center py-36">
        <DialogTrigger asChild>
          <Button>{tr(props.triggerKey, "trigger")}</Button>
        </DialogTrigger>
      </div>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{tr(props.titleKey, "title")}</DialogTitle>
          <DialogDescription>{tr(props.descriptionKey, "description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor={usernameId} className="text-sm font-medium">
            {tr(props.usernameLabelKey, "usernameLabel")}
          </Label>
          <Input
            id={usernameId}
            name="username"
            type="text"
            placeholder={tr(props.usernamePlaceholderKey, "usernamePlaceholder")}
          />
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">
            {tr(props.submitKey, "submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}
