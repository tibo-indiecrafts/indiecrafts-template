"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Notes2Illustration } from "@/components/ui-illustrations/grid-2-product-notes-2-illustration";
import { Calendar10Illustration } from "@/components/ui-illustrations/grid-2-product-calendar-10-illustration";
import { AnimatePresence, motion } from "motion/react";
import { AgentTaskPlanningIllustration } from "@/components/ui-illustrations/grid-2-product-agent-task-planning-illustration";
import { Globe, Bot, Brain, ShieldCheck, Hourglass } from "lucide-react";
import { Button } from "@/components/ui-primitives/grid-2-product-button";
import Link from "next/link";
import { Container } from "@/components/ui-primitives/grid-2-product-container";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

const features = [
  {
    title: "AI Models",
    description: "Switch between GPT, Claude, and Gemini from a unified interface.",
    icon: Brain,
    image:
      "https://images.unsplash.com/photo-1723869791623-3b6a012f996b?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Global Reach",
    description: "Collaborate in real time with teammates across the globe.",
    icon: Globe,
    image:
      "https://images.unsplash.com/photo-1721111648084-5e4f18a8635c?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "Smart Agent",
    description: "Automate repetitive tasks with context-aware AI agents.",
    icon: Bot,
    image:
      "https://images.unsplash.com/photo-1770106678115-ec9aa241cdf6?q=80&w=2342&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const illustrations = [
  <Notes2Illustration key="m3" />,
  <Calendar10Illustration key="map" />,
  <AgentTaskPlanningIllustration key="m4" />,
];

export function ExpandableFeatures() {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const handleSelect = (index: number) => {
    if (index === expandedIndex) return;
    setExpandedIndex(index);
  };

  return (
    <>
      <Container asGrid className="grid @2xl:grid-cols-2 @4xl:grid-cols-10">
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
        <div className="@4xl:col-span-4">
          <div
            data-grid-content
            className="flex h-full flex-col gap-12 px-6 pt-6 @4xl:px-12 @4xl:pt-12"
          >
            <div className="text-balance">
              <h2 className="text-foreground text-3xl font-semibold">
                Ship with confidence using our unified platform
              </h2>
              <p className="text-muted-foreground mt-4 mb-6">
                Streamline your workflow with tools designed to enhance productivity at
                every step.
              </p>

              <Button asChild variant="outline" size="sm">
                <Link href="#">Learn more</Link>
              </Button>
            </div>

            <div
              className={cn(
                "mt-auto grid divide-y transition-all duration-300",
                expandedIndex === 0 && "grid-rows-[1fr_auto_auto]",
                expandedIndex === 1 && "grid-rows-[auto_1fr_auto]",
                expandedIndex === 2 && "grid-rows-[auto_auto_1fr]",
              )}
            >
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  data-expanded={expandedIndex === index}
                  className="not-first:border-t-card group relative grid grid-rows-[auto_1fr] not-first:border-t"
                >
                  <button
                    onClick={() => handleSelect(index)}
                    className="group flex w-full cursor-pointer items-center gap-3 py-4 text-left"
                  >
                    <feature.icon
                      className={cn(
                        "size-4 shrink-0 transition-colors",
                        expandedIndex === index
                          ? "text-foreground"
                          : "text-muted-foreground group-hover:text-foreground",
                      )}
                    />
                    <h3
                      className={cn(
                        "group-hover:text-foreground font-medium transition-colors",
                        expandedIndex === index
                          ? "text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {feature.title}
                    </h3>
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows] duration-300",
                      expandedIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-muted-foreground pb-6 pl-7 text-balance">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden @4xl:col-span-4">
          <div data-grid-content className="relative overflow-hidden md:h-full">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                variants={{
                  initial: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
                  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
                  exit: { opacity: 0, scale: 0.95, filter: "blur(4px)" },
                }}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.5, type: "spring", bounce: 0.1 }}
                className="relative z-10 flex h-full scale-85 items-center justify-center"
                key={expandedIndex}
              >
                {illustrations[expandedIndex]}
              </motion.div>
            </AnimatePresence>

            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={expandedIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="before:border-foreground/10 absolute inset-0 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded before:border"
              >
                <div className="dither absolute inset-0 opacity-75 dark:opacity-25">
                  <Image
                    src={features[expandedIndex].image}
                    alt="feature background image"
                    fill
                    className="size-full object-cover opacity-50"
                  />
                </div>
                <Image
                  src={features[expandedIndex].image}
                  alt="feature background image"
                  fill
                  className="size-full object-cover opacity-75 dark:opacity-40"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>

      <Container asGrid className="grid @2xl:grid-cols-2 @4xl:grid-cols-10">
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
        <div className="@4xl:col-span-4">
          <div data-grid-content className="p-6 @4xl:p-12">
            <ul className="text-muted-foreground mt-auto space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 *:nth-2:text-emerald-600 dark:text-emerald-500/25" />
                <span className="text-foreground font-medium">SOC 2</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 *:nth-2:text-emerald-600 dark:text-emerald-500/25" />
                <span className="text-foreground font-medium">ISO 27001</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="size-4 *:nth-2:text-emerald-600 dark:text-emerald-500/25" />
                <span className="text-foreground font-medium">GDPR</span>
              </li>
              <li className="flex items-center gap-3">
                <Hourglass className="text-muted-foreground size-4 dark:text-blue-500/25" />
                <span>
                  <span className="text-foreground font-medium">99.9%</span> uptime
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="@4xl:col-span-4">
          <div data-grid-content className="flex flex-col justify-end p-6 @4xl:p-12">
            <div className="relative mt-auto max-w-xl">
              <p className="text-foreground max-w-xs text-balance">
                &ldquo;Looks really good. Did you design in code or Figma first?&rdquo;
              </p>

              <div className="mt-4 flex items-center gap-2">
                <div className="before:border-foreground/10 relative size-10 overflow-hidden rounded-lg shadow before:absolute before:inset-0 before:rounded-lg before:border">
                  <Image src={SHADCN_AVATAR} alt="Shadcn Avatar" width={56} height={56} />
                </div>

                <div className="space-y-0.5">
                  <p className="text-foreground text-sm font-medium">Shadcn</p>
                  <span className="text-muted-foreground block text-xs">
                    Creator of Shadcn/UI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="@max-4xl:hidden">
          <div data-grid-content />
        </div>
      </Container>
    </>
  );
}
