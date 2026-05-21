/* eslint-disable @next/next/no-img-element -- decorative illustration; intrinsic sizing not via next/image */
const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

export const MessageIllustration = () => (
  <div aria-hidden>
    <div className="flex items-center gap-2">
      <img
        src={MESCHAC_AVATAR}
        className="size-6 rounded-full"
        alt="Méschac    Irung"
        width="460"
        height="460"
        loading="lazy"
      />
      <span className="text-muted-foreground text-sm">Méschac Irung</span>
    </div>

    <div className="from-card ring-foreground/10 inset-ring-background/50 mt-2 ml-4 w-fit rounded-tl rounded-tr-2xl rounded-b-2xl rounded-br-2xl bg-linear-to-b to-sky-50 p-3 text-sm text-sky-950 shadow-md ring-1 inset-ring shadow-sky-600/10">
      Hey <span className="text-foreground font-medium">@bernard</span>, I&apos;ve updated
      the dashboard metrics.
    </div>
  </div>
);
