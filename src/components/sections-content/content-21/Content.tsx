/* eslint-disable @next/next/no-img-element -- external avatar URLs intentionally use <img> */

import Link from "next/link";
import { useScopedT } from "@/i18n/scoped-t";
import { content21Namespace } from "./config";
import type { ContentBlock } from "./schema";

export default function Content(props: Readonly<ContentBlock>) {
  const [, , tRoot] = useScopedT(content21Namespace);
  const headingId = `${props.id}-heading`;

  return (
    <section aria-labelledby={headingId} className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 id={headingId} className="text-3xl font-semibold">
            {tRoot(props.titleKey)}
          </h2>
          <p className="mt-6">{tRoot(props.bodyKey)}</p>
        </div>
        <div className="mx-auto mt-12 flex max-w-lg flex-wrap justify-center gap-3">
          {props.members.map((member, index) => {
            const label = tRoot(member.nameKey);
            return (
              <Link
                key={index}
                href={member.href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                aria-label={label}
                className="size-16 rounded-full border *:size-full *:rounded-full *:object-cover"
              >
                <img
                  alt={label}
                  src={member.avatarSrc}
                  loading="lazy"
                  width={120}
                  height={120}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
