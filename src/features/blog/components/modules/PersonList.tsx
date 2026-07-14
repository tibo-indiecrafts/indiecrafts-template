import Image from "next/image";
import type { PersonListModule } from "@/features/blog/sanity/types";
import { ModuleSection } from "./ModuleSection";

/**
 * Team module — design ported from `sections-team/team-05` in the
 * sibling library: compact 2-column grid (3 columns on container-xl+),
 * 28-size rounded square avatars with a subtle inner border + drop
 * shadow, name + role below each.
 */
export function PersonList({
  inline,
  ...props
}: PersonListModule & { inline?: boolean }) {
  // Filter null refs that the client couldn't resolve.
  const people = (props.people ?? []).filter(Boolean);
  if (!people.length) return null;
  return (
    <ModuleSection anchor={props.anchor} inline={inline} className="@container">
      <ul className="mx-auto grid max-w-2xl grid-cols-2 gap-x-3 gap-y-6 text-sm @xl:grid-cols-3 @xl:gap-x-6 @xl:gap-y-12">
        {people.map((p) => (
          <li key={p._id} className="flex flex-col items-center gap-4 text-center">
            {p.image?.asset?.url ? (
              <div className="before:border-foreground/10 shadow-foreground/6.5 relative size-28 shrink-0 rounded-xl shadow-md before:absolute before:inset-0 before:rounded-xl before:border dark:shadow-black/[0.065]">
                <Image
                  src={p.image.asset.url}
                  alt={p.name ?? ""}
                  width={120}
                  height={120}
                  className="rounded-xl object-cover"
                />
              </div>
            ) : (
              <div aria-hidden="true" className="bg-muted size-28 shrink-0 rounded-xl" />
            )}

            <div className="space-y-1">
              <p className="text-foreground text-sm font-medium">{p.name}</p>
              {p.role ? <p className="text-muted-foreground text-sm">{p.role}</p> : null}
            </div>
          </li>
        ))}
      </ul>
    </ModuleSection>
  );
}
