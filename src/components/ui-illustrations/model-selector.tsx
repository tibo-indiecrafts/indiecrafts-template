import { Check, ChevronDown } from "lucide-react";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Openai } from "@/components/ui-primitives/svgs/openai";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";

export const ModelSelectorIllustration = () => {
  return (
    <div aria-hidden className="min-w-sm mask-b-from-65% px-4 pt-1">
      <div className="bg-card/75 ring-border-illustration rounded-t-2xl p-2 shadow-lg ring-1 shadow-black/6.5">
        <div className="px-3 py-2 text-sm font-medium">Select AI Model</div>

        <div className="bg-background ring-border-illustration space-y-3 rounded-2xl p-3 ring-1">
          <div className="bg-illustration ring-primary/40 shadow-primary/10 group cursor-pointer rounded-lg p-3 shadow-md ring-1 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Openai className="fill-foreground size-4" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-semibold">GPT-4 Turbo</div>
                  <div className="bg-primary/10 text-primary rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                    Recommended
                  </div>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Most capable, best for complex tasks
                </div>
              </div>
              <Check className="text-primary size-4 shrink-0" />
            </div>
          </div>

          <div className="hover:ring-border-illustration/80 bg-illustration ring-border-illustration hover:bg-foreground/5 group cursor-pointer rounded-lg p-3 ring-1 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Claude className="size-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Claude 4.5 Sonnet</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Balanced performance and speed
                </div>
              </div>
            </div>
          </div>

          <div className="hover:ring-border-illustration/80 bg-illustration ring-border-illustration hover:bg-foreground/5 group cursor-pointer rounded-lg p-3 ring-1 transition-all">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Gemini className="size-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">Gemini 2.0 Flash</div>
                <div className="text-muted-foreground mt-1 text-xs">
                  Balanced performance and speed
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="hover:bg-muted border-border mt-3 flex w-full items-center justify-between rounded-lg border px-3 py-2 text-xs transition-colors">
          <span>View all models</span>
          <ChevronDown className="size-3" />
        </button>
      </div>
    </div>
  );
};

export default ModelSelectorIllustration;
