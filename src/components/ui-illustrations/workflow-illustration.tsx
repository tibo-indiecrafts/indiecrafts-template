import { CheckCircle2, GitBranch } from "lucide-react";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";

/**
 * Workflow-timeline illustration — green "Workflow completed" header
 * over a dashed connector line linking three timeline cards: Linear
 * issue created → Git branch → Vercel preview deployed. Pure
 * decoration; mock timestamps stay hardcoded per the illustration
 * rule. Sourced from `@tailark-pro/features-carousel-3`.
 */
export const WorkflowIllustration = () => {
  return (
    <div aria-hidden className="mx-auto max-w-2xs min-w-2xs">
      <div>
        <div className="bg-illustration ring-border-illustration flex items-center gap-2 rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
          <CheckCircle2 className="size-4 fill-emerald-500/15 text-emerald-500" />
          <span className="text-foreground text-sm font-medium">Workflow completed</span>
        </div>
        <div className="relative space-y-4 pt-6 pl-6">
          <div className="border-foreground/15 absolute top-0 bottom-8 left-6 border-l border-dashed" />

          <TimelineRow icon={<Linear className="size-3.5" />}>
            Issue created{" "}
            <span className="text-foreground/50 pl-0.5 text-xs">12s ago</span>
          </TimelineRow>

          <TimelineRow icon={<GitBranch className="size-3.5" />}>
            Branch created{" "}
            <span className="text-foreground/50 pl-0.5 text-xs">3s ago</span>
          </TimelineRow>

          <TimelineRow icon={<Vercel className="fill-foreground size-3.5" />}>
            Preview deployed{" "}
            <span className="text-foreground/50 pl-0.5 text-xs">now</span>
          </TimelineRow>
        </div>
      </div>
    </div>
  );
};

function TimelineRow({
  icon,
  children,
}: Readonly<{ icon: React.ReactNode; children: React.ReactNode }>) {
  return (
    <div className="relative pl-6">
      <div className="border-foreground/15 absolute top-0 bottom-1/2 left-0 w-6 rounded-bl-full border-b border-l border-dashed" />
      <div className="bg-card ring-border-illustration flex items-center gap-2 rounded-xl p-3 shadow ring-1">
        {icon}
        <span className="text-muted-foreground text-xs font-medium">{children}</span>
      </div>
    </div>
  );
}
