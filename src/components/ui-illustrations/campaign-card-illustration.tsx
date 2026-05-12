export const CampaignCardIllustration = () => (
  <div
    aria-hidden
    className="before:bg-background before:bg-card after:bg-card before:border-foreground/10 after:border-foreground/5 group relative -mx-4 mask-b-from-65% px-4 pt-6 before:absolute before:inset-x-6 before:top-4 before:bottom-0 before:z-1 before:rounded-2xl before:border after:absolute after:inset-x-8 after:top-2 after:bottom-0 after:rounded-2xl after:border after:opacity-75"
  >
    <div className="bg-illustration ring-border-illustration relative z-10 rounded-2xl border border-transparent p-4 pb-10 text-xs shadow-lg ring duration-300">
      <div className="mb-0.5 text-sm font-semibold">Campaign</div>
      <div className="mb-4 flex gap-2 text-sm">
        <span>Loyalty program</span>
        <span className="text-muted-foreground">loyalty program</span>
      </div>
      <div className="mb-4 grid gap-2 @md:grid-cols-2">
        <div className="bg-illustration ring-border-illustration flex gap-2 rounded-md p-2 shadow ring-1 shadow-black/6.5">
          <div className="bg-primary w-1 rounded-full" />
          <div>
            <div className="text-sm font-medium">Start Date</div>
            <div className="text-muted-foreground line-clamp-1">Feb 6, 2024 at 00:00</div>
          </div>
        </div>
        <div className="bg-illustration ring-border-illustration flex gap-2 rounded-md p-2 shadow ring-1 shadow-black/6.5">
          <div className="bg-primary w-1 rounded-full" />
          <div>
            <div className="text-sm font-medium">Start Date</div>
            <div className="text-muted-foreground line-clamp-1">Feb 6, 2024 at 00:00</div>
          </div>
        </div>
      </div>

      <p>
        Connected to 12{" "}
        <span className="text-primary font-medium">Marketing Campaigns</span>.
      </p>
    </div>
  </div>
);
