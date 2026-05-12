import { Clock } from "lucide-react";

const timeSlots = [
  { time: "09:00", event: null },
  { time: "10:00", event: { title: "Design Review", duration: 2, color: "indigo" } },
  { time: "11:00", event: null },
  { time: "12:00", event: { title: "Lunch", duration: 1, color: "emerald" } },
  { time: "13:00", event: null },
  { time: "14:00", event: { title: "Client Call", duration: 1, color: "purple" } },
];

export const Calendar8Illustration = () => {
  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-illustration min-w-72 rounded-2xl p-3 shadow-lg ring-1 shadow-black/6.5"
    >
      <div className="mb-3 flex items-start justify-between px-1">
        <div className="space-y-0.5">
          <div className="font-semibold">Thursday</div>
          <div className="text-muted-foreground text-xs">January 29, 2026</div>
        </div>
        <div className="bg-foreground/5 flex items-center gap-1.5 rounded-full py-1 pr-2.5 pl-1.5">
          <Clock className="size-3 opacity-50" />
          <span className="text-xs font-medium">Day View</span>
        </div>
      </div>

      <div className="space-y-0">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-3">
            <div className="text-muted-foreground w-10 shrink-0 py-2 text-right text-xs">
              {slot.time}
            </div>
            <div className="border-border/50 relative flex-1 border-t py-2">
              {slot.event && (
                <div
                  className={`absolute inset-x-0 top-1 rounded-lg p-2 ${slot.event.color === "indigo" ? "bg-indigo-500/10 ring-1 ring-indigo-500/25" : slot.event.color === "emerald" ? "bg-emerald-500/10 ring-1 ring-emerald-500/25" : "bg-purple-500/10 ring-1 ring-purple-500/25"}`}
                  style={{ height: `${slot.event.duration * 40 - 8}px` }}
                >
                  <div
                    className={`text-xs font-medium ${slot.event.color === "indigo" ? "text-indigo-700 dark:text-indigo-300" : slot.event.color === "emerald" ? "text-emerald-700 dark:text-emerald-300" : "text-purple-700 dark:text-purple-300"}`}
                  >
                    {slot.event.title}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar8Illustration;
