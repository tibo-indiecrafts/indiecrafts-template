import Image from "next/image";
import { Logo } from "@/components/layouts/_shared/logo";
import { GanttChart } from "./gantt-chart-illustration.data";

const AVATARS = [
  {
    src: "https://avatars.githubusercontent.com/u/47919550?v=4",
    alt: "Méschac Irung",
  },
  {
    src: "https://avatars.githubusercontent.com/u/31113941?v=4",
    alt: "Bernard Ngandu",
  },
  {
    src: "https://avatars.githubusercontent.com/u/68236786?v=4",
    alt: "Theo",
  },
  {
    src: "https://avatars.githubusercontent.com/u/124599?v=4",
    alt: "Shadcn",
  },
] as const;

/**
 * Gantt-chart product mock — window-chrome card with brand mark, a
 * "Timeline / Sidebar / Gantt Chart / Board / Workflow" tab row
 * (Gantt active), an avatar stack, and the full `GanttChart`
 * molecule below. Used by `sections-how-it-works/how-it-works-02/`'s
 * "Manage your projects efficiently" step. Sourced from
 * `@tailark-pro/how-it-works-02` (upstream `GanttChartIllustration`).
 */
export const GanttChartIllustration = () => (
  <div
    aria-hidden
    className="ring-border-illustration bg-illustration overflow-hidden rounded-2xl border border-t border-transparent shadow-md ring-1 shadow-black/10"
  >
    <div className="space-y-4 px-4 pt-4">
      <div className="flex gap-1.5">
        <div className="bg-foreground/5 border-foreground/5 size-2 rounded-full border" />
        <div className="bg-foreground/5 border-foreground/5 size-2 rounded-full border" />
        <div className="bg-foreground/5 border-foreground/5 size-2 rounded-full border" />
      </div>

      <div className="flex justify-between">
        <div>
          <Logo className="mb-3 h-4 w-fit" />
          <div className="*:hover:text-foreground relative z-50 flex translate-y-px gap-4 *:cursor-pointer *:pb-3 *:text-sm *:font-medium *:text-nowrap">
            <div className="text-muted-foreground">Timeline</div>
            <div className="text-muted-foreground">Sidebar</div>
            <div className="border-foreground text-foreground border-b">Gantt Chart</div>
            <div className="text-muted-foreground">Board</div>
            <div className="text-muted-foreground">Workflow</div>
          </div>
        </div>
        <div className="flex -space-x-2">
          {AVATARS.map((avatar) => (
            <div
              key={avatar.alt}
              className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5 *:rounded-full"
            >
              <Image
                src={avatar.src}
                className="aspect-square rounded-[calc(var(--avatar-radius)-2px)] object-cover"
                alt={avatar.alt}
                width={46}
                height={46}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="relative overflow-hidden rounded-2xl before:pointer-events-none before:absolute before:inset-0 before:z-40 before:rounded-2xl before:border">
      <GanttChart />
    </div>
  </div>
);
