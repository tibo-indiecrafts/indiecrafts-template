import { CircleDashed } from "lucide-react";

export const AgentTasksIllustration = () => {
  return (
    <div aria-hidden className="min-w-xs space-y-4">
      <div className="bg-illustration ring-border-illustration ml-auto w-fit max-w-4/5 rounded-l-xl rounded-tr-xl rounded-br px-3 py-2 text-sm shadow ring-1 shadow-black/6.5">
        create, agent-tasks illustration
      </div>

      <div className="text-sm">
        Thought <span className="text-muted-foreground">for 4s</span>
      </div>

      <div className="space-y-2">
        <div className="text-sm">
          1 / 3 <span className="text-muted-foreground">tasks done</span>
        </div>
        <div className="bg-illustration text-muted-foreground ring-border-illustration rounded-tl rounded-r-xl rounded-bl-xl px-4 py-3 shadow ring-1 shadow-black/6.5">
          <ul className="space-y-1.5 text-sm *:flex *:items-center *:gap-2.5">
            <li>
              <span className="bg-muted-foreground/75 text-background block flex size-4 items-center justify-center rounded-full text-[10px]">
                1
              </span>
              <span className="text-foreground font-medium">Fetch user data</span>
            </li>
            <li>
              <CircleDashed className="size-4 opacity-75" />
              <span>Analyze purchase history</span>
            </li>
            <li>
              <CircleDashed className="size-4 opacity-75" />
              <span>Generate recommendations</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-sm">
        Read <span className="text-muted-foreground">streaming-response.tsx</span>
      </div>
    </div>
  );
};

export default AgentTasksIllustration;
