import { Card } from "@/components/ui-effects/libre-landing-two-card";
import { Play, Signature } from "lucide-react";
const MESCHAC_AVATAR = "https://avatars.githubusercontent.com/u/47919550?v=4";

export const CodeReviewIllustration = () => {
  return (
    <div aria-hidden className="relative mt-6">
      <Card className="aspect-video w-4/5 translate-y-4 p-3 shadow-lg shadow-black/5 transition-transform duration-200 ease-in-out group-hover:-rotate-3">
        <div className="mb-3 flex items-center gap-2">
          <div className="bg-background size-6 rounded-full border p-0.5 shadow shadow-zinc-950/5">
            <img
              className="aspect-square rounded-full object-cover"
              src={MESCHAC_AVATAR}
              alt="M Irung"
              height="460"
              width="460"
            />
          </div>
          <span className="text-muted-foreground text-sm font-medium">Méschac Irung</span>

          <span className="text-muted-foreground/75 text-xs">2m</span>
        </div>

        <div className="ml-8 space-y-2">
          <div className="bg-foreground/10 h-2 rounded-full"></div>
          <div className="bg-foreground/10 h-2 w-3/5 rounded-full"></div>
          <div className="bg-foreground/10 h-2 w-1/2 rounded-full"></div>
        </div>

        <Signature className="mt-3 ml-8 size-5" />
      </Card>
      <Card className="absolute -top-4 right-0 flex aspect-3/5 w-2/5 translate-y-4 p-2 shadow-lg shadow-black/5 transition-transform duration-200 ease-in-out group-hover:rotate-3">
        <div className="bg-foreground/5 m-auto flex size-10 rounded-full">
          <Play className="fill-foreground/50 m-auto size-4 stroke-transparent" />
        </div>
      </Card>
    </div>
  );
};
