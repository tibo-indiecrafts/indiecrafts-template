import { CornerDownLeft, Sparkles } from "lucide-react";

/**
 * AI-autocomplete illustration — an input prompt ("How do I implement |")
 * with a blinking caret and gradient highlight, an "AI Suggestions"
 * dropdown listing three context-aware completions (the first is
 * focused with a `Tab` shortcut chip), and a footer with arrow-key
 * navigation hints. Pure decoration; mock prompts stay hardcoded per
 * the illustration rule. Sourced from `@tailark-pro/features-carousel-01`.
 */
export const AiAutocompleteIllustration = () => {
  return (
    <div aria-hidden className="min-w-2xs">
      <div className="ring-border-illustration relative rounded-lg p-3 ring-1">
        <div className="relative flex w-fit items-center gap-1">
          <div className="absolute inset-0 h-5 bg-linear-to-r via-indigo-500/15 to-emerald-500/15" />
          <span className="text-xs">How do I implement</span>
          <div className="text-primary h-5 w-px animate-pulse bg-current" />
        </div>
      </div>

      <div className="bg-illustration ring-border-illustration mt-2 overflow-hidden rounded-xl shadow-lg ring-1 shadow-black/6.5">
        <div className="bg-primary/10 border-primary/20 flex items-center gap-2 border-b px-3 py-2">
          <Sparkles className="text-primary fill-primary size-3.5" />
          <div className="text-xs font-medium">AI Suggestions</div>
        </div>

        <div className="divide-border divide-y">
          <div className="bg-primary/5 flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors">
            <div className="flex-1 text-xs">...authentication with OAuth 2.0?</div>
            <div className="bg-background ring-border-illustration text-muted-foreground flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] ring-1">
              <CornerDownLeft className="size-2.5" />
              Tab
            </div>
          </div>

          <div className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors">
            <div className="text-muted-foreground flex-1 text-xs">
              ...a dark mode toggle in React?
            </div>
          </div>

          <div className="hover:bg-muted/50 flex cursor-pointer items-center gap-2 px-3 py-2.5 transition-colors">
            <div className="text-muted-foreground flex-1 text-xs">
              ...caching for API responses?
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="text-muted-foreground">3 suggestions</div>
        <div className="text-muted-foreground flex items-center gap-1">
          <span className="bg-background ring-border-illustration rounded px-1 ring-1">
            ↑
          </span>
          <span className="bg-background ring-border-illustration rounded px-1 ring-1">
            ↓
          </span>
          to navigate
        </div>
      </div>
    </div>
  );
};
