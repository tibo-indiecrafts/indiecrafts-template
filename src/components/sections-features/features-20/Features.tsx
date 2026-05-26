import type { ComponentType, ReactNode, SVGProps } from "react";
import CodeBlockIllustration from "@/components/ui-illustrations/code-block-illustration";
import { Claude } from "@/components/ui-primitives/svgs/claude";
import { Gemini } from "@/components/ui-primitives/svgs/gemini";
import { IntelliJIDEA } from "@/components/ui-primitives/svgs/intellij";
import { OpenAI } from "@/components/ui-primitives/svgs/open-ai";
import { VisualStudioCode } from "@/components/ui-primitives/svgs/vs-code";
import { Windsurf } from "@/components/ui-primitives/svgs/windsurf";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features20Namespace } from "./config";
import type { FeaturesBlock, IconsWidget, Widget, WidgetIcon } from "./schema";

const ICONS: Record<WidgetIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  intellij: IntelliJIDEA,
  vsCode: VisualStudioCode,
  windsurf: Windsurf,
  gemini: Gemini,
  claude: Claude,
  openAi: OpenAI,
};

const ICON_EXTRA_CLASS: Partial<Record<WidgetIcon, string>> = {
  openAi: "fill-foreground",
};

const RICH_CODE = {
  command: (chunks: ReactNode) => (
    <code className="font-mono text-indigo-400">{chunks}</code>
  ),
  flag: (chunks: ReactNode) => <code className="text-primary font-mono">{chunks}</code>,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr, tRoot] = useScopedT(features20Namespace);

  return (
    <section
      aria-labelledby={props.titleKey ? `${props.id}-title` : undefined}
      className="bg-background @container py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        {props.titleKey ? (
          <div className="mb-12 text-center">
            <h2
              id={`${props.id}-title`}
              className="text-4xl font-semibold text-balance lg:text-5xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
            {props.bodyKey ? (
              <p className="text-muted-foreground mt-4">{tr(props.bodyKey, "body")}</p>
            ) : null}
          </div>
        ) : null}

        <div className="relative @3xl:p-12">
          <div
            aria-hidden
            className="border-foreground/5 pointer-events-none absolute -inset-x-12 inset-y-0 hidden border-y mask-x-from-95% @3xl:block"
          />
          <div
            aria-hidden
            className="border-foreground/5 pointer-events-none absolute inset-x-0 -inset-y-12 hidden border-x mask-y-from-95% @3xl:block"
          />
          <CodeBlockIllustration />

          <div className="relative mt-12 grid gap-6 @sm:grid-cols-2 @xl:gap-12 @2xl:grid-cols-3 @3xl:gap-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -inset-y-12 mx-auto hidden w-[calc(33.333%+1.5rem)] border-x border-dashed mask-y-from-95% @3xl:block @4xl:-inset-y-24 @4xl:w-[calc(33.333%+3rem)]"
            />
            {props.widgets.map((widget, i) => (
              <div key={i} className="space-y-3">
                <h3 className="font-medium">{tRoot(widget.titleKey)}</h3>
                {widget.kind === "icons" ? (
                  <IconRow widget={widget} />
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {tRoot.rich(widget.bodyKey, RICH_CODE)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function IconRow({ widget }: Readonly<{ widget: IconsWidget }>) {
  return (
    <div className="*:bg-foreground/5 grid grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
      {widget.icons.map((iconKey, i) => {
        const Icon = ICONS[iconKey];
        const radius =
          i === 0
            ? "!rounded-l-lg"
            : i === widget.icons.length - 1
              ? "!rounded-r-lg"
              : "";
        const extra = ICON_EXTRA_CLASS[iconKey] ?? "";
        return (
          <div key={iconKey} className={radius}>
            <Icon className={`size-5 ${extra}`.trim()} aria-hidden="true" />
          </div>
        );
      })}
    </div>
  );
}

export type { Widget };
