import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Fingerprint-scanner illustration — a portrait fingerprint photo
 * masked with `mask-radial-from-0%` so the centre fades, with a
 * floating scan-frame overlay (4 breathing corner brackets +
 * `animate-scan` indigo sweep band). Used by `sections-bento/bento-5/`
 * (rendered inside a force-dark card via `data-theme="dark"`). Pure
 * decoration; mock copy stays hardcoded per the illustration rule.
 * Sourced from `@tailark-pro/bento-5` (upstream
 * `FingerprintScanIllustration`).
 */
export const FingerprintScanIllustration = () => {
  return (
    <div className="relative aspect-square max-w-64">
      <div className="relative flex aspect-square justify-center mask-radial-from-0% mask-radial-to-75%">
        <Image
          src="https://raw.githubusercontent.com/tailark/assets/refs/heads/main/fingerprint-scanner_vtvyyq.png"
          alt=""
          aria-hidden="true"
          className="size-full scale-110 object-cover dark:invert"
          width={224}
          height={224}
          unoptimized
        />
      </div>
      <div className="from-foreground/5 to-foreground/5 absolute inset-18 m-auto aspect-3/4 translate-x-1.5 -translate-y-9.5 border border-white/5 bg-linear-to-b via-transparent">
        <BreathingCornerDecorator className="border-primary" />
        <div className="animate-scan absolute inset-0 z-10">
          <div className="absolute inset-x-0 m-auto h-2 w-2/3 bg-indigo-500 blur-lg" />
        </div>
      </div>
    </div>
  );
};

function BreathingCornerDecorator({ className }: { className?: string }) {
  return (
    <>
      <span
        className={cn(
          "animate-breathing absolute -top-px -left-px block size-2.5 rounded-tl border-t-[1.5px] border-l-[1.5px] border-white",
          className,
        )}
      />
      <span
        className={cn(
          "animate-breathing absolute -top-px -right-px block size-2.5 rounded-tr border-t-[1.5px] border-r-[1.5px] border-white",
          className,
        )}
      />
      <span
        className={cn(
          "animate-breathing absolute -bottom-px -left-px block size-2.5 rounded-bl border-b-[1.5px] border-l-[1.5px] border-white",
          className,
        )}
      />
      <span
        className={cn(
          "animate-breathing absolute -right-px -bottom-px block size-2.5 rounded-br border-r-[1.5px] border-b-[1.5px] border-white",
          className,
        )}
      />
    </>
  );
}
