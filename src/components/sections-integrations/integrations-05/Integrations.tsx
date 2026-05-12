import type { ComponentType, SVGProps } from "react";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Stripe } from "@/components/ui-primitives/svgs/stripe";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { useScopedT } from "@/i18n/scoped-t";
import { integrations05Namespace } from "./config";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  gemini: Gemini,
  claude: Claude,
  openai: OpenAI,
  vercel: Vercel,
  stripe: Stripe,
};

const SLOT_CLASSES = [
  "col-start-4 flex items-center justify-center border-b border-l max-md:row-start-4 max-md:border-t md:col-start-10",

  "col-start-3 row-start-5 flex items-center justify-center border-l border-t md:col-start-9 md:row-start-2",

  "col-start-4 row-start-5 flex items-center justify-center border-l md:col-start-10 md:row-start-2",

  "col-start-2 row-start-6 flex items-center justify-center border-l border-t md:col-start-8 md:row-start-3",

  "col-start-3 col-end-5 row-start-6 flex items-center justify-center border-l border-t md:col-start-9 md:col-end-11 md:row-start-3",
] as const;

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  const [, , tRoot] = useScopedT(integrations05Namespace);

  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-4 grid-rows-6 border *:border-dashed md:grid-cols-10 md:grid-rows-3">
          <div className="col-span-full row-span-3 space-y-4 p-8 md:col-span-7">
            <h2
              id={`${props.id}-heading`}
              className="text-3xl font-semibold text-balance md:text-4xl"
            >
              {tRoot(props.headerTitleKey)}
            </h2>
            <p className="text-muted-foreground text-balance md:text-lg">
              {tRoot(props.headerBodyKey)}
            </p>
          </div>

          {props.icons.map((iconKey, index) => {
            const Icon = ICONS[iconKey];
            const isWide = index === 4;
            return (
              <div key={index} className={SLOT_CLASSES[index]}>
                <Icon className={isWide ? "h-6 w-16" : "size-6"} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
