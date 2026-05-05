import { CalendarDays, RefreshCcw } from "lucide-react";

const HOURS = Array.from({ length: 25 }, (_, i) => String(i).padStart(2, "0"));

/**
 * Day-view calendar illustration — bold "1 January 2026" header with
 * the day of week, three all-day event chips (Birthday, New Year's
 * Day, Team Kickoff) in sky/emerald/purple, then an hourly time grid
 * with a rose "now" marker line at 02:30. Pure decoration; mock event
 * labels and times stay hardcoded per the illustration rule. Sourced
 * from `@tailark-pro/expandable-features-4` (upstream
 * `Calendar10Illustration`; renamed since no Calendar1..9 sibling
 * family exists in this catalogue).
 */
export const CalendarIllustration = () => {
  return (
    <div aria-hidden className="px-6 pt-1">
      <div className="ring-border-illustration bg-card/95 min-w-md rounded-2xl shadow-md ring-1 shadow-black/4">
        <div className="space-y-2 px-6 py-5">
          <div className="text-2xl font-bold">
            1 January <span className="font-normal">2026</span>
          </div>
          <div>Thursday</div>
        </div>

        <div className="border-t pt-0.5">
          <div className="grid grid-cols-[auto_1fr] border-b-2 pr-0.5 pb-0.5 pl-6">
            <div className="text-foreground/50 w-12.5 py-0.5 text-center text-sm font-medium">
              all day
            </div>
            <div className="space-y-0.5">
              <EventChip
                name="Irung - Birthday"
                tone="sky"
                trailing={<RefreshCcw className="size-3" />}
              />
              <EventChip name="New Year's Day" tone="emerald" />
              <EventChip name="Team Kickoff 2026" tone="purple" />
            </div>
          </div>

          <div className="relative max-h-72 space-y-5 overflow-y-auto pb-6">
            <div className="absolute inset-x-0 top-28.5 grid grid-cols-[auto_1fr] items-center pr-0.5 pb-0.5 pl-6">
              <div className="w-12.5 rounded-full bg-rose-600 text-center text-sm font-semibold text-white">
                02:30
              </div>
              <div className="h-0.5 bg-rose-600" />
            </div>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="grid grid-cols-[auto_1fr] items-center pr-0.5 pb-0.5 pl-6"
              >
                <div className="text-foreground/50 w-12.5 py-0.5 text-center text-sm font-medium">
                  {hour}:00
                </div>
                <div className="bg-border h-px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

type EventTone = "sky" | "emerald" | "purple";

const TONE_CLASSES: Record<EventTone, { row: string; chip: string; text: string }> = {
  sky: {
    row: "bg-sky-500/6.5",
    chip: "bg-sky-400 text-sky-950",
    text: "text-sky-700 dark:text-sky-400",
  },
  emerald: {
    row: "bg-emerald-500/6.5",
    chip: "bg-emerald-400 text-emerald-950",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  purple: {
    row: "bg-purple-500/6.5",
    chip: "bg-purple-400 text-purple-950",
    text: "text-purple-700 dark:text-purple-400",
  },
};

function EventChip({
  name,
  tone,
  trailing,
}: Readonly<{ name: string; tone: EventTone; trailing?: React.ReactNode }>) {
  const t = TONE_CLASSES[tone];
  return (
    <div
      className={`grid grid-cols-[auto_1fr] gap-1 rounded-full p-1 pr-2 text-sm font-medium ${t.row}`}
    >
      <div
        className={`flex aspect-square rounded-full p-1 *:m-auto *:size-2.5 ${t.chip}`}
      >
        <CalendarDays />
      </div>
      <div className={`flex items-center justify-between ${t.text}`}>
        <span className="text-sm font-semibold">{name}</span>
        {trailing}
      </div>
    </div>
  );
}
