import { cn } from "@/lib/utils";
import { Clover, Gem } from "lucide-react";

export function Comparator() {
  const features = [
    // Free features
    {
      name: "Basic Analytics Dashboard",
      plans: { free: true, pro: true },
    },
    {
      name: "5GB Cloud Storage",
      plans: { free: true, pro: true },
    },
    {
      name: "Email and Chat Support",
      plans: { free: true, pro: true },
    },
    // Pro-only additions
    {
      name: "Access to Community Forum",
      plans: { free: false, pro: true },
    },
    {
      name: "Single User Access",
      plans: { free: false, pro: true },
    },
    {
      name: "Access to Basic Templates",
      plans: { free: false, pro: true },
    },
    {
      name: "Mobile App Access",
      plans: { free: false, pro: true },
    },
    {
      name: "1 Custom Report Per Month",
      plans: { free: false, pro: true },
    },
    {
      name: "Monthly Product Updates",
      plans: { free: false, pro: true },
    },
    {
      name: "Standard Security Features",
      plans: { free: false, pro: true },
    },
  ];
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-lg md:mx-auto md:text-center">
          <h2 className="text-foreground text-4xl font-semibold">Compare Plans</h2>
        </div>
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="grid grid-cols-2">
            <div>
              <div className="flex h-18 items-center">
                <div className="text-lg font-medium">Benefits</div>
              </div>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex h-14 items-center border-t max-md:text-sm"
                >
                  <div>{feature.name}</div>
                </div>
              ))}
            </div>
            <div className="from-foreground/3 grid grid-cols-2 rounded-2xl bg-linear-to-b [--color-border:color-mix(in_oklab,var(--color-foreground)6%,transparent)]">
              <div>
                <div className="flex h-18 flex-col items-center justify-center gap-1 px-8 pt-2 text-center">
                  <Clover className="size-4" />
                  <div className="text-sm font-medium">Free</div>
                </div>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex h-14 items-center justify-center border-t px-6"
                  >
                    <div>
                      {feature.plans.free ? <Indicator checked /> : <Indicator />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-card ring-foreground/5 my-2 rounded-lg shadow-lg ring-1 shadow-black/10 last:mr-2">
                <div className="flex h-16 flex-col items-center justify-center gap-1 px-6 text-center">
                  <Gem className="size-4" />
                  <div className="text-sm font-medium">Pro</div>
                </div>
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex h-14 items-center justify-center border-t px-8"
                  >
                    <div>{feature.plans.pro ? <Indicator checked /> : <Indicator />}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const Indicator = ({ checked = false }: { checked?: boolean }) => {
  return (
    <span
      className={cn(
        "bg-foreground/[0.065] text-foreground/65 flex size-5 items-center justify-center rounded-full font-sans text-xs font-semibold",
        checked && "bg-emerald-500/10 text-emerald-600",
      )}
    >
      {checked ? "✓" : "✗"}
    </span>
  );
};
