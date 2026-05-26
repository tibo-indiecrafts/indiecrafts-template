import { useScopedT } from "@/components/_lib/scoped-t";
import { cn } from "@/lib/utils";
import { timeline1Items, timeline01Namespace } from "./config";
import type { TimelineBlock } from "./schema";

export default function Timeline(props: Readonly<TimelineBlock>) {
  const [t, tr] = useScopedT(timeline01Namespace);
  const items = props.items ?? timeline1Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="px-4">
      <div className="sm:max-w-lg md:mx-auto">
        <h3 id={titleId} className="text-foreground font-medium">
          {tr(props.titleKey, "title")}
        </h3>
        <p className="text-muted-foreground mt-1 text-sm leading-6">
          {tr(props.descriptionKey, "description")}
        </p>
        <ul className="mt-6 space-y-6 pb-2">
          {items.map((item, idx) => (
            <li className="relative flex gap-x-3" key={item.id}>
              <div
                className={cn(
                  "absolute top-0 left-0 flex w-6 justify-center",
                  idx === items.length - 1 ? "h-6" : "-bottom-6",
                )}
              >
                <span aria-hidden="true" className="bg-border w-px" />
              </div>
              <div className="flex items-start space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-background relative flex size-6 flex-none items-center justify-center">
                    {item.type === "created" ? (
                      <div className="bg-muted/50 ring-background size-3 rounded-full border border-gray-300 ring-4" />
                    ) : (
                      <div className="bg-background ring-background size-3 rounded-full border border-gray-300 ring-4" />
                    )}
                  </div>
                  <span
                    aria-hidden="true"
                    className={cn(
                      item.avatarColor,
                      "text-primary-foreground inline-flex size-6 flex-none items-center justify-center rounded-full text-xs",
                    )}
                  >
                    {t(`items.${item.id}.userInitial`)}
                  </span>
                </div>
                <p className="text-foreground mt-0.5 text-sm font-medium">
                  {t(`items.${item.id}.userName`)}
                  <span className="text-muted-foreground font-normal">
                    {" "}
                    {t(`items.${item.id}.description`)}
                  </span>
                  <span className="text-muted-foreground/60 font-normal">
                    {" "}
                    &#8729; {t(`items.${item.id}.activityTime`)}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
