import Image from "next/image";
import { cn } from "@/lib/utils";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

/**
 * Add-comment chat-bubble illustration — small floating "Add a
 * comment..." composer with a Shadcn avatar, sitting above a
 * sentence containing a primary-underlined "Tomorrow 8:30 pm"
 * fragment. Used by `sections-bento/bento-11/`'s "Team
 * Collaboration" cell. Pure decoration; mock copy stays hardcoded
 * per the illustration rule. Sourced from `@tailark-pro/bento-11`
 * (upstream `AddCommentIllustration`).
 */
export const AddCommentIllustration = ({ className }: { className?: string }) => {
  return (
    <div aria-hidden className={cn("relative mt-8", className)}>
      <div className="bg-illustration ring-border-illustration absolute flex h-10 -translate-x-1/8 -translate-y-[110%] items-center gap-3 rounded-lg border border-transparent py-1 pr-12 pl-2 shadow-lg ring-1 shadow-black/6.5">
        <div className="before:border-foreground/20 relative size-6 overflow-hidden rounded-full shadow-md before:absolute before:inset-0 before:rounded-full before:border">
          <Image
            className="aspect-square rounded-full object-cover"
            src={SHADCN_AVATAR}
            alt="Shadcn"
            height={60}
            width={60}
          />
        </div>
        <span className="text-muted-foreground block text-sm">Add a comment...</span>
      </div>
      <span className="text-muted-foreground">
        <span className="border-primary text-primary border-b-2 py-1">
          Tomorrow 8:30 pm
        </span>{" "}
        is our highest priority.
      </span>
    </div>
  );
};
