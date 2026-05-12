import { DocumentIllustation } from "@/components/ui-illustrations/grid-2-landing-document-illustration";

export const EnterpriseMessageIllustration = () => (
  <div
    aria-hidden
    className="grid h-full grid-cols-6 gap-px [--color-primary:var(--color-indigo-500)]"
  >
    <div className="grid grid-rows-3 gap-y-px *:p-2!">
      <div data-grid-content />
      <div data-grid-content />
      <div data-grid-content />
    </div>

    <div className="col-span-4 grid grid-rows-3 gap-y-px">
      <div data-grid-content className="flex items-center justify-center gap-2">
        <DocumentIllustation />
        <DocumentIllustation />
        <DocumentIllustation />
      </div>

      <div data-grid-content className="flex flex-col justify-center p-4!">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">M. Irung</span>
          </div>

          <div className="bg-background ring-foreground/5 mt-1.5 w-4/5 rounded-(--radius) rounded-tl p-3 text-xs shadow-md ring-1 shadow-black/5">
            Hey, I&apos;m having trouble with my account.
          </div>
        </div>
      </div>

      <div data-grid-content className="flex flex-col justify-center p-4!">
        <div>
          <div className="bg-primary inset-ring-foreground/10 mb-1 ml-auto w-4/5 rounded-(--radius) rounded-br p-3 text-xs text-white shadow-md inset-ring-1 shadow-black/5">
            Distinctio provident nobis repudiandae deleniti necessitatibus.
          </div>
          <span className="text-muted-foreground block text-right text-xs">Now</span>
        </div>
      </div>
    </div>

    <div className="grid grid-rows-3 gap-y-px *:p-2!">
      <div data-grid-content />
      <div data-grid-content />
      <div data-grid-content />
    </div>
  </div>
);
