import type { StatListModule } from "@/sanity/types";

export function StatList(props: StatListModule) {
  if (!props.stats?.length) return null;
  return (
    <section id={props.anchor} className="mx-auto max-w-6xl px-(--gutter) py-12 md:py-16">
      {props.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold md:text-4xl">{props.title}</h2>
          {props.intro ? (
            <p className="text-muted-foreground mt-3">{props.intro}</p>
          ) : null}
        </header>
      ) : null}
      <dl className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
        {props.stats.map((stat) => (
          <div key={stat._key} className="text-center">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-4xl font-semibold tracking-tight md:text-5xl">
              {stat.value}
            </dd>
            {stat.label ? (
              <p className="text-muted-foreground mt-2 text-sm">{stat.label}</p>
            ) : null}
          </div>
        ))}
      </dl>
    </section>
  );
}
