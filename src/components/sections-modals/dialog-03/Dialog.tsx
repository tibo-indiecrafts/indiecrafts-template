"use client";

import { AlertTriangleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui-primitives/button";
import {
  Dialog as UIDialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui-primitives/dialog";
import { useScopedT } from "@/components/_lib/scoped-t";
import { dialog03Namespace } from "./config";
import type { DialogBlock } from "./schema";

export default function Dialog(props: Readonly<DialogBlock>) {
  const [, tr] = useScopedT(dialog03Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">{tr(props.triggerKey, "trigger")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <div className="flex items-start space-x-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <DialogHeader>
            <DialogTitle>{tr(props.titleKey, "title")}</DialogTitle>
            <DialogDescription>
              {tr(props.descriptionKey, "description")}
            </DialogDescription>
          </DialogHeader>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{tr(props.cancelKey, "cancel")}</Button>
          </DialogClose>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            {tr(props.confirmKey, "confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}
