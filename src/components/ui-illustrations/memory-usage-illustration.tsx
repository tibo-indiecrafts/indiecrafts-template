import { cn } from "@/lib/utils";

export const MemoryUsageIllustration = ({
  borderPosition = "top",
}: {
  borderPosition?: "top" | "bottom";
} = {}) => (
  <div
    aria-hidden
    className={cn(
      "-mx-8 -mb-8 flex flex-col justify-end mask-r-from-55% mask-l-from-85% px-8 pt-4 pb-8",
      borderPosition === "top" ? "border-t" : "border-b",
    )}
  >
    <div className="space-y-2.5">
      <span className="text-foreground block text-sm font-medium">Memory Usage</span>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground text-sm">56 GB / 128 GB</span>
        <span className="text-foreground">45%</span>
      </div>
      <div className="bg-muted relative my-1.5 h-1.5 rounded-full before:absolute before:inset-0 before:z-1 before:w-2/5 before:rounded-full before:bg-linear-to-r before:from-emerald-500 before:to-indigo-400 after:absolute after:inset-0 after:w-2/5 after:bg-linear-to-r after:from-white after:to-indigo-400 after:opacity-50 after:blur-xs dark:before:from-white" />
    </div>
  </div>
);
