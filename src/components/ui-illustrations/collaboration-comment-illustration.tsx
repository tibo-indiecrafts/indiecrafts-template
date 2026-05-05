"use client";
import { ArrowUp, SmilePlus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

type Reaction = {
  emoji: string;
  count: number;
  active: boolean;
};

const INITIAL_REACTIONS: readonly Reaction[] = [
  { emoji: "🔥", count: 2, active: false },
  { emoji: "🚀", count: 12, active: false },
];

const EMOJI_POOL = ["👍", "❤️", "😂", "😮", "😢", "👏"] as const;

/**
 * Collaboration comment thread illustration — radially-masked
 * placeholder document on the left with an avatar pin + comment card
 * on the right. The comment card has reactions (toggleable counts), a
 * close button (toggles card visibility), and a reply footer. Pure
 * decoration; mock copy stays hardcoded per the illustration rule.
 * Sourced from `@tailark-pro/expandable-features-12` (upstream
 * `CollbarationCommentIllustration` — typo "Collbaration" corrected
 * here).
 */
export const CollaborationCommentIllustration = () => {
  const [reactions, setReactions] = useState<readonly Reaction[]>(INITIAL_REACTIONS);
  const [showComment, setShowComment] = useState(true);

  const toggleReaction = (index: number) => {
    setReactions((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, count: r.active ? r.count - 1 : r.count + 1, active: !r.active }
          : r,
      ),
    );
  };

  const addReaction = () => {
    const randomEmoji = EMOJI_POOL[Math.floor(Math.random() * EMOJI_POOL.length)];
    const existingIndex = reactions.findIndex((r) => r.emoji === randomEmoji);
    if (existingIndex >= 0) {
      toggleReaction(existingIndex);
    } else {
      setReactions((prev) => [...prev, { emoji: randomEmoji, count: 1, active: true }]);
    }
  };

  return (
    <div aria-hidden>
      <div className="peer py-12">
        <div className="min-w-sm space-y-2 mask-radial-[100%_100%] mask-radial-from-65% mask-radial-at-top">
          <div className="bg-foreground/4 border-border/50 mb-4 size-20 rounded-2xl border" />
          {[
            ["w-20", "w-11/12", "w-4/5"],
            ["w-20", "w-20", "w-16"],
            ["w-12", "w-20", "w-16"],
          ].map((row, i) => (
            <div key={i} className="flex gap-2">
              {row.map((w, j) => (
                <div key={j} className={`bg-foreground/6.5 h-1 ${w} rounded`} />
              ))}
            </div>
          ))}
          <div className="space-y-2">
            <div className="bg-foreground/6.5 h-1 w-full rounded" />
            <div className="bg-foreground/6.5 h-1 w-2/12 rounded" />
            <div className="bg-foreground/6.5 h-1 w-1/12 rounded" />
          </div>
        </div>
      </div>

      <div className="group absolute inset-0 m-auto flex size-fit min-w-sm justify-end gap-2">
        <button
          type="button"
          onClick={() => setShowComment(!showComment)}
          className="bg-primary mt-1.5 h-fit shrink-0 cursor-pointer rounded-t-full rounded-r-full p-1.5 shadow-md shadow-black/6.5"
        >
          <div className="before:border-foreground/20 relative size-6 overflow-hidden rounded-full border shadow-md before:absolute before:inset-0 before:rounded-full before:border">
            <Image
              src={SHADCN_AVATAR}
              alt="Shadcn"
              width={56}
              height={56}
              loading="lazy"
            />
          </div>
        </button>

        <div
          data-shown={showComment}
          className="bg-illustration ring-border-illustration relative max-w-2xs origin-top-left rounded-2xl shadow-lg ring-1 shadow-black/6.5 duration-200 not-data-[shown=true]:scale-99 not-data-[shown=true]:opacity-0 group-peer-active:scale-99"
        >
          <button
            type="button"
            onClick={() => setShowComment(false)}
            aria-label="Close comment"
            className="hover:bg-foreground/5 absolute top-1 right-1 flex size-7 rounded-full"
          >
            <X className="m-auto size-3.5" />
          </button>
          <div className="grid grid-cols-[auto_1fr] gap-2.5 p-5">
            <div className="before:border-foreground/20 relative size-7 overflow-hidden rounded-full shadow-md before:absolute before:inset-0 before:rounded-full before:border">
              <Image
                src={SHADCN_AVATAR}
                alt="Shadcn"
                width={56}
                height={56}
                loading="lazy"
              />
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
                  Hey team, I&apos;ve been thinking about the new dashboard redesign.
                </div>
                <div className="text-muted-foreground mt-3 flex flex-wrap gap-2 *:cursor-pointer">
                  {reactions
                    .filter((r) => r.count > 0)
                    .map((reaction) => {
                      const idx = reactions.findIndex((r) => r.emoji === reaction.emoji);
                      return (
                        <button
                          key={reaction.emoji}
                          type="button"
                          onClick={() => toggleReaction(idx)}
                          className={cn(
                            "flex h-6 items-center gap-1 rounded-full px-1.5 transition-colors select-none",
                            reaction.active
                              ? "bg-primary/20 ring-primary/50 ring-1"
                              : "bg-foreground/5 hover:bg-foreground/6.5",
                          )}
                        >
                          <span className="text-sm">{reaction.emoji}</span>
                          <span className="text-xs font-medium">{reaction.count}</span>
                        </button>
                      );
                    })}
                  <button
                    type="button"
                    onClick={addReaction}
                    aria-label="Add reaction"
                    className="bg-foreground/5 hover:bg-foreground/6.5 flex h-6 items-center gap-1 rounded-full px-1.5"
                  >
                    <SmilePlus className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t py-3 pr-3 pl-5">
            <span className="text-foreground/40 text-sm">Reply</span>
            <div className="bg-foreground/10 flex size-5 rounded-full border">
              <ArrowUp className="m-auto size-3.5 opacity-50" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
