import Image from "next/image";

export const HeroIllustration = () => (
  <div
    aria-hidden
    className="@container mask-[radial-gradient(ellipse_80%_95%_at_50%_0%,#000_80%,transparent_100%)] perspective-dramatic max-lg:pt-12"
  >
    <div className="before:from-foreground/10 relative mx-auto max-w-6xl rotate-x-[0.125deg] px-3 before:absolute before:inset-0 before:inset-x-4 before:top-0 before:z-1 before:rounded-2xl before:bg-linear-to-b before:opacity-20 lg:px-12 lg:pt-20 lg:before:inset-x-12 lg:before:top-20">
      <div className="from-foreground absolute inset-0 z-10 mx-auto w-8 -translate-y-44 rotate-66 rounded-full bg-linear-to-b opacity-5 blur-xl" />
      <div className="from-foreground absolute inset-0 z-10 mx-auto w-16 translate-x-44 -translate-y-32 rotate-66 rounded-full bg-linear-to-b opacity-20 blur-2xl" />
      <div className="bg-foreground/5 border-foreground/10 rounded-2xl border p-1">
        <div className="bg-background ring-foreground/10 relative aspect-square origin-top overflow-hidden rounded-xl shadow ring-1 sm:aspect-3/2">
          {/* Upstream ships only a dark dashboard PNG. `invert dark:invert-0`
              flips RGB in light mode (dark dashboard becomes a light one)
              and leaves the original visible in dark mode. `hue-rotate-180`
              keeps the brand hue close to the source after inversion.
              `fill` is required for `object-cover` to fill the rounded
              parent edge-to-edge — `width`/`height` + `size-full` doesn't
              reliably stretch the underlying <img>. */}
          <Image
            fill
            className="object-cover object-top-left hue-rotate-180 invert dark:hue-rotate-0 dark:invert-0"
            src="https://raw.githubusercontent.com/acme/assets/refs/heads/main/circle-dark_cv2taw.png"
            alt=""
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1123px"
            priority
            fetchPriority="high"
          />
        </div>
      </div>
    </div>
  </div>
);
