import { cn } from "@/lib/utils";

type DocType = "PDF" | "DOC" | "TXT";

const DOC_TYPES: readonly DocType[] = ["PDF", "DOC", "TXT"];

const BADGE_TONES: Record<DocType, string> = {
  PDF: "bg-rose-500 shadow-rose-900/25",
  DOC: "bg-blue-500 shadow-blue-900/25",
  TXT: "bg-orange-600 shadow-orange-900/25",
};

/**
 * Three-card stack of file-type document mocks (PDF / DOC / TXT)
 * with corner-bevel cards, skeleton dash rows, and a coloured file-
 * type badge floating bottom-right of each card. Used by
 * `sections-bento/bento-7/`'s "Supported Files" cell, which animates
 * the stack upward on hover (`*:group-hover:-translate-y-[225%]`).
 * Pure decoration; mock copy stays hardcoded per the illustration
 * rule. Sourced from `@tailark-pro/bento-7` (upstream
 * `DocumentsIllustration`; renamed to `documents-stack-illustration`
 * to differentiate from our existing single `document-illustration`).
 */
export const DocumentsStackIllustration = () => {
  return (
    <div className="relative z-10 flex h-20 w-fit flex-col gap-6">
      {DOC_TYPES.map((type) => (
        <div key={type} className="relative">
          <div
            className={cn(
              "after:border-foreground/15 absolute -right-3 bottom-2 z-2 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg text-shadow-sm after:absolute after:inset-0 after:rounded after:border",
              BADGE_TONES[type],
            )}
          >
            {type}
          </div>
          <div className="bg-illustration corner-tr-bevel ring-border-illustration relative z-1 w-16 space-y-3 rounded-md rounded-tr-[15%] p-3 shadow-md ring-1 shadow-black/6.5">
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="bg-foreground/10 h-0.5 w-full rounded-full" />
              </div>
              <div className="flex gap-1">
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
              </div>
              <div className="flex gap-1">
                <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/2 rounded-full" />
              </div>
              <div className="flex gap-1">
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
              </div>
              <div className="flex gap-1">
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-2/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
              </div>
              <div className="flex gap-1">
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
                <div className="bg-foreground/10 h-0.5 w-1/3 rounded-full" />
              </div>
            </div>
            <div className="flex gap-1 pt-1">
              <div className="bg-foreground h-0.5 w-4 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
