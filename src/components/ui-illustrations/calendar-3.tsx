export const Calendar3Illustration = () => {
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
        <div className="bg-illustration ring-border-illustration flex gap-2 rounded-lg border border-transparent p-1.5 shadow ring-1 shadow-black/6.5">
          <div className="bg-primary w-1 rounded-full" />

          <div className="space-y-0.5">
            <div className="text-sm font-medium">Team Standup</div>
            <div className="text-muted-foreground line-clamp-1">09:00 - 09:30</div>
          </div>
        </div>
        <div className="bg-illustration ring-border-illustration flex gap-2 rounded-lg border border-transparent p-1.5 shadow ring-1 shadow-black/6.5">
          <div className="w-1 rounded-full bg-purple-500" />

          <div className="space-y-0.5">
            <div className="text-sm font-medium">Product Review</div>
            <div className="text-muted-foreground line-clamp-1">14:00 - 15:00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar3Illustration;
