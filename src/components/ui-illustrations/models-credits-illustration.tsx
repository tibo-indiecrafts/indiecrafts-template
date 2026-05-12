import { ArrowUp, ChevronDown, Infinity as InfinityIcon } from "lucide-react";

type Model = {
  name: string;
  credits: number;
};

const MODELS: readonly Model[] = [
  { name: "Gemini", credits: 2 },
  { name: "Open AI", credits: 5 },
  { name: "Deepseek", credits: 3 },
  { name: "Mistral AI", credits: 4 },
  { name: "Qwen", credits: 6 },
];

export const ModelsCreditsIllustration = () => {
  return (
    <div aria-hidden className="relative min-w-xs">
      <div className="flex flex-col gap-4 perspective-dramatic">
        <div className="rotate-x-4">
          <div className="bg-illustration ring-border-illustration relative mr-10 -mb-10 ml-auto flex max-w-[calc(100%-7.5rem)] flex-col rounded-xl p-1 shadow-lg ring-1 shadow-black/6.5">
            {MODELS.map((model) => (
              <div
                key={model.name}
                className="hover:bg-foreground/5 not-hover:text-muted-foreground flex origin-bottom cursor-default items-center gap-2.5 rounded-lg px-3 py-1.5 select-none [&>svg]:size-5"
              >
                <span className="text-sm">{model.name}</span>
                <span className="text-muted-foreground/75 ml-auto text-xs">
                  {model.credits}x
                </span>
              </div>
            ))}
          </div>
          <div className="bg-background/75 ring-border-illustration rounded-2xl p-4 ring-1">
            <div className="text-muted-foreground h-7 text-xs">
              Plan, Build anything...
            </div>
            <div className="flex h-5 justify-between">
              <div className="flex">
                <div className="bg-foreground/5 text-muted-foreground flex h-full items-center rounded-full px-2.5 text-xs">
                  <InfinityIcon className="size-3.5 shrink-0 opacity-75" />
                  <span className="ml-1">Agent</span>
                </div>
                <div className="text-foreground flex cursor-pointer items-center gap-2 rounded-full px-2.5 text-xs">
                  Claude Opus 4.5 <ChevronDown className="size-3" />
                </div>
              </div>
              <div className="bg-foreground/10 flex size-5 rounded-full">
                <ArrowUp className="m-auto size-3 opacity-75" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
