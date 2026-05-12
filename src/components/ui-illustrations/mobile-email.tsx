import { SignalHigh, WifiHigh, Plus } from "lucide-react";

export const MobileEmailIllustration = () => (
  <div aria-hidden className="relative max-w-92 min-w-92 mask-b-from-75% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="ring-border-illustration bg-foreground/6.5 overflow-hidden rounded-t-[2rem] px-6 shadow ring-1 dark:bg-black">
        <StatusBar />

        <div className="bg-illustration -mx-6 rounded-t-[2rem] p-6 pb-16">
          <div className="mb-4 text-xl font-medium">New Message</div>

          <div className="divide-y border-b text-xs *:py-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <span className="text-foreground/50">To:</span>
              </div>
              <div className="bg-foreground/10 flex size-6 rounded-full border">
                <Plus className="m-auto size-3.5" strokeWidth={3} />
              </div>
            </div>
            <div className="flex gap-1">
              <span className="text-foreground/50">Cc:</span>
            </div>
            <div className="flex gap-1">
              <span className="text-foreground/50">Subject:</span>
            </div>
          </div>
          <div className="text-muted-foreground mt-6 space-y-2 text-sm/6">
            <p>
              Web applications with{" "}
              <span className="from-primary rounded bg-linear-to-r to-emerald-500 bg-clip-text px-0.5 text-transparent">
                React and TypeScript
              </span>{" "}
              using best practices.
            </p>
            <p className="mt-1">
              This guide covers component architecture, state management, and performance
              optimization techniques.
            </p>
            <p className="mt-3">Sent from my iPhone</p>
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

export default MobileEmailIllustration;
