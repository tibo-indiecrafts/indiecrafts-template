import type { ComponentType, SVGProps } from "react";
import CodeBlockIllustration from "@/components/ui-illustrations/code-block-illustration";
import { IntelliJIDEA } from "@/components/ui-primitives/svgs/intellij";
import { VisualStudioCode } from "@/components/ui-primitives/svgs/vs-code";
import { Windsurf } from "@/components/ui-primitives/svgs/windsurf";
import { useScopedT } from "@/i18n/scoped-t";
import { features18Namespace } from "./config";
import type { FeaturesBlock, IdeIcon } from "./schema";

const IDE_ICONS: Record<IdeIcon, ComponentType<SVGProps<SVGSVGElement>>> = {
  intellij: IntelliJIDEA,
  vsCode: VisualStudioCode,
  windsurf: Windsurf,
};

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr] = useScopedT(features18Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-background @container py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        <div className="relative grid gap-12 @3xl:grid-cols-3">
          <div className="flex flex-col justify-between gap-12 @3xl:pb-3">
            <div>
              <h2
                id={`${props.id}-title`}
                className="relative z-10 text-3xl font-bold text-balance md:text-4xl"
              >
                {tr(props.titleKey, "title")}
              </h2>
              <p className="text-muted-foreground my-6 max-w-2xl text-lg">
                {tr(props.bodyKey, "body")}
              </p>
            </div>

            <div className="max-w-56 space-y-3">
              <h3 className="font-medium">{tr(props.ideListLabelKey, "ideListLabel")}</h3>
              <div className="*:bg-foreground/5 grid grid-cols-3 gap-0.5 *:flex *:items-center *:justify-center *:rounded *:px-2 *:py-3">
                {props.ides.map((ide, i) => {
                  const Icon = IDE_ICONS[ide];
                  const radius =
                    i === 0
                      ? "!rounded-l-lg"
                      : i === props.ides.length - 1
                        ? "!rounded-r-lg"
                        : "";
                  return (
                    <div key={ide} className={radius}>
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="mt-auto h-fit @3xl:col-span-2">
            <CodeBlockIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
