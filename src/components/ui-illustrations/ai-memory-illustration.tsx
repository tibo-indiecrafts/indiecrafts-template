import { Clock, MessageSquare } from "lucide-react";

/**
 * AI memory dashboard mock — perspective-skewed card showing an
 * "AI Memory" header with an active badge, a "Context Window"
 * progress bar (12K / 16K tokens with two-tone fill), and a
 * "Remembered Context" list of three colored items (purple / blue /
 * cyan) with timestamps. Used by `sections-bento/bento-08/`'s "Smart
 * Home Automation" cell. Pure decoration; mock copy stays
 * hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/bento-08` (upstream `AiMemoryIllustration`).
 */
export const AiMemoryIllustration = () => {
  return (
    <div aria-hidden className="min-w-xs">
      <div className="flex flex-col gap-4 perspective-dramatic">
        <div className="-rotate-4 rotate-x-5 rotate-z-6 mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left pt-1 pl-6">
          <div className="bg-background/75 ring-border-illustration rounded-2xl p-2 shadow-lg ring-1 shadow-black/6.5">
            <div className="flex items-center gap-2 px-4 py-3">
              <div className="text-sm font-medium">AI Memory</div>
              <div className="bg-primary/10 text-primary ml-auto rounded-full px-2 py-0.5 text-xs">
                Active
              </div>
            </div>
            <div className="bg-card ring-border-illustration rounded-xl p-4 ring-1">
              <div className="space-y-3">
                <div className="text-muted-foreground text-xs">Context Window</div>
                <div className="bg-muted relative h-3 overflow-hidden rounded-full">
                  <div className="bg-primary/40 absolute inset-y-0 left-0 w-[30%] rounded-full" />
                  <div className="bg-primary absolute inset-y-0 left-[30%] w-[45%] rounded-full" />
                  <div className="absolute inset-0 flex items-center justify-center text-[8px] font-medium text-white">
                    12K / 16K tokens
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="text-muted-foreground text-xs">Remembered Context</div>
                <div className="space-y-1.5">
                  <MemoryRow
                    label="User prefers dark mode UI"
                    timestamp="2m"
                    tone="purple"
                  />
                  <MemoryRow
                    label="Working on a React project"
                    timestamp="5m"
                    tone="blue"
                  />
                  <MemoryRow
                    label="Asked about authentication best practices"
                    timestamp="8m"
                    tone="cyan"
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="text-muted-foreground">3 conversations stored</div>
                <button type="button" className="text-primary hover:underline">
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type MemoryTone = "purple" | "blue" | "cyan";

const TONE_CLASSES: Record<MemoryTone, { row: string; icon: string }> = {
  purple: {
    row: "bg-purple-500/10 ring-purple-500/20",
    icon: "text-purple-600 dark:text-purple-400",
  },
  blue: {
    row: "bg-blue-500/10 ring-blue-500/20",
    icon: "text-blue-600 dark:text-blue-400",
  },
  cyan: {
    row: "bg-cyan-500/10 ring-cyan-500/20",
    icon: "text-cyan-600 dark:text-cyan-400",
  },
};

function MemoryRow({
  label,
  timestamp,
  tone,
}: Readonly<{ label: string; timestamp: string; tone: MemoryTone }>) {
  const t = TONE_CLASSES[tone];
  return (
    <div className={`flex items-center gap-2 rounded-lg p-2 ring-1 ${t.row}`}>
      <MessageSquare className={`size-3.5 shrink-0 ${t.icon}`} />
      <div className="flex-1 truncate text-[10px]">{label}</div>
      <Clock className="text-muted-foreground size-2.5 shrink-0" />
      <span className="text-muted-foreground text-[10px]">{timestamp}</span>
    </div>
  );
}
