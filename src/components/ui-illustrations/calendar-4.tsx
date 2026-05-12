export const Calendar4Illustration = () => {
  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-card/25 min-w-2xs space-y-2 rounded-2xl p-2 shadow-md ring-1 shadow-black/6.5"
    >
      <div className="flex justify-between p-1">
        <div className="text-sm font-medium">
          <span className="text-foreground/50">Today, </span> Thusday
        </div>
        <div className="text-foreground/50 text-sm">27 Jan 2026</div>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex gap-2 rounded-lg border border-transparent bg-indigo-500/10 p-1.5 shadow ring-1 shadow-black/6.5 ring-indigo-500/25">
          <div className="w-1 rounded-full bg-indigo-500" />

          <div className="space-y-0.5">
            <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
              Team Standup
            </div>
            <div className="line-clamp-1 text-indigo-500">09:00 - 09:30</div>
          </div>
        </div>
        <div className="flex gap-2 rounded-lg border border-transparent bg-purple-500/10 p-1.5 shadow ring-1 shadow-black/6.5 ring-purple-500/25">
          <div className="w-1 rounded-full bg-purple-500" />

          <div className="space-y-0.5">
            <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Product Review
            </div>
            <div className="text-muted-foreground line-clamp-1 text-purple-500">
              14:00 - 15:00
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar4Illustration;
