import { BillingTable } from "@/components/ui-illustrations/billing-table";

export const BillingGrid = () => {
  return (
    <div className="relative h-fit">
      <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-between">
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />

        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
        <div className="border-foreground/10 dark:border-foreground/5 h-px border-b border-dashed" />
      </div>
      <div className="absolute inset-0 m-auto max-w-6xl">
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-0 w-1/11 border-l border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-1/11 w-1/11 border-l border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-2/11 w-1/11 border-l border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-3/11 w-1/11 border-x border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-5/11 w-1/11 border-x border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-6/11 w-1/11 border-r border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-7/11 w-1/11 border-r border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-8/11 w-1/11 border-r border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-9/11 w-1/11 border-r border-dashed"></div>
        <div className="border-foreground/10 dark:border-foreground/5 absolute -inset-y-12 left-10/11 w-1/11 border-r border-dashed"></div>
      </div>
      <div className="relative mx-auto max-w-6xl md:px-6 lg:px-12">
        <div className="flex min-h-96 items-center">
          <div className="bg-foreground/5 dark:bg-background/50 mx-auto px-6 py-12 md:px-22">
            <BillingTable />
          </div>
        </div>
      </div>
    </div>
  );
};
