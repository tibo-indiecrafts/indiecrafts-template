import { Play } from "lucide-react";
import type { ReactNode } from "react";
import { Deepseek } from "@/components/ui-primitives/svgs/deepseek";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { QwenLight as Qwen } from "@/components/ui-primitives/svgs/qwen";

type Model = {
  name: string;
  icon: ReactNode;
};

const MODELS: readonly Model[] = [
  { name: "Gemini", icon: <Gemini /> },
  { name: "Open AI", icon: <OpenAI className="fill-foreground" /> },
  { name: "Deepseek", icon: <Deepseek /> },
  { name: "Mistral AI", icon: <MistralAi /> },
  { name: "Qwen", icon: <Qwen className="fill-foreground" /> },
];

/**
 * AI-models picker illustration — perspective-rotated rounded panel
 * titled "Models ▸" listing five LLM options (Gemini, OpenAI,
 * Deepseek, Mistral, Qwen) with their brand glyphs. Pure decoration;
 * mock model labels stay hardcoded per the illustration rule. Sourced
 * from `@tailark-pro/features-carousel-3` (upstream
 * `Models3Illustration`; renamed since no Models1 / Models2 exist).
 */
export const ModelsIllustration = () => {
  return (
    <div aria-hidden className="relative min-w-sm">
      <div className="flex flex-col gap-4 perspective-dramatic">
        <div className="-rotate-4 rotate-x-5 rotate-z-6 mask-radial-[100%_100%] mask-radial-from-75% mask-radial-at-top-left pt-1 pl-6">
          <div className="ring-border-illustration bg-background/75 rounded-tl-2xl px-2 pt-4 shadow-lg ring-1 shadow-black/6.5">
            <div className="text-muted-foreground mb-3 flex items-center gap-2.5 px-3 font-medium">
              Models{" "}
              <Play className="size-2.5 translate-y-0.5 rotate-90 fill-current opacity-50" />
            </div>

            <div className="bg-illustration ring-border-illustration flex flex-col gap-5 rounded-tl-xl pt-5 pl-5 shadow ring-1">
              {MODELS.map((model) => (
                <div
                  key={model.name}
                  className="flex origin-bottom items-center gap-2.5 [&>svg]:size-5"
                >
                  {model.icon}
                  <span className="text-base">{model.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
