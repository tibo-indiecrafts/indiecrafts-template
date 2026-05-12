import { ChevronLeft, ChevronRight } from "lucide-react";

const days = ["M", "T", "W", "T", "F", "S", "S"];
const dates = [
  [30, 31, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 1, 2],
];

export const Calendar7Illustration = () => {
  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-illustration min-w-64 rounded-2xl p-3 shadow-lg ring-1 shadow-black/6.5"
    >
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="text-sm font-semibold">January 2026</div>
        <div className="flex gap-1">
          <div className="bg-foreground/5 flex size-6 items-center justify-center rounded-lg">
            <ChevronLeft className="size-3.5" />
          </div>
          <div className="bg-foreground/5 flex size-6 items-center justify-center rounded-lg">
            <ChevronRight className="size-3.5" />
          </div>
        </div>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {days.map((day, i) => (
          <div
            key={i}
            className="text-muted-foreground flex size-8 items-center justify-center text-xs font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {dates.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((date, dateIndex) => {
              const isToday = weekIndex === 2 && dateIndex === 3;
              const isSelected = weekIndex === 3 && dateIndex === 1;
              const isOtherMonth =
                (weekIndex === 0 && date > 20) || (weekIndex === 4 && date < 10);
              const hasEvent =
                (weekIndex === 1 && dateIndex === 2) ||
                (weekIndex === 2 && dateIndex === 5);

              return (
                <div
                  key={dateIndex}
                  className={`relative flex size-8 cursor-pointer items-center justify-center rounded-lg text-xs font-medium ${isSelected ? "bg-primary text-primary-foreground" : isToday ? "bg-foreground/10" : isOtherMonth ? "text-muted-foreground/50" : ""}`}
                >
                  {date}
                  {hasEvent && !isSelected && (
                    <div className="bg-primary absolute bottom-1 size-1 rounded-full" />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar7Illustration;
