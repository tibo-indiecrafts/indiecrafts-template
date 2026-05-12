import { Plus } from "lucide-react";
import Image from "next/image";

export const Meeting2Illustration = () => {
  const actionItems = [
    {
      task: "Update project timeline",
      assignee: "https://avatars.githubusercontent.com/u/47919550?v=4",
      due: "Today",
      done: false,
    },
    {
      task: "Share design mockups",
      assignee: "https://avatars.githubusercontent.com/u/31113941?v=4",
      due: "Tomorrow",
      done: false,
    },
    {
      task: "Review PRs",
      assignee: "https://avatars.githubusercontent.com/u/68236786?v=4",
      due: "Done",
      done: true,
    },
  ];

  return (
    <div
      aria-hidden
      className="ring-border-illustration bg-card/25 min-w-xs rounded-3xl p-2 shadow-lg ring-1 shadow-black/4"
    >
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-sm font-semibold">Action Items</div>

        <div className="hover:bg-foreground/5 flex cursor-pointer items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium">
          <Plus className="size-3" />
          Add
        </div>
      </div>

      <div className="bg-illustration border-border/50 divide-y rounded-2xl border">
        {actionItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3">
            <div
              className={`flex size-5 shrink-0 items-center justify-center rounded ${item.done ? "bg-emerald-500" : "border-foreground/20 border"}`}
            >
              {item.done && (
                <svg
                  className="size-3 text-white"
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
            <div className="min-w-0 flex-1">
              <div
                className={`truncate text-sm ${item.done ? "text-foreground/50 line-through" : ""}`}
              >
                {item.task}
              </div>
            </div>

            <span
              className={`shrink-0 text-xs ${item.done ? "text-emerald-500" : item.due === "Today" ? "text-amber-500" : "text-muted-foreground"}`}
            >
              {item.due}
            </span>
            <div className="bg-background size-6 shrink-0 rounded-full border p-0.5 *:rounded-full">
              <Image
                src={item.assignee}
                className="aspect-square object-cover"
                alt="Assignee"
                width="460"
                height="460"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meeting2Illustration;
