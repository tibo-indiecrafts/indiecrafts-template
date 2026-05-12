import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui-primitives/dark-landing-button";
import {
  Calendar1,
  Bold,
  Italic,
  Strikethrough,
  Underline,
  Ellipsis,
} from "lucide-react";

type IllustrationProps = {
  className?: string;
  variant?: "elevated" | "outlined" | "mixed";
};

export const ScheduleIllustation = ({
  className,
  variant = "mixed",
}: IllustrationProps) => {
  return (
    <div className="mt-auto max-w-sm">
      <div className={cn("relative h-fit pt-12 pl-8", className)}>
        <div className="pointer-events-none absolute top-0 left-12 h-2 w-1/2 rounded-2xl bg-linear-to-r from-transparent via-purple-400 to-sky-500 opacity-75 blur-xs"></div>
        <div
          className={cn(
            "bg-illustration/85 absolute flex -translate-x-8 -translate-y-[110%] items-center gap-2 rounded-xl p-1",
            {
              "shadow-black-950/10 shadow-lg": variant === "elevated",
              "border-foreground/10 border": variant === "outlined",
              "ring-foreground/15 shadow-md ring inset-shadow-sm shadow-black/5 inset-shadow-white/4":
                variant === "mixed",
            },
          )}
        >
          <div
            className={buttonVariants({
              size: "sm",
              variant: "default",
              className:
                "ml-0.5 rounded text-white ring-indigo-700 [--color-primary:var(--color-indigo-600)]",
            })}
          >
            <Calendar1 className="size-3" />
            Schedule
          </div>
          <span className="bg-border block h-4 w-px"></span>
          <div className="flex gap-0.5 *:rounded-md">
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Bold className="size-4" />
            </div>
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Italic className="size-4" />
            </div>
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Underline className="size-4" />
            </div>
            <div
              className={buttonVariants({
                size: "icon",
                variant: "ghost",
              })}
            >
              <Strikethrough className="size-4" />
            </div>
          </div>
          <span className="bg-border block h-4 w-px"></span>
          <div
            className={buttonVariants({
              size: "icon",
              variant: "ghost",
              className: "rounded-md",
            })}
          >
            <Ellipsis className="size-3" />
          </div>
        </div>
        <span className="pl-6">
          <span className="bg-indigo-500/15 py-1 text-indigo-700 dark:text-indigo-300">
            Tomorrow 8:30 pm
          </span>{" "}
          is our priority.
        </span>
      </div>
      <div className="mt-4 space-y-4">
        <div className="space-y-1.5">
          <div className="bg-border h-1 w-4/5 rounded-full"></div>
          <div className="flex items-center gap-1">
            <div className="bg-border h-1 w-2/5 rounded-full"></div>
            <div className="bg-border h-1 w-1/5 rounded-full"></div>
            <div className="bg-border h-1 w-1/5 rounded-full"></div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="bg-border h-1 w-2/5 rounded-full"></div>
            <div className="bg-border h-1 w-1/5 rounded-full"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="bg-border h-1 w-1/5 rounded-full"></div>
            <div className="bg-border h-1 w-4/5 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
