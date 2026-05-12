import { Clock, Star, MapPin } from "lucide-react";
import Image from "next/image";

export const FoodDeliveryIllustration = () => (
  <div aria-hidden className="relative min-w-92 mask-t-from-75% px-4 pb-2">
    <div className="bg-background/75 ring-border-illustration mx-auto items-end overflow-hidden rounded-b-[2.5rem] border border-transparent px-2 pb-2 shadow-md ring-1 shadow-black/6.5">
      <div className="dark:bg-background ring-border-illustration bg-muted rounded-b-[2rem] pt-32 shadow ring-1">
        <div className="bg-card ring-border-illustration rounded-t-3xl rounded-b-[2rem] p-6 ring-1">
          <div className="mb-4 text-sm font-medium">Order Tracking</div>

          <div className="flex gap-4">
            <div className="bg-muted before:border-foreground/5 relative size-20 shrink-0 overflow-hidden rounded-xl before:absolute before:inset-0 before:rounded-xl before:border">
              <Image
                src="https://raw.githubusercontent.com/tailark/assets/refs/heads/main/burger_vndgo4.jpg"
                alt="burger image"
                width={640}
                height={471}
                className="size-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="text-foreground font-medium">Burger Palace</div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <div className="flex items-center gap-0.5 text-amber-400">
                  <Star className="size-3 fill-current" />
                  <span>4.8</span>
                </div>
                <span className="text-muted-foreground">(234)</span>
              </div>
              <div className="mt-2 flex gap-1">
                <span className="bg-muted rounded-full px-2 py-0.5 text-xs">Burgers</span>
                <span className="bg-muted rounded-full px-2 py-0.5 text-xs">
                  American
                </span>
              </div>
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
                  <div className="text-foreground/50 text-xs">Restaurant</div>
                  <div className="text-foreground text-sm font-medium">Burger Palace</div>
                </div>
                <div>
                  <div className="text-foreground/50 text-xs">Delivery to</div>
                  <div className="text-foreground text-sm font-medium">
                    123 Main Street
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-foreground flex items-center gap-3 pl-px text-sm">
              <Clock className="size-3.5" />
              <span className="font-medium">Arriving in 20-30 min</span>
            </div>
            <span className="text-foreground font-semibold">$14.48</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FoodDeliveryIllustration;
