import Image from "next/image";

const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

export const MessageIllustration = () => (
  <div aria-hidden>
    <div className="flex items-center gap-2">
      <Image
        src={MESCHAC_AVATAR}
        className="size-4 rounded-full"
        alt="Méschac Irung"
        loading="lazy"
        width={46}
        height={46}
      />
      <span className="text-sm">Irung</span>
    </div>
    <div className="bg-illustration ring-border-illustration mt-2 w-fit rounded-2xl rounded-tl border border-transparent p-3 text-sm shadow ring-1 shadow-black/10">
      Hey <span className="text-primary">@bernard</span>, I&apos;ve updated the dashboard
      metrics.
    </div>
  </div>
);
