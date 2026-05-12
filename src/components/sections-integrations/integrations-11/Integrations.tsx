import type { ComponentType, SVGProps } from "react";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { GooglePaLM } from "@/components/ui-primitives/svgs/google-palm";
import { Linear } from "@/components/ui-primitives/svgs/linear";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { Vercel } from "@/components/ui-primitives/svgs/vercel";
import { cn } from "@/lib/utils";
import type { IntegrationIcon, IntegrationsBlock } from "./schema";

const ICONS: Record<IntegrationIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  linear: Linear,
  vercel: Vercel,
  claude: Claude,
  gemini: Gemini,
  googlePalm: GooglePaLM,
  openai: OpenAI,
};

export default function Integrations(props: Readonly<IntegrationsBlock>) {
  return (
    <section aria-labelledby={`${props.id}-heading`} className="bg-background py-24">
      <h2 id={`${props.id}-heading`} className="sr-only">
        Integrations
      </h2>
      <div className="mx-auto max-w-5xl px-6">
        <div className="mx-auto max-w-xl">
          <div
            aria-hidden
            className="aspect-ratio *:ring-border grid grid-cols-8 gap-px *:flex *:aspect-square *:rounded-xl *:ring-1 sm:grid-cols-10"
          >
            {props.rows.flatMap((row, rowIndex) =>
              row.map((cell, cellIndex) => {
                const isEdge = cellIndex === 0 || cellIndex === row.length - 1;
                if (cell === null) {
                  return (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      aria-hidden
                      className={cn(isEdge && "max-sm:hidden")}
                    />
                  );
                }
                const Icon = ICONS[cell];
                return (
                  <div
                    key={`${rowIndex}-${cellIndex}`}
                    className="bg-illustration relative shadow-md shadow-black/10"
                  >
                    <Icon className="m-auto size-6" />
                  </div>
                );
              }),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
