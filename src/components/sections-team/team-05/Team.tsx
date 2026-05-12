import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import { team05Namespace } from "./config";
import type { TeamBlock } from "./schema";

export default function Team(props: Readonly<TeamBlock>) {
  const [, , tRoot] = useScopedT(team05Namespace);
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
        <div className="mt-12 grid grid-cols-2 gap-3 gap-y-6 text-sm @xl:grid-cols-3 @xl:gap-6 @xl:gap-12">
          {props.members.map((member, index) => {
            const name = tRoot(member.nameKey);
            return (
              <div key={index} className="flex flex-col gap-4">
                <div className="before:border-foreground/10 shadow-foreground/6.5 relative size-28 shrink-0 rounded-xl shadow-md before:absolute before:inset-0 before:rounded-xl before:border dark:shadow-black/6.5">
                  <Image
                    src={member.avatarUrl}
                    alt={name}
                    className="rounded-xl object-cover"
                    width={120}
                    height={120}
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-foreground text-sm font-medium">{name}</p>
                  <p className="text-muted-foreground text-sm">{tRoot(member.roleKey)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
