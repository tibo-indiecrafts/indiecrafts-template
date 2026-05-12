import { IconCheck } from "@tabler/icons-react";
import { useScopedT } from "@/i18n/scoped-t";
import { cn } from "@/lib/utils";
import { timeline2Items, timeline02Namespace } from "./config";
import type { TimelineBlock, TimelineItem } from "./schema";

function Marker({ type }: { type: TimelineItem["type"] }) {
  if (type === "done") {
    return <IconCheck aria-hidden="true" className="text-primary size-5" />;
  }
  if (type === "in-progress") {
    return (
      <div
        aria-hidden="true"
        className="bg-primary ring-background size-2.5 rounded-full ring-4"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="border-border bg-background ring-background size-3 rounded-full border ring-4"
    />
  );
}

export default function Timeline(props: Readonly<TimelineBlock>) {
  const [t, tr] = useScopedT(timeline02Namespace);
  const items = props.items ?? timeline2Items;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="px-4">
      <div className="sm:mx-auto sm:max-w-lg">
        <h3 id={titleId} className="text-foreground font-medium">
          {tr(props.titleKey, "title")}
        </h3>
        <ul className="mt-6 space-y-6">
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
              <div className="flex items-start space-x-2.5">
                <div className="bg-background relative flex size-6 flex-none items-center justify-center">
                  <Marker type={item.type} />
                </div>
                <div>
                  <p className="text-foreground mt-0.5 text-sm font-medium">
                    {t(`items.${item.id}.title`)}{" "}
                    <span className="text-muted-foreground/60 font-normal">
                      &#8729; {t(`items.${item.id}.activityTime`)}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm leading-6">
                    {t(`items.${item.id}.description`)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
