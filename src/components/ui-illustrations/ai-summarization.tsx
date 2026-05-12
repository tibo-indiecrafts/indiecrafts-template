/* eslint-disable -- Acme Pro upstream illustration kept verbatim */

import { Sparkles } from "lucide-react";
import Image from "next/image";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

export const AiSummarizationIllustration = () => {
  return (
    <div aria-hidden className="max-w-xs min-w-xs space-y-3">
      <div className="-m-2 mask-b-from-35% p-2">
        <div className="grid grid-cols-[auto_1fr] gap-2.5">
          <div className="before:border-foreground/20 relative size-9 overflow-hidden rounded-full shadow-md before:absolute before:inset-0 before:rounded-full before:border">
            <Image src={SHADCN_AVATAR} alt="shadcn" width={56} height={56} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-end gap-1">
              <div className="text-sm font-medium [text-trim:both]">Shadcn</div>
              <div className="text-foreground/50 border border-transparent text-xs [text-trim:both]">
                6:32 pm
              </div>
            </div>
            <div className="text-foreground/65 text-sm/6">
              Hey team, I've been thinking about the new dashboard redesign. We should
              prioritize mobile responsiveness and add dark mode support. Also, the
              current loading states need improvement - users are confused when data is
              fetching.
            </div>
          </div>
        </div>
      </div>

      <div className="text-foreground flex items-center gap-2 text-sm">
        <Sparkles className="text-foreground fill-foreground *:not-first:text-foreground/25 size-3.5 *:nth-2:text-purple-400 *:nth-3:text-purple-400" />
        Summarize
      </div>

      <div className="relative">
        <div className="from-primary absolute inset-0 rounded-xl bg-linear-to-r/shorter to-emerald-500 opacity-25 blur-2xl"></div>
        <div className="bg-card/90 ring-border-illustration relative rounded-xl p-3 shadow-md ring-1 shadow-black/6.5">
          <div className="text-foreground text-sm/6">
            Dashboard redesign priorities: mobile-first approach, dark mode
            implementation, and improved loading state UX.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 *:cursor-pointer *:rounded-md *:duration-100 *:active:scale-98">
        <div className="bg-foreground/5 ring-border-illustration rounded px-2 py-1 text-xs font-medium ring-1">
          Brief
        </div>
        <div className="hover:bg-foreground/5 text-muted-foreground rounded px-2 py-1 text-xs">
          Details
        </div>
        <div className="hover:bg-foreground/5 text-muted-foreground rounded px-2 py-1 text-xs">
          Bullets
        </div>
      </div>
    </div>
  );
};

export default AiSummarizationIllustration;
