import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { MistralAi } from "@/components/ui-primitives/svgs/mistral-ai";
import { Openai } from "@/components/ui-primitives/svgs/openai";
import { Deepseek } from "@/components/ui-primitives/svgs/deepseek";
import { Cohere } from "@/components/ui-primitives/svgs/cohere";

type Model = {
  name: string;
  icon: React.ReactNode;
};

export const Models2Illustration = () => {
  const models: Model[] = [
    { name: "Deepseek", icon: <Deepseek /> },
    { name: "Cohere AI", icon: <Cohere /> },
    { name: "Gemini", icon: <Gemini /> },
    { name: "Open AI", icon: <Openai className="fill-foreground" /> },
    { name: "Mistral AI", icon: <MistralAi /> },
  ];

  return (
    <div aria-hidden className="relative min-w-xs mask-x-from-75% py-6">
      <div className="relative">
        <Gemini className="absolute inset-0 m-auto size-14 blur-md dark:opacity-50" />

        <div className="ring-border-illustration dark:ring-foreground/15 dark:inset-shadow-foreground/6.5 not-dark:bg-illustration absolute inset-0 m-auto size-14 rounded-full shadow-lg ring-1 inset-shadow-sm shadow-black/6.5" />

        <div className="flex items-center gap-6">
          {models.map((model, index) => (
            <div
              key={index}
              className="flex size-14 rotate-x-5 items-center gap-2.5 *:m-auto not-nth-3:opacity-75 [&>svg]:size-6"
            >
              {model.icon}
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
export default Models2Illustration;
