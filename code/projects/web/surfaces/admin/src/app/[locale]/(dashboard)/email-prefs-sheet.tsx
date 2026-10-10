"use client";

/**
 * One account's email side sheet: its preferences (off only) and its sign-in email.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/email-prefs-sheet.md
 */
import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@indiecrafts/packages-web-ui/web/sheet";
import { useRouter } from "@/i18n/routing";
import type { EmailPrefState } from "@/lib/email-preferences";
import { EmailPrefsPanel } from "./email-prefs-panel";
import { SignInEmailForm } from "./sign-in-email-form";

/** Opened by `?emails=<userId>` on the users page; closing it drops the query. `state` is
 *  `null` when the api could not be read (shown as an error, never as "no preferences"). */
export function EmailPrefsSheet({
  userId,
  email,
  state,
  closeHref,
}: {
  userId: string;
  email: string;
  state: EmailPrefState | null;
  closeHref: string;
}) {
  const t = useTranslations("admin.emails");
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) router.replace(closeHref);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description", { email })}</SheetDescription>
        </SheetHeader>
        <div className="space-y-8 px-4 pb-6">
          {state === null ? (
            <p role="alert" className="text-destructive text-sm">
              {t("loadError")}
            </p>
          ) : (
            <EmailPrefsPanel state={state} />
          )}
          <section aria-labelledby="sign-in-email" className="space-y-3">
            <h3 id="sign-in-email" className="text-sm font-semibold">
              {t("signIn.title")}
            </h3>
            <SignInEmailForm userId={userId} current={email} />
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
