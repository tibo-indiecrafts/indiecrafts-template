import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui-primitives/avatar";
import { Card, CardContent } from "@/components/ui-primitives/card";
import { useScopedT } from "@/i18n/scoped-t";
import { gridList02Namespace, gridList02People } from "./config";
import type { GridListBlock } from "./schema";

/**
 * 2-up team-member cards with avatar + name + role. Sourced from
 * `@blocks-so/grid-list-02`.
 */
export default function GridList(props: Readonly<GridListBlock>) {
  const [, tr] = useScopedT(gridList02Namespace);
  const people = props.people ?? gridList02People;
  const titleId = `${props.id}-title`;

  return (
    <section aria-labelledby={titleId} className="flex items-center justify-center p-8">
      <div className="w-full">
        <h2 id={titleId} className="sr-only">
          {tr(props.titleKey, "title")}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {people.map((person) => (
            <li key={person.id}>
              <Card className="hover:border-muted-foreground focus-within:ring-ring relative border py-0 shadow-2xs transition-[border-color,box-shadow] duration-100 ease-out focus-within:ring-2 focus-within:ring-offset-2 hover:shadow-sm">
                <CardContent className="flex items-center space-x-4 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={person.imageUrl} alt={person.name} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <a href={person.href ?? "#"} className="focus:outline-none">
                      <span aria-hidden="true" className="absolute inset-0" />
                      <p className="text-foreground text-sm font-medium text-pretty">
                        {person.name}
                      </p>
                      <p className="text-muted-foreground truncate text-sm text-pretty">
                        {person.role}
                      </p>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
