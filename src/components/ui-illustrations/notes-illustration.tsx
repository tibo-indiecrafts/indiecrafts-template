import { Play } from "lucide-react";

export const NotesIllustration = () => {
  return (
    <div aria-hidden className="max-w-xs">
      <div className="bg-illustration ring-border-illustration relative z-1 rounded-2xl p-6 shadow-lg ring-1 shadow-black/6.5">
        <span className="text-muted-foreground text-xs">
          Today <span className="bg-foreground/50 size-0.5 rounded-full" />{" "}
          <span>09:15 AM</span>{" "}
        </span>
        <div className="mt-1 mb-4 text-lg font-semibold">Marketing Website Launch</div>
        <span className="text-muted-foreground">
          The new marketing website is scheduled to go live next Monday.
        </span>{" "}
        <span className="text-foreground font-medium">
          Key highlights include a redesigned hero section, improved SEO structure,
        </span>{" "}
        <span className="text-muted-foreground">
          and integrated analytics dashboard for tracking conversion rates.
        </span>
        <div className="bg-foreground/10 group relative mt-6 h-fit w-fit cursor-pointer overflow-hidden rounded-full p-px shadow-md shadow-black/5">
          <div className="absolute inset-0 aspect-square -translate-y-1/3 animate-spin bg-linear-to-br/increasing from-emerald-400 via-blue-500 to-indigo-400 mask-r-from-25% mask-r-to-75% opacity-50 duration-2000" />
          <div className="group-hover:bg-illustration bg-background/95 relative flex h-8 items-center gap-1.5 rounded-full px-3 text-sm duration-100">
            <Play className="fill-foreground size-3 *:not-first:opacity-50" />
            03:47
          </div>
        </div>
      </div>
    </div>
  );
};
