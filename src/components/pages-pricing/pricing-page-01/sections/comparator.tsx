"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ChartPie, Cpu, HeartPulse, PanelsTopLeft } from "lucide-react";

import { Button } from "@/components/ui-effects/dark-pricing-button";
import { useMedia } from "@/hooks/use-media";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui-effects/dark-pricing-tooltip";

const plans = ["free", "pro", "team"] as const;

type PlanAvailability = boolean | string;

type Plan = (typeof plans)[number];

type Feature = {
  name: string;
  description?: string;
  plans: Record<Plan, PlanAvailability>;
};

type Category = {
  name: string;
  icon?: ReactNode;
  features: Feature[];
};

export function Comparator() {
  const [activePlan, setActivePlan] = useState<Plan>("free");
  const isMedium = useMedia("(min-width: 768px)");

  const categories: Category[] = [
    {
      name: "Platform",
      icon: <PanelsTopLeft />,
      features: [
        {
          name: "CMS Collections",
          description: "Create and manage collections of content.",
          plans: {
            free: "",
            pro: "2",
            team: "10",
          },
        },
        {
          name: "Custom Domains",
          description: "Connect your own domain to your site.",
          plans: {
            free: "",
            pro: "1",
            team: "Unlimited",
          },
        },
        {
          name: "SEO Tools",
          description: "Optimize your site for search engines.",
          plans: {
            free: "Basic",
            pro: "Advanced",
            team: "Advanced",
          },
        },
        {
          name: "User Roles",
          description: "Manage permissions for different users.",
          plans: {
            free: "",
            pro: "Editor",
            team: "Admin",
          },
        },
      ],
    },
    {
      name: "Infrastructure",
      icon: <Cpu />,
      features: [
        {
          name: "Version History",
          description: "Track changes to your content.",
          plans: {
            free: "3 days",
            pro: "30 days",
            team: "1 year",
          },
        },
        {
          name: "Uptime Monitoring",
          description: "Ensure your site is always up.",
          plans: {
            free: "",
            pro: "Hourly",
            team: "Hourly",
          },
        },
        {
          name: "Backup & Restore",
          description: "Protect your data with regular backups.",
          plans: {
            free: "",
            pro: "Weekly",
            team: "Daily",
          },
        },
        {
          name: "DDoS Protection",
          description: "Secure your site against attacks.",
          plans: {
            free: "",
            pro: "Basic",
            team: "Advanced",
          },
        },
      ],
    },
    {
      name: "Support",
      icon: <HeartPulse />,
      features: [
        {
          name: "Workshop",
          description: "Get help with your content.",
          plans: {
            free: "Limited",
            pro: "Limited",
            team: "Extended",
          },
        },
        {
          name: "24/7 Support",
          plans: {
            free: "No",
            pro: "Yes",
            team: "Yes",
          },
        },
        {
          name: "Dedicated Account Manager",
          description: "Receive personalized support.",
          plans: {
            free: "No",
            pro: "No",
            team: "Yes",
          },
        },
        {
          name: "Community Access",
          plans: {
            free: "Yes",
            pro: "Yes",
            team: "Yes",
          },
        },
      ],
    },
    {
      name: "Analytics",
      icon: <ChartPie />,
      features: [
        {
          name: "Real-time Reports",
          plans: {
            free: "Limited",
            pro: "Limited",
            team: "Extended",
          },
        },
        {
          name: "Custom Dashboards",
          description: "Create dashboards tailored to your needs.",
          plans: {
            free: "",
            pro: "",
            team: "4",
          },
        },
        {
          name: "Conversion Tracking",
          plans: {
            free: "",
            pro: "Yes",
            team: "Yes",
          },
        },
        {
          name: "User Insights",
          plans: {
            free: "Basic",
            pro: "Advanced",
            team: "Advanced",
          },
        },
      ],
    },
  ];

  const plansActions: Record<Plan, ReactNode> = {
    free: (
      <Button size="sm" variant="outline" asChild>
        <Link href="#">Get Started</Link>
      </Button>
    ),
    pro: (
      <Button size="sm" asChild>
        <Link href="#">Start a free trial</Link>
      </Button>
    ),
    team: (
      <Button size="sm" variant="outline" asChild>
        <Link href="#">Contact Us</Link>
      </Button>
    ),
  };

  const prices: Record<Plan, string> = {
    free: "0$ / month",
    pro: "15$ / month",
    team: "Custom",
  };

  return (
    <section className="bg-background pb-16 md:pt-18 md:pb-24">
      <div className="mx-auto max-w-5xl md:px-6 lg:px-2">
        {!isMedium && (
          <div className="bg-background/50 sticky top-14 z-10 flex justify-between gap-4 border-b px-1 py-3 backdrop-blur-sm">
            <div className="flex justify-center">
              {plans.map((plan, index) => (
                <button
                  key={index}
                  onClick={() => setActivePlan(plan)}
                  className="text-muted-foreground group max-md:px-1 md:block md:py-1"
                >
                  <span
                    className={cn(
                      "flex w-fit items-center gap-2 rounded-md px-4 py-1.5 text-sm transition-colors [&>svg]:size-4",
                      activePlan === plan
                        ? "bg-card ring-foreground/5 text-primary font-medium shadow-sm ring-1"
                        : "hover:text-foreground group-hover:bg-foreground/5",
                    )}
                  >
                    <span className="capitalize">{plan}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="before:bg-background/50 gap-5 px-6 pt-6 pb-6 before:absolute before:inset-0 before:mask-b-from-70% before:backdrop-blur-sm max-md:before:hidden md:sticky md:top-14 md:z-9 md:grid md:grid-cols-3 md:px-0 md:pb-12">
          {isMedium ? (
            plans.map((plan) => (
              <div
                key={plan}
                className="bg-illustration/35 ring-border-illustration relative z-10 flex flex-wrap items-end justify-between gap-2 rounded-xl p-4 shadow ring-1"
              >
                <div>
                  <h3 className="font-medium capitalize">{plan}</h3>
                  <div className="text-muted-foreground mt-0.5 text-sm">
                    {prices[plan]}
                  </div>
                </div>
                {plansActions[plan]}
              </div>
            ))
          ) : (
            <div className="flex flex-col">
              <h3 className="font-medium capitalize">{activePlan}</h3>
              <div className="text-muted-foreground mt-0.5 mb-4 text-sm">
                {prices[activePlan]}
              </div>
              {plansActions[activePlan]}
            </div>
          )}
        </div>

        <div className="space-y-12">
          <TooltipProvider>
            {categories.map((category, index) => (
              <div key={index}>
                <div className="relative flex h-16 flex-col justify-center px-6 md:px-4">
                  <h3 className="flex items-center gap-2 text-lg font-medium [&>svg]:size-4.5">
                    {category.icon}
                    {category.name}
                  </h3>
                </div>
                {category.features.map((feature, index) => (
                  <div
                    key={index}
                    className="grid gap-3 border-t last:border-b md:grid-cols-3"
                  >
                    {isMedium ? (
                      plans.map((plan) => (
                        <div
                          key={plan}
                          className="flex h-14 items-center gap-2 px-6 md:px-4"
                        >
                          <span
                            aria-hidden
                            className="flex size-4.5 items-center justify-center"
                          >
                            {feature.plans[plan] === "" ? (
                              <span className="bg-foreground/50 block size-1.5 rounded-full opacity-50" />
                            ) : (
                              <CheckIcon />
                            )}
                          </span>
                          <div
                            className={cn(
                              "flex items-center gap-1.5",
                              feature.plans[plan] === "" && "opacity-50",
                            )}
                          >
                            {feature.plans[plan]}{" "}
                            {feature.description && feature.plans[plan] !== "" ? (
                              <FeatureDescription feature={feature} />
                            ) : (
                              <span className="line-clamp-1 opacity-50">
                                {feature.name}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex h-14 items-center gap-2 px-6 md:px-4">
                        <span
                          aria-hidden
                          className="flex size-4.5 items-center justify-center"
                        >
                          {feature.plans[activePlan] === "" ? (
                            <span className="bg-foreground/50 block size-1.5 rounded-full opacity-50" />
                          ) : (
                            <CheckIcon />
                          )}
                        </span>
                        <div
                          className={cn(
                            "flex items-center gap-1.5",
                            feature.plans[activePlan] === "" && "opacity-50",
                          )}
                        >
                          {feature.plans[activePlan]}{" "}
                          {feature.description && feature.plans[activePlan] !== "" ? (
                            <FeatureDescription feature={feature} />
                          ) : (
                            <span className="line-clamp-1 opacity-50">
                              {feature.name}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </TooltipProvider>
        </div>
      </div>
    </section>
  );
}

const CheckIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 512 512"
      className="size-3"
    >
      <path
        fill="currentColor"
        d="M17.47 250.9C88.82 328.1 158 397.6 224.5 485.5c72.3-143.8 146.3-288.1 268.4-444.37L460 26.06C356.9 135.4 276.8 238.9 207.2 361.9c-48.4-43.6-126.62-105.3-174.38-137z"
      />
    </svg>
  );
};

const FeatureDescription = ({ feature }: { feature: Feature }) => {
  return (
    <Tooltip>
      <TooltipTrigger className="px-0 text-left">
        <span className="line-clamp-1 cursor-help underline decoration-dotted underline-offset-2 opacity-50">
          {feature.name}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-56 text-sm">{feature.description}</TooltipContent>
    </Tooltip>
  );
};
