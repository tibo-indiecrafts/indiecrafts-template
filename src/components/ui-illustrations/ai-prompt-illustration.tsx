import { Apple, CornerDownLeft, X } from "lucide-react";

/**
 * AI prompt-card illustration — small "Enter instruction" composer
 * floating above two skeleton text rows. The composer has an X
 * close button, a tone picker (Apple icon + "Professional"), and a
 * primary submit chip. The card sits behind a hue-rotating gradient
 * blur halo (`animate-hue-rotate`) for a subtle glow. Used by
 * `sections-bento/bento-07/`'s "Uptime Monitoring" cell. Pure
 * decoration; mock copy stays hardcoded per the illustration rule.
 * Sourced from `@tailark-pro/bento-07` (upstream `AIIllustration1`;
 * renamed `ai-prompt-illustration` for descriptiveness).
 */
export const AiPromptIllustration = () => {
  return (
    <div aria-hidden className="relative min-w-xs pb-16">
      <div className="absolute inset-x-6 top-5 translate-x-2">
        <div className="absolute inset-0 scale-100 opacity-75 blur-lg transition-all duration-300 dark:opacity-50">
          <div className="animate-hue-rotate absolute inset-x-6 top-12 bottom-0 -translate-y-3 bg-linear-to-r/increasing from-pink-400 to-purple-400" />
        </div>
        <div className="bg-illustration/95 ring-border-illustration relative rounded-xl shadow-lg ring-1 shadow-black/6.5 backdrop-blur">
          <X className="absolute top-2 right-2 size-3" aria-hidden="true" />

          <span className="text-muted-foreground block p-3 text-xs">
            Enter instruction
          </span>

          <div className="flex justify-between border-t p-2">
            <span className="hover:bg-foreground/5 text-muted-foreground hover:text-foreground flex h-6 cursor-pointer items-center gap-1.5 rounded-md p-2 duration-100">
              <Apple className="size-3.5 opacity-75" aria-hidden="true" />
              <span className="text-xs">Professional</span>
            </span>
            <div className="bg-primary before:border-foreground/20 relative flex size-6 rounded-md text-white shadow before:absolute before:inset-0 before:rounded-md before:border">
              <CornerDownLeft
                className="m-auto size-3.5 drop-shadow"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="bg-border h-1 w-4/5 rounded-full" />
          <div className="flex items-center gap-1">
            <div className="bg-border h-1 w-2/5 rounded-full" />
            <div className="bg-primary h-1 w-1/5 rounded-full" />
            <div className="bg-border h-1 w-1/5 rounded-full" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <div className="bg-border h-1 w-2/5 rounded-full" />
            <div className="bg-border h-1 w-1/5 rounded-full" />
          </div>
          <div className="flex w-3/4 items-center gap-1">
            <div className="bg-border h-1 w-1/5 rounded-full" />
            <div className="bg-border h-1 w-4/5 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
