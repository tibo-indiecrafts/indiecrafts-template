import * as React from "react";
import { cn } from "@/lib/utils";
import { useScopedT } from "@/i18n/scoped-t";
import { features40Namespace } from "./config";
import type { Features40Block } from "./schema";

const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("rounded-xl", className)} {...props} />
);

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";
const BERNARD_AVATAR = "https://avatars.githubusercontent.com/u/31113941?v=4";
const THEO_AVATAR = "https://avatars.githubusercontent.com/u/68236786?v=4";
const GLODIE_AVATAR = "https://avatars.githubusercontent.com/u/99137927?v=4";

export default function Features({ id }: Readonly<Features40Block>) {
  const [t, , tRoot] = useScopedT(features40Namespace);

  const customers = [
    {
      id: 1,
      date: "10/31/2023",
      statusKey: "table.statusPaid" as const,
      statusVariant: "success" as const,
      name: "Bernard Ng",
      avatar: BERNARD_AVATAR,
      revenue: "$43.99",
    },
    {
      id: 2,
      date: "10/21/2023",
      statusKey: "table.statusRef" as const,
      statusVariant: "warning" as const,
      name: "Méschac Irung",
      avatar: MESCHAC_AVATAR,
      revenue: "$19.99",
    },
    {
      id: 3,
      date: "10/15/2023",
      statusKey: "table.statusPaid" as const,
      statusVariant: "success" as const,
      name: "Glodie Ng",
      avatar: GLODIE_AVATAR,
      revenue: "$99.99",
    },
    {
      id: 4,
      date: "10/12/2023",
      statusKey: "table.statusCancelled" as const,
      statusVariant: "danger" as const,
      name: "Theo Ng",
      avatar: THEO_AVATAR,
      revenue: "$19.99",
    },
  ];

  return (
    <section aria-labelledby={`${id}-heading`}>
      <div className="bg-muted/50 py-24">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div>
            <h2 id={`${id}-heading`} className="text-foreground text-4xl font-semibold">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-4 mb-12 text-lg text-balance">
              {t("body")}
            </p>
            <div className="bg-foreground/5 rounded-3xl p-6">
              <div className="bg-background shadow-foreground/5 inset-ring-background ring-foreground/5 relative w-full overflow-hidden rounded-xl border border-transparent p-6 shadow-md ring-1 inset-ring-1">
                <div className="mb-6">
                  <div className="flex gap-1.5">
                    <div className="bg-muted size-2 rounded-full border border-black/5" />
                    <div className="bg-muted size-2 rounded-full border border-black/5" />
                    <div className="bg-muted size-2 rounded-full border border-black/5" />
                  </div>
                  <div className="mt-3 text-lg font-medium">{t("table.heading")}</div>
                  <p className="mt-1 text-sm">{t("table.subheading")}</p>
                </div>
                <table
                  className="w-max table-auto border-collapse lg:w-full"
                  data-rounded="medium"
                >
                  <thead className="dark:bg-background bg-gray-950/5">
                    <tr className="*:border *:p-3 *:text-left *:text-sm *:font-medium">
                      <th className="rounded-l-[--card-radius]">
                        {t("table.columns.id")}
                      </th>
                      <th>{t("table.columns.date")}</th>
                      <th>{t("table.columns.status")}</th>
                      <th>{t("table.columns.customer")}</th>
                      <th className="rounded-r-[--card-radius]">
                        {t("table.columns.revenue")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {customers.map((customer) => (
                      <tr key={customer.id} className="*:border *:p-2">
                        <td>{customer.id}</td>
                        <td>{customer.date}</td>
                        <td>
                          <span
                            className={cn(
                              "rounded-full px-2 py-1 text-xs",
                              customer.statusVariant === "success" &&
                                "bg-lime-500/15 text-lime-800",
                              customer.statusVariant === "danger" &&
                                "bg-red-500/15 text-red-800",
                              customer.statusVariant === "warning" &&
                                "bg-yellow-500/15 text-yellow-800",
                            )}
                          >
                            {t(customer.statusKey)}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <div className="size-6 overflow-hidden rounded-full">
                              {/* eslint-disable-next-line @next/next/no-img-element -- random external avatar URL, intentional <img> */}
                              <img
                                src={customer.avatar}
                                alt={customer.name}
                                width={120}
                                height={120}
                                loading="lazy"
                              />
                            </div>
                            <span className="text-foreground">{customer.name}</span>
                          </div>
                        </td>
                        <td>{customer.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="border-foreground/10 relative mt-16 grid gap-12 border-b pb-12 [--radius:1rem] md:grid-cols-2">
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {t("marketing.title")}
              </h3>
              <p className="text-muted-foreground my-4 text-lg">{t("marketing.body")}</p>
              <Card className="bg-muted/40 aspect-video overflow-hidden px-6">
                <Card className="bg-background h-full translate-y-6" />
              </Card>
            </div>
            <div>
              <h3 className="text-foreground text-xl font-semibold">
                {t("scheduler.title")}
              </h3>
              <p className="text-muted-foreground my-4 text-lg">{t("scheduler.body")}</p>
              <Card className="bg-muted/40 aspect-video overflow-hidden">
                <Card className="bg-background h-full translate-6" />
              </Card>
            </div>
          </div>

          <blockquote className="before:bg-primary relative mt-12 max-w-xl pl-6 before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-full">
            <p className="text-foreground text-lg">
              {tRoot(`${features40Namespace}.quote`)}
            </p>
            <footer className="mt-4 flex items-center gap-2">
              <cite>{t("quoteAuthor")}</cite>
              <span aria-hidden className="bg-foreground/15 size-1 rounded-full" />
              <span className="text-muted-foreground">{t("quoteRole")}</span>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
