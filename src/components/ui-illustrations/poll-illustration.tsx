import Image from "next/image";

const POLL_AVATARS = [
  { src: "https://avatars.githubusercontent.com/u/47919550?v=4", alt: "Méschac Irung" },
  { src: "https://avatars.githubusercontent.com/u/31113941?v=4", alt: "Bernard Ngandu" },
] as const;

/**
 * Poll-timeline illustration — vertical dotted rail with three pinned
 * events ("Poll Created" → user-vote bubble with stacked avatars →
 * "Poll Closed"). Pure decoration; mock timestamps and labels stay
 * hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/features-3`.
 */
export const PollIllustration = () => {
  return (
    <div aria-hidden className="relative w-full select-none">
      <div className="relative w-full space-y-2 py-4">
        <div className="absolute inset-y-0 left-0 w-px [background-image:linear-gradient(180deg,var(--color-foreground)_1px,transparent_1px)] bg-[length:1px_4px] bg-repeat-y opacity-25" />

        <div className="pl-5">
          <div className="text-foreground before:border-muted-foreground before:bg-background before:ring-background relative mt-0.5 inline-flex items-center gap-2 text-sm font-medium before:absolute before:inset-y-0 before:-left-[22px] before:my-auto before:size-[5px] before:rounded-full before:border before:ring">
            <div className="text-muted-foreground text-xs">06 AM</div>
            Poll Created
          </div>
        </div>

        <div className="bg-illustration ring-border-illustration relative -mx-5 flex rounded-xl border border-transparent py-1 pr-4 pl-2 text-xs shadow ring-1 shadow-black/10">
          <div className="before:border-primary before:bg-background before:ring-background relative mt-0.5 ml-7 inline-flex items-center gap-2 text-sm font-medium before:absolute before:inset-y-0 before:-left-[19px] before:my-auto before:size-[5px] before:rounded-full before:border before:ring">
            <div className="flex items-center -space-x-2">
              {POLL_AVATARS.map((avatar) => (
                <div
                  key={avatar.alt}
                  className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5 *:rounded-full"
                >
                  <Image
                    src={avatar.src}
                    className="aspect-square rounded-[calc(var(--avatar-radius)-2px)] object-cover"
                    alt={avatar.alt}
                    loading="lazy"
                    width={46}
                    height={46}
                  />
                </div>
              ))}
            </div>
            +50 Users voted
          </div>
        </div>

        <div className="pl-5">
          <div className="text-foreground before:border-muted-foreground before:bg-background before:ring-background relative mt-0.5 inline-flex items-center gap-2 text-sm font-medium before:absolute before:inset-y-0 before:-left-[22px] before:my-auto before:size-[5px] before:rounded-full before:border before:ring">
            <div className="text-muted-foreground text-xs">01 PM</div>
            Poll Closed
          </div>
        </div>
      </div>
    </div>
  );
};
