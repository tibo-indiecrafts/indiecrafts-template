/* eslint-disable -- Acme Pro upstream illustration kept verbatim */

import { SmilePlus } from "lucide-react";
import Image from "next/image";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

export const Message2Illustration = () => (
  <div aria-hidden className="min-w-xs">
    <div className="grid grid-cols-[auto_1fr] gap-2.5">
      <div className="before:border-foreground/20 relative size-9 overflow-hidden rounded-full shadow-md shadow-black/6.5 before:absolute before:inset-0 before:rounded-full before:border">
        <Image src={SHADCN_AVATAR} alt="shadcn" width={56} height={56} />
      </div>
      <div className="space-y-1.5">
        <div className="flex items-end gap-1">
          <div className="text-sm font-medium [text-trim:both]">Shadcn</div>
          <div className="text-foreground/50 border border-transparent text-xs [text-trim:both]">
            6:32 pm
          </div>
        </div>
        <div>
          <div className="text-foreground/65 text-sm/6">
            Hey team, I've been thinking about the new dashboard redesign.
          </div>
          <div className="text-muted-foreground mt-3 flex gap-2 *:cursor-pointer">
            <div className="bg-foreground/5 hover:bg-foreground/6.5 flex h-7 items-center gap-1 rounded-full px-2">
              <span className="text-base">🔥</span>
              <span className="text-xs font-medium">2</span>
            </div>
            <div className="bg-foreground/5 hover:bg-foreground/6.5 flex h-7 items-center gap-1 rounded-full px-2">
              <span className="text-base">🚀</span>
              <span className="text-xs font-medium">12</span>
            </div>
            <div className="bg-foreground/5 hover:bg-foreground/6.5 flex h-7 items-center gap-1 rounded-full px-2">
              <SmilePlus className="size-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Message2Illustration;
