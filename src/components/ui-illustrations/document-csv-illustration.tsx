/**
 * CSV-document illustration — corner-bevel mini card with a "CSV"
 * teal badge floating bottom-right and a 7-row × 3-column data
 * grid (header row darker, body rows muted) suggesting tabular
 * data. Used by `sections-how-it-works/how-it-works-04/`'s "Data
 * Collection" step. Pure decoration; no translations. Sourced from
 * `@tailark-pro/how-it-works-04` (upstream `DocumentCsvIllustration`).
 */
export const DocumentCsvIllustration = () => {
  return (
    <div aria-hidden className="relative size-fit">
      <div className="after:border-foreground/15 absolute -right-3 bottom-2 z-2 rounded bg-teal-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-lg shadow-teal-900/25 text-shadow-sm after:absolute after:inset-0 after:rounded after:border">
        CSV
      </div>
      <div className="bg-illustration corner-tr-bevel ring-border-illustration relative z-1 w-16 space-y-2 rounded-md rounded-tr-[15%] p-2 shadow-md ring-1 shadow-black/6.5">
        <div className="space-y-[3px]">
          <div className="flex gap-0.5">
            <div className="bg-foreground/15 h-2 flex-1 rounded-sm" />
            <div className="bg-foreground/15 h-2 flex-1 rounded-sm" />
            <div className="bg-foreground/15 h-2 flex-1 rounded-sm" />
          </div>
          {Array.from({ length: 6 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-0.5">
              <div className="bg-foreground/5 h-2 flex-1 rounded-sm" />
              <div className="bg-foreground/5 h-2 flex-1 rounded-sm" />
              <div className="bg-foreground/5 h-2 flex-1 rounded-sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
