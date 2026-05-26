"use client";

import { Check } from "lucide-react";
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
import { dialog02Namespace } from "./config";
import type { DialogBlock } from "./schema";

export default function Dialog(props: Readonly<DialogBlock>) {
  const [, tr] = useScopedT(dialog02Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  return (
    <UIDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{tr(props.triggerKey, "trigger")}</Button>
      </DialogTrigger>

      <DialogContent className="flex flex-col items-center sm:max-w-sm">
        <div className="flex justify-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Check className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
        </div>

        <DialogHeader className="gap-0 text-center">
          <DialogTitle className="text-center text-balance">
            {tr(props.titleKey, "title")}
          </DialogTitle>
          <DialogDescription className="mx-auto mt-2 text-center text-pretty sm:max-w-[90%]">
            {tr(props.descriptionKey, "description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex w-full flex-col gap-2 sm:flex-row sm:gap-3">
          <DialogClose asChild>
            <Button variant="default" className="w-full sm:w-1/2">
              {tr(props.primaryCtaKey, "primaryCta")}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-1/2">
              {tr(props.secondaryCtaKey, "secondaryCta")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </UIDialog>
  );
}
