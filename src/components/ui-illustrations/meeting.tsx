import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export const MeetingIllustration = () => {
  const agendaItems = [
    { title: "Review Q4 metrics", duration: "10 min", completed: true },
    { title: "Discuss roadmap updates", duration: "15 min", completed: true },
    { title: "Team announcements", duration: "5 min", completed: false },
    { title: "Open discussion", duration: "10 min", completed: false },
  ];

  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-card/25 min-w-xs rounded-3xl p-2 shadow-lg ring-1 shadow-black/4"
    >
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-sm font-semibold">Meeting Agenda</span>
        <div className="hover:bg-foreground/5 rounded-full p-1">
          <Plus className="size-4 opacity-50" />
        </div>
      </div>

      <div className="bg-illustration border-border/50 space-y-1 rounded-2xl border p-2">
        {agendaItems.map((item, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between rounded-xl p-2",
              item.completed ? "bg-foreground/5" : "",
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full border",
                  item.completed
                    ? "border-emerald-500 bg-emerald-500/10"
                    : "border-foreground/20",
                )}
              >
                {item.completed && (
                  <svg
                    className="size-3 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  item.completed ? "text-foreground/50 line-through" : "",
                )}
              >
                {item.title}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">{item.duration}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingIllustration;
