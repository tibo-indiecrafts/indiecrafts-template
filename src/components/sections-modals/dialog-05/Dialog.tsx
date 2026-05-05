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
import { useScopedT } from "@/i18n/scoped-t";
import { dialog05Namespace } from "./config";
import type { DialogBlock } from "./schema";

/**
 * Destructive confirm-by-password AlertDialog (delete workspace).
 * Sourced from `@blocks-so/dialog-05`.
 */
export default function Dialog(props: Readonly<DialogBlock>) {
  const [t, tr] = useScopedT(dialog05Namespace);
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? false);
  const [isVisible, setIsVisible] = useState(false);
  const passwordId = `${props.id}-password`;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsOpen(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{tr(props.triggerKey, "trigger")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-balance">
            {tr(props.titleKey, "title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-pretty">
            {tr(props.descriptionKey, "description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit}>
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
          <AlertDialogFooter className="mt-4">
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
