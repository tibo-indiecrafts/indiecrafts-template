/* eslint-disable @next/next/no-img-element -- external GitHub avatar URLs intentionally use <img> */

import { useScopedT } from "@/i18n/scoped-t";
import { team02Namespace } from "./config";
import type { TeamBlock } from "./schema";

export default function Team(props: Readonly<TeamBlock>) {
  const [, , tRoot] = useScopedT(team02Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-12 md:py-32">
      <div className="mx-auto max-w-3xl px-8 lg:px-0">
        <h2 id={headingId} className="mb-8 text-4xl font-bold md:mb-16 lg:text-5xl">
          {tRoot(props.titleKey)}
        </h2>

        {props.groups.map((group, gi) => (
          <div key={gi} className={gi === 0 ? "" : "mt-6"}>
            <h3 className="mb-6 text-lg font-medium">{tRoot(group.headingKey)}</h3>
            <div className="grid grid-cols-2 gap-4 border-t py-6 md:grid-cols-4">
              {group.members.map((member, mi) => {
                const name = tRoot(member.nameKey);
                return (
                  <div key={mi}>
                    <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5">
                      <img
                        className="aspect-square rounded-full object-cover"
                        src={member.avatarUrl}
                        alt={name}
                        height={460}
                        width={460}
                        loading="lazy"
                      />
                    </div>
                    <span className="mt-2 block text-sm">{name}</span>
                    <span className="text-muted-foreground block text-xs">
                      {tRoot(member.roleKey)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
