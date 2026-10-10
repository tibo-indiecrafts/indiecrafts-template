"use client";

/**
 * Render the admin actions on one open erasure request: retry it, or close it by hand.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/erasure-row-actions.md
 */

import { useEffect, useRef, useState, useTransition, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@indiecrafts/packages-web-ui/web/button";
import { Input } from "@indiecrafts/packages-web-ui/web/input";
import { Label } from "@indiecrafts/packages-web-ui/web/label";
import { Textarea } from "@indiecrafts/packages-web-ui/web/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@indiecrafts/packages-web-ui/web/dialog";
import { useRouter } from "@/i18n/routing";
import { closeErasure, retryErasure } from "./monitoring-actions";

/** Retry (only a stuck `confirmed` request) + Close manually (any open request). The retry
 *  asks for the subject's email only when the api can't read it from Clerk; the typed email
 *  goes to the server action once and is never kept. */
export function ErasureRowActions({ id, status }: { id: number; status: string }) {
  const t = useTranslations("admin.erasure.actions");
  const router = useRouter();
  const [pending, start] = useTransition();
  const [needEmail, setNeedEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [open, setOpen] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);

  // Move focus to the email field the moment the api asks for it.
  useEffect(() => {
    if (needEmail) emailRef.current?.focus();
  }, [needEmail]);

  const retry = (e: FormEvent) => {
    e.preventDefault();
    start(async () => {
      const r = await retryErasure(id, needEmail ? email : undefined);
      if (r.ok) {
        toast.success(t(r.outcome === "completed" ? "retryDone" : "retryPartial"));
        setNeedEmail(false);
        setEmail("");
        router.refresh();
      } else if (r.error === "email_required") {
        setNeedEmail(true);
        toast.info(t("emailRequired"));
      } else toast.error(t(`errors.${r.error}`));
    });
  };

  const close = () =>
    start(async () => {
      const r = await closeErasure(id, note);
      if (r.ok) {
        toast.success(t("closeDone"));
        setOpen(false);
        setNote("");
        router.refresh();
      } else toast.error(t(`errors.${r.error}`));
    });

  const noteOk = note.trim().length >= 5 && note.trim().length <= 500;
  // Each row repeats the same two buttons — the hidden suffix tells a screen reader which request.
  const which = <span className="sr-only">{t("rowSuffix", { id })}</span>;

  // A form so Enter in the email field retries (the Close button is type="button").
  return (
    <form className="flex flex-col items-start gap-2" onSubmit={retry}>
      <div className="flex flex-wrap gap-2">
        {status === "confirmed" ? (
          <Button
            type="submit"
            size="sm"
            variant="outline"
            disabled={pending || (needEmail && !email.trim())}
          >
            {t("retry")} {which}
          </Button>
        ) : null}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button" size="sm" variant="ghost" disabled={pending}>
              {t("close")} {which}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("closeTitle", { id })}</DialogTitle>
              <DialogDescription>{t("closeDescription")}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`close-note-${id}`}>{t("noteLabel")}</Label>
              <Textarea
                id={`close-note-${id}`}
                value={note}
                maxLength={500}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("notePlaceholder")}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{t("cancel")}</Button>
              </DialogClose>
              <Button variant="destructive" disabled={pending || !noteOk} onClick={close}>
                {t("closeConfirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {needEmail ? (
        <div className="flex w-full max-w-xs flex-col gap-1">
          <Label htmlFor={`retry-email-${id}`}>{t("emailLabel")}</Label>
          <Input
            ref={emailRef}
            id={`retry-email-${id}`}
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      ) : null}
    </form>
  );
}
