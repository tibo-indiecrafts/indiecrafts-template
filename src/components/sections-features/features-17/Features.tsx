import { LayoutIllustration } from "@/components/ui-illustrations/layout-illustration";
import { useScopedT } from "@/components/_lib/scoped-t";
import { features17Namespace } from "./config";
import type { FeaturesBlock } from "./schema";

export default function Features(props: Readonly<FeaturesBlock>) {
  const [, tr] = useScopedT(features17Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="bg-background py-24">
      <div className="mx-auto w-full max-w-5xl px-(--gutter)">
        <div className="relative">
          <div className="z-10 max-w-xl">
            <h2 id={`${props.id}-title`} className="mb-4 text-4xl font-semibold">
              {tr(props.titleKey, "title")}
            </h2>
            <p className="mb-8 text-lg">
              {tr(props.bodyKey, "body")}
              {props.bodyMutedKey ? (
                <>
                  {" "}
                  <span className="text-muted-foreground">
                    {tr(props.bodyMutedKey, "bodyMuted")}
                  </span>
                </>
              ) : null}
            </p>
          </div>

          <div className="-translate-x-44 md:translate-x-0">
            <LayoutIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
