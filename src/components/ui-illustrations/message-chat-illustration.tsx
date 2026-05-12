import Image from "next/image";

const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

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
