/* eslint-disable -- Acme Pro upstream illustration kept verbatim */

import { Check, Circle } from "lucide-react";
import { Linear } from "@/components/ui-primitives/svgs/linear";

export const AIChatInterface = () => {
  return (
    <div aria-hidden className="min-w-xs space-y-4">
      <div className="bg-illustration text-muted-foreground ring-border-illustration ml-auto w-fit max-w-4/5 rounded-l-xl rounded-tr-xl rounded-br px-3 py-2 text-sm/5 shadow ring-1 shadow-black/6.5">
        Split{" "}
        <span className="text-foreground relative inline-flex pr-2.5 pl-6">
          <Linear className="absolute inset-y-0.5 left-1 size-4" />
          <span className="bg-foreground/5 border-foreground/5 absolute inset-x-0 -inset-y-0.5 rounded-full border"></span>
          <span className="line-clamp-1 font-medium">fix: item doesn't exist</span>
        </span>
        issue into smaller tasks
      </div>

      <div className="text-sm">
        Thought <span className="text-muted-foreground">for 4s</span>
      </div>

      <div className="space-y-2">
        <div className="text-sm">
          I'll connect to Linear, analyze the issue and break it down.
        </div>
        <div className="bg-illustration ring-border-illustration w-fit rounded-xl p-4 shadow ring-1 shadow-black/6.5">
          <ul className="space-y-2.5 text-sm *:flex *:items-center *:gap-2.5">
            {[
              "Reproduce the bug locally",
              "Add null check validation",
              "Write unit test coverage",
              "Update documentation",
              "Create pull request",
            ].map((task) => (
              <li
                key={task}
                className="group/todo not-hover:text-muted-foreground cursor-default select-none"
              >
                <div className="relative size-4">
                  <Check
                    strokeWidth={3}
                    className="absolute inset-0 m-auto size-2.5 opacity-50 duration-100 not-group-hover/todo:opacity-0"
                  />
                  <Circle className="size-4 opacity-50" />
                </div>
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;
