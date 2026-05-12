import { MapPin, Clock, Car } from "lucide-react";
import Image from "next/image";
const SHADCN_AVATAR = "https://avatars.githubusercontent.com/u/124599?v=4";

export const RideSharingIllustration = () => (
  <div aria-hidden className="relative min-w-92 mask-t-from-75% px-4 pb-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-b-[2.5rem] border border-transparent px-2 pb-2 shadow-md ring-1 shadow-black/6.5">
      <div className="dark:bg-background ring-border-illustration bg-muted rounded-b-[2rem] pt-32 shadow ring-1 shadow-black/6.5">
        <div className="bg-card ring-border-illustration rounded-t-3xl rounded-b-[2rem] p-6 ring-1">
          <div className="mb-6 text-sm font-medium">Your Ride</div>

          <div className="flex items-center gap-3">
            <div className="before:border-foreground/20 relative size-12 overflow-hidden rounded-full before:absolute before:inset-0 before:rounded-full before:border">
              <Image src={SHADCN_AVATAR} alt="Shadcn" width={48} height={48} />
            </div>
            <div className="flex-1">
              <div className="text-foreground font-medium">Shadcn</div>
              <div className="flex items-center gap-1">
                <span className="text-amber-400">★</span>
                <span className="text-muted-foreground text-sm">4.9</span>
              </div>
            </div>
            <div className="space-y-0.5 text-right">
              <div className="text-foreground font-semibold">$12.50</div>
              <div className="text-muted-foreground text-xs">Toyota Camry</div>
            </div>
          </div>

          <div className="border-border mt-4 border-t pt-4">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="border-foreground size-2 rounded-full border"></div>
                <div className="border-foreground/25 h-8.5 border-l border-dashed"></div>
                <MapPin className="text-foreground size-4" />
              </div>
              <div className="flex-1 space-y-3 *:space-y-1.5">
                <div>
                  <div className="text-foreground/50 text-xs">Current Location</div>
                  <div className="text-foreground text-sm font-medium">
                    123 Main Street
                  </div>
                </div>
                <div>
                  <div className="text-foreground/50 text-xs">Destination</div>
                  <div className="text-foreground text-sm font-medium">
                    Central Station
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-foreground flex items-center gap-3 pl-px text-sm">
              <Clock className="size-3.5" />
              <span className="font-medium">Arriving in 3 min</span>
            </div>
            <Car className="text-primary size-5" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default RideSharingIllustration;
