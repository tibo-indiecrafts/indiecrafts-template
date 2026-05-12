import { Cohere } from "@/components/ui-primitives/svgs/cohere";
import { Deepseek } from "@/components/ui-primitives/svgs/deepseek";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";

const MODELS = [
  { name: "Deepseek", Icon: Deepseek },
  { name: "Cohere AI", Icon: Cohere },
  { name: "Gemini", Icon: Gemini },
  { name: "Open AI", Icon: OpenAI },
  { name: "Mistral AI", Icon: MistralAi },
] as const;

/**
 * Horizontal row of five AI-model SVG glyphs (Deepseek, Cohere AI,
 * Gemini, Open AI, Mistral AI) with the Gemini logo highlighted in
 * the middle behind a soft glow + ring. Pure decoration; mock copy
 * stays hardcoded per the illustration rule. Sourced from
 * `@tailark-pro/bento-08` (upstream `Models2Illustration`; renamed to
 * `models-row-illustration` to differentiate from our existing
 * `models-illustration` (chat composer + credits).
 */
export const ModelsRowIllustration = () => {
  return (
    <div aria-hidden className="relative min-w-xs mask-x-from-75% py-6">
      <div className="relative">
        <Gemini className="absolute inset-0 m-auto size-14 blur-md dark:opacity-50" />
        <div className="ring-border-illustration dark:ring-foreground/15 dark:inset-shadow-foreground/6.5 not-dark:bg-illustration absolute inset-0 m-auto size-14 rounded-full shadow-lg ring-1 inset-shadow-sm shadow-black/6.5" />

        <div className="flex items-center gap-6">
          {MODELS.map((model, index) => (
            <div
              key={index}
              className="flex size-14 rotate-x-5 items-center gap-2.5 *:m-auto not-nth-3:opacity-75 [&>svg]:size-6"
            >
              <model.Icon
                className={model.name === "Open AI" ? "fill-foreground" : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-foreground/65 mt-3 text-center text-sm font-medium">
        Gemini
      </div>
    </div>
  );
};
