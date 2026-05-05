import Image from "next/image";
import { cn } from "@/lib/utils";

const CUSTOMERS = [
  {
    id: 1,
    date: "10/31/2023",
    status: "Paid",
    statusVariant: "success",
    name: "Bernard Ng",
    avatar: "https://avatars.githubusercontent.com/u/31113941?v=4",
    revenue: "$43.99",
  },
  {
    id: 2,
    date: "10/21/2023",
    status: "Ref",
    statusVariant: "warning",
    name: "Méschac Irung",
    avatar: "https://avatars.githubusercontent.com/u/47919550?v=4",
    revenue: "$19.99",
  },
  {
    id: 3,
    date: "10/15/2023",
    status: "Paid",
    statusVariant: "success",
    name: "Glodie Ng",
    avatar: "https://avatars.githubusercontent.com/u/99137927?v=4",
    revenue: "$99.99",
  },
  {
    id: 4,
    date: "10/12/2023",
    status: "Cancelled",
    statusVariant: "danger",
    name: "Theo Ng",
    avatar: "https://avatars.githubusercontent.com/u/68236786?v=4",
    revenue: "$19.99",
  },
] as const;

/**
 * App-shell layout illustration — empty browser-style mock (sidebar +
 * top bar + diagonal-stripe content area) with a styled customers
 * table floated in front of it. Used by `sections-features/features-5`
 * and similar product-tour sections. Mock customer data stays
 * hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/features-5`. The customer-table sub-illustration is
 * inlined as a private helper since it has no other consumer.
 */
export const LayoutIllustration = () => (
  <div aria-hidden className="relative">
    <div className="absolute -right-56 bottom-6 left-[13rem] z-1 md:-right-4 md:w-[calc(100%-12rem)]">
      <CustomersTable className="max-w-full" />
    </div>

    <div className="rounded-2xl border mask-b-from-50%">
      <div className="absolute inset-y-0 left-0 w-[12rem] border-r">
        <div className="flex gap-1.5 px-4 pt-4">
          <div className="bg-foreground/5 border-foreground/5 size-2 rounded-full border" />
          <div className="bg-foreground/5 border-foreground/5 size-2 rounded-full border" />
          <div className="bg-foreground/5 border-foreground/5 size-2 rounded-full border" />
        </div>
      </div>
      <div className="ml-auto w-[calc(100%-12rem)]">
        <div className="h-11 border-b" />
        <div className="relative h-80">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] opacity-50" />
        </div>
      </div>
    </div>
  </div>
);

function CustomersTable({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "bg-illustration ring-border-illustration from-card/50 relative mx-auto max-w-4xl rounded-2xl border border-transparent p-6 shadow-md ring-1 shadow-black/6.5",
        className,
      )}
    >
      <div className="mb-4">
        <div className="font-medium">Customers</div>
        <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm">
          New users by First user primary channel group (Default Channel Group)
        </p>
      </div>
      <table className="w-max table-auto border-collapse lg:w-full" data-rounded="medium">
        <thead className="dark:bg-background bg-foreground/5">
          <tr className="*:border *:p-3 *:text-left *:text-sm *:font-medium">
            <th className="rounded-l-[--card-radius]">#</th>
            <th>Date</th>
            <th>Status</th>
            <th>Customer</th>
            <th className="rounded-r-[--card-radius]">Revenue</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {CUSTOMERS.map((customer) => (
            <tr key={customer.id} className="*:border *:p-2">
              <td>{customer.id}</td>
              <td>{customer.date}</td>
              <td>
                <span
                  className={cn(
                    "inset-ring-foreground/10 rounded-full px-2 py-1 text-xs inset-ring-1",
                    customer.statusVariant === "success" &&
                      "bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
                    customer.statusVariant === "danger" &&
                      "bg-rose-500/10 text-rose-800 dark:text-rose-200",
                    customer.statusVariant === "warning" &&
                      "bg-amber-500/10 text-amber-800 dark:text-amber-200",
                  )}
                >
                  {customer.status}
                </span>
              </td>
              <td>
                <div className="text-title flex items-center gap-2">
                  <div className="before:border-foreground/10 relative size-5 overflow-hidden rounded-full before:absolute before:inset-0 before:rounded-full before:border">
                    <Image
                      src={customer.avatar}
                      alt={customer.name}
                      width={40}
                      height={40}
                      loading="lazy"
                      className="size-full object-cover"
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
  );
}
