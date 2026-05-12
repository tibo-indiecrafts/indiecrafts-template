import { Sparkles, SignalHigh, WifiHigh } from "lucide-react";

export const MobileAiSuggestionIllustration = () => (
  <div
    aria-hidden
    className="relative w-full max-w-92 min-w-92 mask-b-from-75% px-4 pt-2"
  >
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="bg-card ring-border-illustration overflow-hidden rounded-t-[2rem] px-6 pt-2 pb-16 shadow ring-1 shadow-black/6.5">
        <StatusBar />
        <div className="my-6 text-sm font-medium">AI Writer</div>

        <div className="text-muted-foreground space-y-2 text-sm/6">
          <p>
            Web applications with{" "}
            <span className="from-primary rounded bg-linear-to-r to-emerald-500 bg-clip-text px-0.5 text-transparent">
              React and TypeScript
            </span>{" "}
            using best practices.
          </p>
          <p>
            This guide covers component architecture, state management, and performance
            optimization techniques.
          </p>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-0 bg-linear-to-r/increasing from-pink-400/50 to-purple-400/50 opacity-50 blur-xl dark:opacity-35"></div>
          <div className="bg-illustration/95 ring-border-illustration relative rounded-xl p-3 shadow-lg ring-1">
            <div className="flex items-center gap-2">
              <Sparkles className="text-primary fill-primary size-4 *:nth-2:text-purple-400 *:nth-3:text-purple-400" />
              <span className="text-sm font-medium">AI Suggestion</span>
            </div>
            <p className="text-muted-foreground mt-2 text-sm">
              Make it more professional and add technical depth...
            </p>

            <div className="mt-3 flex items-center gap-2">
              <div className="bg-foreground/5 text-foreground/75 rounded-md px-2.5 py-1 text-xs">
                Professional
              </div>
              <div className="bg-foreground/5 text-foreground/75 rounded-md px-2.5 py-1 text-xs">
                Casual
              </div>
              <div className="bg-foreground/5 text-foreground/75 rounded-md px-2.5 py-1 text-xs">
                Concise
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const StatusBar = () => (
  <div className="flex items-center justify-between py-2 pl-4 text-xs">
    <span className="font-semibold">9:41</span>
    <div className="flex items-end gap-1">
      <SignalHigh className="size-4" />
      <WifiHigh className="size-4.5" />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="-mb-px size-4"
      >
        <path
          fillRule="evenodd"
          d="M3.75 6.75a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-.037c.856-.174 1.5-.93 1.5-1.838v-2.25c0-.907-.644-1.664-1.5-1.837V9.75a3 3 0 0 0-3-3h-15Zm15 1.5a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h15ZM4.5 9.75a.75.75 0 0 0-.75.75V15c0 .414.336.75.75.75H18a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 0-.75-.75H4.5Z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  </div>
);

export default MobileAiSuggestionIllustration;
