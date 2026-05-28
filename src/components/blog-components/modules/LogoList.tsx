import Image from "next/image";
import type { LogoListModule } from "@/sanity/types";

export function LogoList(props: LogoListModule) {
  // Filter null refs that the client couldn't resolve.
  const logos = (props.logos ?? []).filter(Boolean);
  if (!logos.length) return null;
  return (
    <section id={props.anchor} className="mx-auto max-w-6xl px-(--gutter) py-12 md:py-16">
      {props.title ? (
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-xl font-semibold md:text-2xl">{props.title}</h2>
          {props.intro ? (
            <p className="text-muted-foreground mt-2 text-sm">{props.intro}</p>
          ) : null}
        </header>
      ) : null}
      <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:mt-10">
        {logos.map((logo) =>
          logo.image?.asset?.url ? (
            <li
              key={logo._id}
              className="opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
            >
              <LogoImage logo={logo} />
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}

function LogoImage({ logo }: { logo: NonNullable<LogoListModule["logos"]>[number] }) {
  if (!logo.image?.asset?.url) return null;
  const img = (
    <Image
      src={logo.image.asset.url}
      alt={logo.name ?? ""}
      width={120}
      height={40}
      className="h-8 w-auto"
    />
  );
  return logo.url ? (
    <a href={logo.url} target="_blank" rel="noopener noreferrer">
      {img}
    </a>
  ) : (
    img
  );
}
