"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui-primitives/alert-dialog";
import { Button } from "@/components/ui-primitives/button";
import { Input } from "@/components/ui-primitives/input";
import { Label } from "@/components/ui-primitives/label";
import { useScopedT } from "@/components/_lib/scoped-t";
import { dialog07Namespace } from "./config";
import type { DialogBlock } from "./schema";

export default function Dialog(props: Readonly<DialogBlock>) {
  const [t, tr] = useScopedT(dialog07Namespace);
  const [open, setOpen] = useState(props.defaultOpen ?? false);
  const [isVisible, setIsVisible] = useState(false);
  const emailId = `${props.id}-email`;
  const passwordId = `${props.id}-password`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{tr(props.triggerKey, "trigger")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            {tr(props.titleKey, "title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {tr(props.descriptionKey, "description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor={emailId} className="text-sm font-medium">
              {tr(props.emailLabelKey, "emailLabel")}
            </Label>
            <Input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={props.email}
              className="mt-2"
              disabled
            />
          </div>
          <div>
            <Label htmlFor={passwordId} className="text-sm font-medium">
              {tr(props.passwordLabelKey, "passwordLabel")}
            </Label>
            <div className="relative mt-2">
              <Input
                id={passwordId}
                name="password"
                type={isVisible ? "text" : "password"}
                autoComplete="current-password"
                placeholder={tr(props.passwordPlaceholderKey, "passwordPlaceholder")}
                className="pe-9"
                required
              />
              <button
                className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md"
                type="button"
                onClick={() => setIsVisible((v) => !v)}
                aria-label={isVisible ? t("hidePassword") : t("showPassword")}
                aria-pressed={isVisible}
                aria-controls={passwordId}
              >
                {isVisible ? (
                  <EyeOffIcon size={16} aria-hidden="true" />
                ) : (
                  <EyeIcon size={16} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>{tr(props.cancelKey, "cancel")}</AlertDialogCancel>
            <Button type="submit" variant="destructive">
              {tr(props.confirmKey, "confirm")}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
