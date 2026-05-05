import Image from "next/image";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

/**
 * Chat-style message illustration — ringed circular avatar plus
 * display name and "12m ago" timestamp on top, then a gradient
 * message bubble (`bg-linear-to-b from-illustration to-foreground/5`)
 * with rounded-tl pointer and `@mention` highlight. Sourced from
 * `@tailark-pro/bento-6` (upstream's bento-specific message variant;
 * differs from our default `message-illustration` which uses the
 * Méschac avatar at `size-4` with a flat `bg-illustration` bubble).
 * Pure decoration; mock copy stays hardcoded per the illustration
 * rule.
 */
export const MessageChatIllustration = () => (
  <div aria-hidden>
    <div className="flex items-center gap-2">
      <div className="before:border-foreground/10 relative size-5 before:absolute before:inset-0 before:rounded-full before:border">
        <Image
          src={SHADCN_AVATAR}
          className="size-full rounded-full object-cover"
          alt="Shadcn"
          loading="lazy"
          width={460}
          height={460}
        />
      </div>
      <span className="text-xs font-medium">
        Shadcn <span className="ml-1 opacity-65">12m ago</span>
      </span>
    </div>

    <div className="ring-foreground/10 from-illustration to-foreground/5 mt-2 w-fit rounded-2xl rounded-tl bg-linear-to-b p-3 text-sm shadow-md ring-1 shadow-black/6.5">
      Hey <span className="text-primary">@bernard</span>, I&apos;ve updated the dashboard
      metrics.
    </div>
  </div>
);
