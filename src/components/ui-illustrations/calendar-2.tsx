import { CheckCircle2, ChevronsUpDown, RefreshCcw } from "lucide-react";

export const Calendar2Illustration = () => {
  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-card/25 min-w-80 space-y-2 rounded-3xl p-2 shadow-md ring-1 shadow-black/6.5"
    >
      <div className="bg-illustration border-border/50 relative flex justify-between rounded-2xl border p-4">
        <div className="text-lg font-semibold">Irung - Birthday</div>
        <div className="bg-foreground/5 flex h-fit items-center gap-0.5 rounded-full border p-1">
          <div className="size-3 rounded-full bg-purple-400" />
          <ChevronsUpDown className="size-3" />
        </div>
      </div>
      <div className="bg-illustration border-border/50 relative space-y-2 rounded-2xl border p-4">
        <div className="text-sm font-medium">27 Jul 2026</div>
        <div className="flex justify-between">
          <div className="text-sm font-medium">Repeats Yearly</div>
          <div className="bg-foreground/5 h-fit rounded p-1">
            <RefreshCcw className="size-3 opacity-50" />
          </div>
        </div>
        <div className="text-sm font-medium">
          Alert 1 day before at 09:00 <span className="opacity-50"> (default)</span>
        </div>
      </div>
      <div className="bg-illustration border-border/50 relative space-y-2 rounded-2xl border p-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 fill-emerald-500/10 text-emerald-500" />
          <div className="text-sm font-medium">Google Calendar (organizer)</div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 fill-emerald-500/10 text-emerald-500" />
          <div className="text-sm font-medium">hey@tailark.com</div>
        </div>
      </div>
      <div className="bg-illustration border-border/50 relative flex gap-3 rounded-2xl border p-4">
        <div className="text-foreground/50 text-sm font-medium">My status:</div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 fill-emerald-500/10 text-emerald-500" />
          <div className="text-sm font-medium">Accepted</div>
        </div>
      </div>
    </div>
  );
};

export default Calendar2Illustration;
