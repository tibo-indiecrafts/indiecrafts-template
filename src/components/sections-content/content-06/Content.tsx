import Image from "next/image";
import { useScopedT } from "@/i18n/scoped-t";
import { content06Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [, tr, tRoot] = useScopedT(content06Namespace);

  return (
    <section aria-labelledby={`${props.id}-title`} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="text-center">
          <h2 id={`${props.id}-title`} className="text-3xl font-semibold text-balance">
            {tr(props.titleKey, "title")}
          </h2>
          <p className="text-muted-foreground mt-6">{tr(props.bodyKey, "body")}</p>
        </div>
        <ul className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-3">
          {props.members.map((member, i) => {
            const name = tRoot(member.nameKey);
            return (
              <li key={i}>
                <a
                  href={member.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={name}
                  aria-label={name}
                  className="block size-16 overflow-hidden rounded-full border"
                >
                  <Image
                    alt=""
                    src={member.avatarUrl}
                    loading="lazy"
                    width={120}
                    height={120}
                    className="size-full object-cover"
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
