import { ShieldCheck, Signature } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Verified-ID card mock — name + role on the left, signature glyph
 * boxed on the right, and a "Verified" gradient footer bar (indigo →
 * emerald) with a shield-check icon. Used by `sections-bento/bento-4/`
 * as the middle step of its identity-check formula visualization.
 * Pure decoration; mock copy stays hardcoded per the illustration
 * rule. Sourced from `@tailark-pro/bento-4` (upstream
 * `IDCheckIllustration`).
 */
export const IDCheckIllustration = ({ className }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={cn(
        "before:bg-background before:border-foreground/5 relative mx-auto my-6 w-fit before:absolute before:inset-x-2 before:top-2 before:-bottom-2 before:rounded-xl before:border before:shadow",
        className,
      )}
    >
      <div className="border-border-illustration bg-illustration relative overflow-hidden rounded-xl border shadow-md shadow-black/6.5">
        <div className="grid grid-cols-[1fr_auto] gap-6 p-3">
          <div className="text-left text-sm">
            <div className="text-foreground">Méschac Irung</div>
            <div className="text-muted-foreground text-xs">CEO, Acme</div>
          </div>
          <div className="border p-2">
            <Signature className="size-5" />
          </div>
        </div>
        <div className="border-foreground/5 flex items-center gap-1 border-t bg-linear-to-br from-indigo-400 to-emerald-600 p-2 text-sm">
          <ShieldCheck className="size-4 text-white drop-shadow-sm" />
          <span className="text-white">Verified</span>
        </div>
      </div>
    </div>
  );
};
