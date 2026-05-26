import Image from "next/image";
import { useScopedT } from "@/components/_lib/scoped-t";
import { team01Namespace } from "./config";
import type { TeamBlock } from "./schema";

export default function Team(props: Readonly<TeamBlock>) {
  const [, tr, tRoot] = useScopedT(team01Namespace);

  return (
    <section
      aria-labelledby={`${props.id}-title`}
      className="bg-muted/40 border-b py-16 md:py-32"
    >
      <div className="mx-auto max-w-5xl border-t px-(--gutter)">
        <span className="bg-background text-muted-foreground -mt-3.5 -ml-6 block w-max px-6 text-xs tracking-wide uppercase">
          {tr(props.eyebrowKey, "eyebrow")}
        </span>
        <div className="mt-12 gap-4 sm:grid sm:grid-cols-2 md:mt-24">
          <div className="sm:w-2/5">
            <h2
              id={`${props.id}-title`}
              className="text-3xl font-bold text-balance sm:text-4xl"
            >
              {tr(props.titleKey, "title")}
            </h2>
          </div>
          <div className="text-muted-foreground mt-6 sm:mt-0">
            <p>{tr(props.introKey, "intro")}</p>
          </div>
        </div>
        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-24 lg:grid-cols-3">
          {props.members.map((member, index) => {
            const name = tRoot(member.nameKey);
            return (
              <li key={index} className="group overflow-hidden">
                <Image
                  className="h-96 w-full rounded-md object-cover object-top grayscale transition-all duration-500 group-hover:h-[22.5rem] group-hover:rounded-xl hover:grayscale-0"
                  src={member.avatarUrl}
                  alt={name}
                  width={826}
                  height={1239}
                  sizes="(max-width: 768px) 100vw, 280px"
                />
                <div className="px-2 pt-2 sm:pt-4 sm:pb-0">
                  <div className="flex justify-between">
                    <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                      {name}
                    </h3>
                    <span className="text-muted-foreground text-xs" aria-hidden="true">
                      _0{index + 1}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-muted-foreground inline-block translate-y-6 text-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {tRoot(member.roleKey)}
                    </span>
                    <a
                      href={member.href}
                      className="text-primary inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 hover:underline"
                      target={member.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        member.href.startsWith("http") ? "noopener noreferrer" : undefined
                      }
                    >
                      {tr(props.linkLabelKey, "link")}
                    </a>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
