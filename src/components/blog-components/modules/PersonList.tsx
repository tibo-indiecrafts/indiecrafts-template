import Image from "next/image";
import type { PersonListModule } from "@/sanity/types";

export function PersonList(props: PersonListModule) {
  // Filter null refs that the client couldn't resolve.
  const people = (props.people ?? []).filter(Boolean);
  if (!people.length) return null;
  return (
    <section id={props.anchor} className="mx-auto max-w-6xl px-(--gutter) py-12 md:py-20">
      {props.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{props.title}</h2>
          {props.intro ? (
            <p className="text-muted-foreground mt-3">{props.intro}</p>
          ) : null}
        </header>
      ) : null}
      <ul className="mt-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        {people.map((p) => (
          <li key={p._id} className="flex flex-col items-start gap-3">
            {p.image?.asset?.url ? (
              <Image
                src={p.image.asset.url}
                alt={p.name ?? ""}
                width={96}
                height={96}
                className="size-24 rounded-full object-cover"
              />
            ) : null}
            <div>
              <p className="font-medium">{p.name}</p>
              {p.role ? <p className="text-muted-foreground text-sm">{p.role}</p> : null}
            </div>
            {p.bio ? <p className="text-muted-foreground text-sm">{p.bio}</p> : null}
            {p.social?.length ? (
              <ul className="flex flex-wrap gap-3 text-sm">
                {p.social
                  .filter((link) => link?.href)
                  .map((link, i) => (
                    <li key={i}>
                      <a
                        href={link.href}
                        target={link.newTab ? "_blank" : undefined}
                        rel={link.newTab ? "noopener noreferrer" : undefined}
                        className="text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                      >
                        {link.label ?? link.href}
                      </a>
                    </li>
                  ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
