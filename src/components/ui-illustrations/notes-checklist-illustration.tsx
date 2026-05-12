"use client";
import { Check, Circle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const INITIAL_TASKS: readonly Task[] = [
  { id: 1, text: "Review pull requests", completed: true },
  { id: 2, text: "Update documentation", completed: true },
  { id: 3, text: "Deploy to staging", completed: true },
  { id: 4, text: "Write unit tests", completed: false },
  { id: 5, text: "Send weekly report", completed: false },
];

export const NotesChecklistIllustration = () => {
  const [tasks, setTasks] = useState<readonly Task[]>(INITIAL_TASKS);

  const toggleTask = (id: number) =>
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );

  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <div aria-hidden className="max-w-xs min-w-2xs px-4 pt-4 selection:bg-amber-500/25">
      <div className="relative">
        <div className="absolute right-1 -bottom-2 left-1 h-full rotate-2 rounded-sm bg-gradient-to-br from-amber-200 to-yellow-300 shadow-sm dark:from-amber-300 dark:to-yellow-400" />
        <div className="absolute right-0.5 -bottom-1 left-0.5 h-full -rotate-1 rounded-sm bg-gradient-to-br from-amber-100 to-yellow-200 shadow-sm dark:from-amber-200 dark:to-yellow-300" />
        <div className="relative rounded-sm bg-gradient-to-br from-amber-100 to-yellow-200 p-5 pb-12 shadow-lg shadow-amber-900/15 dark:from-amber-300 dark:to-yellow-300">
          <div className="mb-4 flex items-center justify-between pt-2">
            <span className="text-sm font-semibold text-amber-950">Quick Tasks</span>
            <span className="text-xs text-amber-700">
              {completedCount}/{tasks.length}
            </span>
          </div>
          <div className="space-y-2">
            {tasks.map((task) => (
              <button
                type="button"
                key={task.id}
                onClick={() => toggleTask(task.id)}
                tabIndex={-1}
                className="flex w-full cursor-pointer items-center gap-2.5 text-left"
              >
                {task.completed ? (
                  <span className="flex size-4 items-center justify-center rounded bg-emerald-500/30">
                    <Check className="size-3 text-emerald-700" />
                  </span>
                ) : (
                  <Circle className="size-4 text-amber-700/40" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    task.completed
                      ? "text-amber-800/60 line-through"
                      : "text-amber-900 dark:text-amber-950",
                  )}
                >
                  {task.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
