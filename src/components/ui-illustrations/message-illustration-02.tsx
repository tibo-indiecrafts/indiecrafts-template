export const MessageIllustration = () => {
  return (
    <div aria-hidden className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">Sat 22 Feb</span>
        </div>
        <div className="bg-background ring-foreground/5 mt-1.5 w-3/5 rounded-(--radius) rounded-tl p-3 text-xs shadow-md ring-1 shadow-black/5">
          Hey, I&apos;m having trouble with my account.
        </div>
      </div>

      <div>
        <div className="bg-primary inset-ring-foreground/10 mb-1 ml-auto w-3/5 rounded-(--radius) rounded-br p-3 text-xs text-white shadow-md inset-ring-1 shadow-black/5">
          Distinctio provident nobis repudiandae deleniti necessitatibus.
        </div>
        <span className="text-muted-foreground block text-right text-xs">Now</span>
      </div>
    </div>
  );
};
