import { FileImage, FileText, Search, Sparkles } from "lucide-react";

type Result = {
  title: string;
  content: string;
  filename: string;
  fileIcon: React.ReactNode;
};

const RESULTS: readonly Result[] = [
  {
    title: "Tips and React Hooks Guide",
    content:
      "Complete guide to useState, useEffect, and custom hooks with performance tips...",
    filename: "hooks-guide.pdf",
    fileIcon: <FileText className="text-rose-500" />,
  },
  {
    title: "Tailark Quartz Design system",
    content:
      "Comprehensive design system documentation with components, tokens, and guidelines...",
    filename: "tailark-ds.fig",
    fileIcon: <FileImage className="text-purple-500" />,
  },
];

/**
 * AI search results illustration — a perspective-rotated search input
 * (with an "AI" sparkle chip) above a result list of two file
 * snippets. The active result is highlighted with an emerald ring.
 * Pure decoration; mock copy stays hardcoded per the illustration
 * rule. File-type glyphs use lucide `FileText` / `Figma` (the upstream
 * referenced separate `Pdf` / `Figma` SVGs that weren't actually
 * shipped in the registry, and lucide doesn't export a `Figma` icon
 * — `FileImage` stands in as a distinct file-type glyph). Sourced from
 * `@tailark-pro/expandable-features-11`.
 */
export const AiSearchIllustration = () => {
  return (
    <div aria-hidden className="relative max-w-lg min-w-sm">
      <div className="flex flex-col gap-4 perspective-dramatic">
        <div className="-rotate-4 rotate-x-2 rotate-z-6 space-y-3 mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left pt-1 pl-6">
          <div className="ring-border-illustration flex items-center gap-2 rounded-xl py-2.5 pr-2.5 pl-4 ring-1">
            <Search className="text-muted-foreground size-4 shrink-0" />
            <span className="flex-1 text-xs">React hooks best practices</span>
            <div className="bg-primary/10 ring-primary/20 flex items-center gap-1 rounded-md px-2 py-1 ring-1">
              <Sparkles className="text-primary size-3" />
              <span className="text-primary text-xs">AI</span>
            </div>
          </div>
          <div className="bg-card/75 ring-border-illustration rounded-2xl p-1 shadow-lg ring-1 shadow-black/6.5">
            <div className="space-y-1">
              {RESULTS.map((result, index) => (
                <div
                  key={index}
                  className="not-first:hover:bg-foreground/5 first:bg-illustration flex cursor-pointer gap-3 rounded-xl p-4 select-none first:shadow first:ring-1 first:shadow-black/5 first:ring-emerald-500/50"
                >
                  <div className="*:size-6">{result.fileIcon}</div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium">{result.title}</div>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {result.content}
                    </span>
                    <span className="text-foreground mt-2 block text-xs">
                      Found in{" "}
                      <span className="text-muted-foreground"> {result.filename}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
