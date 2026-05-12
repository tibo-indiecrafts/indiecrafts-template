export const LayoutIllustration = () => (
  <div aria-hidden className="relative">
    <div className="bg-card ring-border-illustration absolute -top-6 -right-6 bottom-0 left-52 z-1 rounded-xl shadow-2xl ring-1 shadow-indigo-900/35"></div>

    <div className="bg-card/25 border-background/25 rounded-xl border mask-b-from-50%">
      <div className="absolute inset-y-0 left-0 w-48">
        <div className="flex gap-1.5 px-4 pt-4">
          <div className="bg-background/25 border-background/25 size-2 rounded-full border"></div>
          <div className="bg-background/25 border-background/25 size-2 rounded-full border"></div>
          <div className="bg-background/25 border-background/25 size-2 rounded-full border"></div>
        </div>
      </div>
      <div className="border-background/25 ml-auto w-[calc(100%-12rem+1.5px)] border-l">
        <div className="border-background/25 h-11 border-b"></div>
        <div className="relative h-80">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_6px)] opacity-50"></div>
        </div>
      </div>
    </div>
  </div>
);
