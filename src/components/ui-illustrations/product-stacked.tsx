import Image from "next/image";
import { cn } from "@/lib/utils";

export const ProductStacked = ({ className }: { className?: string }) => {
  return (
    <div className={cn("pointer-events-none relative scale-105", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-x-12 inset-y-12 mx-auto max-w-[92rem] mask-radial-from-55% mask-radial-to-75% opacity-65"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 1px, rgba(75, 85, 99, 0.06) 1px, rgba(75, 85, 99, 0.06) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(67.5deg, transparent, transparent 1px, rgba(107, 114, 128, 0.05) 1px, rgba(107, 114, 128, 0.05) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(112.5deg, transparent, transparent 1px, rgba(55, 65, 81, 0.04) 1px, rgba(55, 65, 81, 0.04) 2px, transparent 2px, transparent 4px),
            repeating-linear-gradient(157.5deg, transparent, transparent 1px, rgba(31, 41, 55, 0.03) 1px, rgba(31, 41, 55, 0.03) 2px, transparent 2px, transparent 4px)
          `,
        }}
      />
      <div className="perspective-[4000px] transform-3d">
        <div className="relative z-1 mx-auto max-w-[96rem] min-w-xl rotate-[344deg] rotate-x-[30deg] rotate-y-[24deg] mask-radial-[200%_100%] mask-radial-from-65% mask-radial-at-top-right pt-12 pl-12 sm:translate-x-6 md:mask-r-from-90% md:pt-20 lg:min-w-6xl xl:translate-x-32">
          <div className="bg-background ring-foreground/10 absolute top-6 right-[-9rem] bottom-0 left-52 z-10 min-w-3xl rounded-2xl p-1 shadow-2xl ring-1 shadow-indigo-900/35 backdrop-blur md:top-14 md:right-[-14rem] lg:left-64 lg:max-w-6xl">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                className="size-full object-cover object-top-left dark:hidden"
                src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-4_lkhxqm.png"
                alt="App preview"
                width={2880}
                height={1920}
                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
              />
              <Image
                className="size-full object-cover object-top-left not-dark:hidden"
                src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-4-dark_m2mfxo.png"
                alt="App preview"
                width={2880}
                height={1920}
                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
              />
            </div>
          </div>
          <div className="dark:from-card dark:bg-card via-background from-muted to-background ring-foreground/10 border-background min-w-4xl rounded-2xl border bg-linear-to-b p-1 shadow-2xl ring-1 shadow-black/5 lg:max-w-6xl">
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                className="size-full object-cover object-top-left mix-blend-darken dark:hidden"
                src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle_un3f39.png"
                alt="App preview"
                width={2880}
                height={1920}
                sizes="(max-width: 640px) 768px, (max-width: 768px) 1024px, (max-width: 1024px) 1280px, 1280px"
              />
              <Image
                className="size-full object-cover object-top-left opacity-65 not-dark:hidden"
                src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-dark_cv2taw.png"
                alt="App preview"
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
};
