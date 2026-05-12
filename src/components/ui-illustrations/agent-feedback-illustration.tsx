import { AlertTriangle, RefreshCw, XCircle } from "lucide-react";

export const AgentFeedbackIllustration = () => {
  return (
    <div aria-hidden className="min-w-xs">
      <div className="bg-card/95 ring-border-illustration rounded-2xl p-6 shadow-lg ring-1 shadow-black/6.5">
        <div className="text-sm font-medium">Self-Correction Loop</div>

        <div className="mt-4 space-y-6">
          <div className="relative">
            <div className="flex items-start gap-2.5">
              <StepNumber>1</StepNumber>
              <div className="flex-1 space-y-2 pt-1">
                <div className="text-xs font-medium">Initial Attempt</div>
                <div className="bg-illustration ring-border-illustration mt-1 rounded-md p-2 font-mono text-[10px] shadow ring-1 shadow-black/5">
                  <span className="text-muted-foreground">fetch(</span>
                  <span className="text-green-600 dark:text-green-400">
                    &quot;/api/users&quot;
                  </span>
                  <span className="text-muted-foreground">)</span>
                </div>
                <div className="mt-1 flex items-center gap-1">
                  <XCircle className="size-3 text-red-500" />
                  <span className="text-xs text-red-600 dark:text-red-400">
                    Validation failed
                  </span>
                </div>
              </div>
            </div>
            <div className="border-border absolute top-8 -bottom-2.5 left-2.5 border-l border-dashed" />
          </div>

          <div className="relative">
            <div className="flex items-start gap-2">
              <StepNumber>2</StepNumber>
              <div className="flex-1 space-y-2 pt-0.5">
                <div className="text-xs font-medium">Analyzing Error</div>
                <div className="bg-illustration ring-border-illustration mt-1 rounded-md p-1 shadow ring-1 shadow-black/5">
                  <div className="space-y-1 border-l-2 border-amber-600 py-1 pr-1 pl-2">
                    <div className="flex items-center gap-1.5">
                      <AlertTriangle className="size-3.5 fill-amber-500/15 text-amber-600 dark:text-amber-400" />
                      <div className="text-xs font-medium text-amber-900 dark:text-amber-300">
                        Warning
                      </div>
                    </div>
                    <div className="text-xs">
                      Missing parameter detected in your prompt
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-border absolute top-8 -bottom-2.5 left-2.5 border-l border-dashed" />
          </div>

          <div className="flex items-start gap-2">
            <div className="ring-border-illustration flex size-5 shrink-0 items-center justify-center rounded-full shadow ring-1">
              <RefreshCw
                className="size-3 animate-spin"
                style={{ animationDuration: "2s" }}
              />
            </div>
            <div className="flex-1 space-y-2 pt-0.5">
              <div className="text-xs font-medium">Retry with Fix</div>
              <div className="mt-1 rounded-md p-2 font-mono text-[10px] shadow ring-1 shadow-blue-900/10 ring-blue-500/50 dark:bg-blue-500/5">
                <span className="text-muted-foreground">fetch(</span>
                <span className="text-green-600 dark:text-green-400">
                  &quot;/api/users&quot;
                </span>
                <span className="text-muted-foreground">
                  , {"{"}headers{"}"}
                </span>
                <span className="text-muted-foreground">)</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <span className="text-muted-foreground text-xs">Validating...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StepNumber({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="ring-border-illustration flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-medium shadow ring-1">
      {children}
    </div>
  );
}
