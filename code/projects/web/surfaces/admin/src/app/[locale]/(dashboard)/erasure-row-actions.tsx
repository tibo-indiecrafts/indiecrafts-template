"use client";

/**
 * Render the admin actions on one open erasure request: retry it, or close it by hand.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/erasure-row-actions.md
 */

import { useState, useTransition } from "react";
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

  const retry = () =>
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

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {status === "confirmed" ? (
          <Button size="sm" variant="outline" disabled={pending || (needEmail && !email.trim())} onClick={retry}>
            {t("retry")}
          </Button>
        ) : null}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost" disabled={pending}>
              {t("close")}
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
            id={`retry-email-${id}`}
            type="email"
            autoComplete="off"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      ) : null}
    </div>
  );
}
