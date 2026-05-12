import { SignalHigh, WifiHigh } from "lucide-react";

export const MobileNoteIllustration = () => (
  <div aria-hidden className="relative max-w-92 min-w-92 mask-b-from-75% px-4 pt-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-t-[2.5rem] border border-transparent px-2 pt-2 shadow-md ring-1 shadow-black/6.5">
      <div className="ring-border-illustration bg-foreground/10 overflow-hidden rounded-t-[2rem] px-6 shadow ring-1 shadow-black/6.5 dark:bg-black">
        <StatusBar />

        <div className="before:bg-illustration/75 relative mt-2 before:absolute before:-inset-x-3 before:-top-2 before:bottom-0 before:rounded-t-[1.5rem]">
          <div className="bg-illustration relative -mx-6 rounded-t-[2rem] p-6 pb-32">
            <div className="bg-foreground/15 absolute inset-x-0 top-2 mx-auto h-1 w-12 rounded-full"></div>
            <div className="text-foreground/50 mt-2 mb-3 text-2xl font-black">
              Add a Title...
            </div>
            <div className="text-foreground/50 text-sm">Add a description...</div>
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

export default MobileNoteIllustration;
