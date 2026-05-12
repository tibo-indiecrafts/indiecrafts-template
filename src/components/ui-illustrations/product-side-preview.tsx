import Image from "next/image";
import { cn } from "@/lib/utils";

export type ProductSidePreviewProps = {
  alt?: string;
  className?: string;
};

/**
 * Side-masked product preview — angled-stripe backdrop + radial-mask
 * fade from the left, with two stacked screenshot cards (front + back
 * extending right). Used by `sections-secondary-hero/secondary-hero-18`
 * and `secondary-hero-19`. Mock imagery is decorative; treat as
 * illustrations-only (no translations).
 */
export const ProductSidePreview = ({
  alt = "App preview",
  className,
}: ProductSidePreviewProps) => (
  <div className={cn("relative h-full overflow-hidden", className)}>
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-65"
      style={{
        backgroundImage: `
          repeating-linear-gradient(22.5deg, transparent, transparent 1px, rgba(75, 85, 99, 0.06) 1px, rgba(75, 85, 99, 0.06) 2px, transparent 2px, transparent 4px),
          repeating-linear-gradient(67.5deg, transparent, transparent 1px, rgba(107, 114, 128, 0.05) 1px, rgba(107, 114, 128, 0.05) 2px, transparent 2px, transparent 4px),
          repeating-linear-gradient(112.5deg, transparent, transparent 1px, rgba(55, 65, 81, 0.04) 1px, rgba(55, 65, 81, 0.04) 2px, transparent 2px, transparent 4px),
          repeating-linear-gradient(157.5deg, transparent, transparent 1px, rgba(31, 41, 55, 0.03) 1px, rgba(31, 41, 55, 0.03) 2px, transparent 2px, transparent 4px)
        `,
      }}
    />
    <div className="pointer-events-none h-full mask-radial-[115%_100%] mask-radial-from-45% mask-radial-at-left">
      <div className="relative max-w-lg min-w-md px-6 pt-12 pb-12 lg:px-12 lg:pt-16">
        <div className="bg-background ring-foreground/10 absolute top-8 right-[-9rem] bottom-8 left-36 z-10 min-w-3xl overflow-hidden rounded-2xl p-1 shadow-2xl ring-1 shadow-indigo-900/35 backdrop-blur md:right-[-14rem] lg:top-12 lg:bottom-6 lg:left-44 lg:max-w-6xl">
          <div className="relative aspect-video origin-top rounded-xl">
            <Image
              className="size-full object-cover object-top-left dark:hidden"
              src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-4_lkhxqm.png"
              alt={alt}
              width={2880}
              height={1920}
              sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
            />
            <Image
              className="size-full object-cover object-top-left not-dark:hidden"
              src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-4-dark_m2mfxo.png"
              alt={alt}
              width={2880}
              height={1920}
              sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
            />
          </div>
        </div>
        <div className="dark:from-card dark:bg-card via-background from-muted to-background ring-foreground/10 border-background min-w-2xl rounded-xl border bg-linear-to-b p-1 shadow-2xl ring-1 shadow-black/5 lg:max-w-6xl">
          <div className="relative aspect-video origin-top overflow-hidden rounded-lg">
            <Image
              className="size-full object-cover object-top-left mix-blend-darken dark:hidden"
              src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle_un3f39.png"
              alt={alt}
              width={2880}
              height={1920}
              sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
            />
            <Image
              className="size-full object-cover object-top-left opacity-65 not-dark:hidden"
              src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-dark_cv2taw.png"
              alt={alt}
              width={2880}
              height={1920}
              sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);
