import Image from "next/image";
import { useScopedT } from "@/components/_lib/scoped-t";
import { team04Namespace } from "./config";
import type { TeamBlock } from "./schema";

export default function Team(props: Readonly<TeamBlock>) {
  const [, , tRoot] = useScopedT(team04Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="bg-background @container py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-4">
          <h2 id={headingId} className="text-4xl font-medium text-balance">
            {tRoot(props.titleKey)}
          </h2>
          <p className="text-muted-foreground text-balance">{tRoot(props.bodyKey)}</p>
        </div>
        <div className="mt-12 grid gap-12 text-sm">
          {props.members.map((member, index) => {
            const name = tRoot(member.nameKey);
            return (
              <div key={index} className="relative grid grid-cols-[auto_1fr] gap-4">
                <div
                  aria-hidden
                  className="absolute -inset-x-6 inset-y-1 max-h-26 border-y"
                />
                <div
                  aria-hidden
                  className="absolute inset-x-1 -inset-y-6 w-26 border-x"
                />
                <div className="before:border-foreground/10 shadow-foreground/6.5 relative size-28 shrink-0 rounded-xl shadow-md before:absolute before:inset-0 before:rounded-xl before:border dark:shadow-black/6.5">
                  <Image
                    src={member.avatarUrl}
                    alt={name}
                    className="rounded-xl object-cover"
                    width={120}
                    height={120}
                  />
                </div>

                <div className="flex flex-col justify-between gap-6 py-1">
                  <div className="space-y-0.5">
                    <p className="text-foreground text-base font-medium">{name}</p>
                    <p className="text-muted-foreground text-sm">
                      {tRoot(member.roleKey)}
                    </p>
                  </div>

                  <p className="text-muted-foreground text-sm text-balance">
                    {tRoot(member.bioKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
