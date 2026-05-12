import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui-primitives/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { useScopedT } from "@/i18n/scoped-t";
import { team03Namespace } from "./config";
import type { TeamBlock } from "./schema";

export default function Team(props: Readonly<TeamBlock>) {
  const [, , tRoot] = useScopedT(team03Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId}>
      <div className="bg-muted/50 py-24">
        <div className="@container mx-auto w-full max-w-5xl px-6">
          <div className="mb-12">
            <h2 id={headingId} className="text-foreground text-4xl font-semibold">
              {tRoot(props.titleKey)}
            </h2>
            <p className="text-muted-foreground my-4 text-lg text-balance">
              {tRoot(props.bodyKey)}
            </p>
            <Button asChild variant="outline" className="pr-2">
              <Link href={props.cta.href}>
                {tRoot(props.cta.labelKey)}
                <ChevronRight className="opacity-50" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:gap-y-10 @sm:grid-cols-2 @xl:grid-cols-3">
            {props.members.map((member, index) => {
              const name = tRoot(member.nameKey);
              return (
                <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-3">
                  <Avatar className="ring-foreground/10 size-10 rounded-(--radius) border border-transparent shadow ring-1">
                    <AvatarImage src={member.avatarUrl} alt={name} />
                    <AvatarFallback className="rounded-(--radius)">
                      {name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <span className="text-foreground font-medium">{name}</span>
                    <div className="text-muted-foreground text-sm">
                      {tRoot(member.roleKey)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
