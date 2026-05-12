import { RefreshCcw, ChevronsUpDown, CalendarDays, Clock8, Bell } from "lucide-react";

export const Calendar11Illustration = () => {
  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-card/25 min-w-80 space-y-2 rounded-3xl p-2 shadow-xl ring-1 shadow-black/6.5"
    >
      <div className="bg-illustration border-border/50 relative rounded-2xl border p-4">
        <div className="text-foreground/50 text-xl font-semibold">Title</div>
        <div className="text-foreground/50 text-sm font-medium">Description</div>
        <div className="text-foreground/50 mt-2 border-t pt-2 text-sm font-medium">
          URL
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="text-foreground/50 px-4 text-sm font-medium">Date & Time</div>
        <div className="bg-illustration border-border/50 relative space-y-3 rounded-2xl border p-4">
          <div className="flex items-start gap-3">
            <CalendarDays className="fill-foreground/5 text-foreground/50 mt-0.5 size-4.5" />
            <div className="space-y-0.5">
              <div className="text-sm font-medium">Date</div>
              <div className="text-muted-foreground text-xs">27 Jul 2026</div>
            </div>
            <div className="bg-primary ml-auto flex h-4 w-9 justify-end rounded-full p-0.5 opacity-50">
              <div className="h-full w-5 rounded-full bg-white/75 shadow"></div>
            </div>
          </div>
          <div className="flex items-start gap-3 border-t pt-3">
            <Clock8 className="fill-foreground/5 text-foreground/50 mt-0.5 size-4.5" />
            <div className="space-0.5">
              <div className="text-sm font-medium">Time</div>
              <div className="text-muted-foreground text-xs">09:00</div>
            </div>

            <div className="bg-primary ml-auto flex h-4 w-9 justify-end rounded-full p-0.5">
              <div className="h-full w-5 rounded-full bg-white/90 shadow dark:bg-white/75"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-illustration border-border/50 relative space-y-3 rounded-2xl border p-4">
        <div className="flex items-start gap-3">
          <RefreshCcw className="text-foreground/50 mt-0.5 size-4.5" />

          <div className="text-sm font-medium">Repeat</div>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-sm font-medium">Yearly</div>
            <div className="bg-foreground/5 h-fit rounded-xl p-1">
              <ChevronsUpDown className="size-3 opacity-50" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 border-t pt-3">
          <Bell className="fill-foreground/5 text-foreground/50 size-4.5" />

          <div className="text-sm font-medium">Early Reminder</div>

          <div className="ml-auto flex items-center gap-2">
            <div className="text-sm font-medium">1 day</div>
            <div className="bg-foreground/5 h-fit rounded-xl p-1">
              <ChevronsUpDown className="size-3 opacity-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar11Illustration;
