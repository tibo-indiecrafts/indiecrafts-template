"use client";

/**
 * Render one data request in a side sheet: the request, its deadline, its history, the moves.
 *
 * @see docs/reference/projects/web/admin/src/app/locale/(dashboard)/data-request-sheet.md
 */

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@indiecrafts/packages-web-ui/web/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@indiecrafts/packages-web-ui/web/sheet";
import { useRouter } from "@/i18n/routing";
import { isOverdue, type DataRequestDetail } from "@/lib/monitoring";
import { DataRequestActions } from "./data-request-actions";
import { STATUSES, TYPES, statusVariant } from "./data-requests-table";

/** Opened by `?id=` on the list page; closing it drops the query. `prefill` holds the two
 *  closing replies, already rendered in the requester's language by the page. */
export function DataRequestSheet({
  request,
  prefill,
}: {
  request: DataRequestDetail;
  prefill: { done: string; rejected: string };
}) {
  const t = useTranslations("admin.dataRequests");
  const format = useFormatter();
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) router.replace("/data-requests");
  };
  const when = (iso: string) =>
    format.dateTime(new Date(iso), { dateStyle: "medium", timeStyle: "short" });
  const statusWord = (s: string) => (STATUSES.has(s) ? t(`statuses.${s}`) : s);
  const right = TYPES.has(request.request_type)
    ? t(`types.${request.request_type}`)
    : request.request_type;

  const facts: [string, React.ReactNode][] = [
    [
      t("email"),
      <a
        key="e"
        href={`mailto:${request.email}`}
        className="underline underline-offset-2"
      >
        {request.email}
      </a>,
    ],
    [t("sheet.language"), request.locale ?? "—"],
    [t("sheet.source"), request.source ?? "—"],
    [t("sheet.submitted"), when(request.submitted_at)],
    [t("due"), when(request.due_at)],
    [t("sheet.policy"), request.policy_version ?? "—"],
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>
            {t("sheet.title", { id: request.id })} · {right}
          </SheetTitle>
          <SheetDescription>{t("sheet.description")}</SheetDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant={statusVariant(request.status)}>
              {statusWord(request.status)}
            </Badge>
            {isOverdue(request) ? (
              <Badge variant="destructive">{t("overdue")}</Badge>
            ) : null}
          </div>
        </SheetHeader>

        <div className="flex flex-col gap-6 px-4 pb-6">
          {/* The requester's own words come first — the reason the operator acts on. */}
          <section aria-labelledby="dr-message" className="flex flex-col gap-2">
            <h3 id="dr-message" className="text-sm font-medium">
              {t("sheet.message")}
            </h3>
            {request.message ? (
              <blockquote className="border-primary bg-muted/50 rounded-md border-l-4 p-3 text-sm whitespace-pre-wrap">
                {request.message}
              </blockquote>
            ) : (
              <p className="text-muted-foreground text-sm">{t("sheet.noMessage")}</p>
            )}
          </section>

          <section aria-labelledby="dr-facts" className="flex flex-col gap-2">
            <h3 id="dr-facts" className="text-sm font-medium">
              {t("sheet.facts")}
            </h3>
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 text-sm">
              {facts.map(([k, v]) => (
                <div key={k} className="contents">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="break-words">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="dr-actions" className="flex flex-col gap-2">
            <h3 id="dr-actions" className="text-sm font-medium">
              {t("actions.title")}
            </h3>
            <DataRequestActions
              id={request.id}
              status={request.status}
              prefill={prefill}
            />
          </section>

          <section aria-labelledby="dr-history" className="flex flex-col gap-2">
            <h3 id="dr-history" className="text-sm font-medium">
              {t("sheet.history")}
            </h3>
            {request.events.length === 0 ? (
              <p className="text-muted-foreground text-sm">{t("sheet.noHistory")}</p>
            ) : (
              <ol className="flex flex-col gap-3 text-sm">
                {request.events.map((e) => (
                  <li key={e.id} className="flex flex-col gap-1 border-l-2 pl-3">
                    <span className="flex flex-wrap items-center gap-2">
                      <Badge variant={statusVariant(e.status)}>
                        {statusWord(e.status)}
                      </Badge>
                      <span className="text-muted-foreground tabular-nums">
                        {when(e.at)}
                      </span>
                      <span className="text-muted-foreground">
                        {t("sheet.by", { actor: e.actor })}
                      </span>
                      {e.notified ? (
                        <Badge variant="secondary">{t("sheet.emailSent")}</Badge>
                      ) : null}
                    </span>
                    {e.note ? <p className="whitespace-pre-wrap">{e.note}</p> : null}
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
