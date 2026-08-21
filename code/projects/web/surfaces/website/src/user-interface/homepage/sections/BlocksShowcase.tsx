import { getTranslations } from "next-intl/server";
import { renderBlock } from "@indiecrafts/packages-web-ui-components/web/registry";
import { portableComponents } from "@indiecrafts/packages-web-ui-components/web/portable-text-components";
import type { BlockModule } from "@indiecrafts/packages-web-ui-components/shared/types";

/**
 * Page-builder blocks showcase for the homepage. Renders the same
 * `@indiecrafts/packages-web-ui-components` block renderers the blog body uses — proof the
 * marketing page and blog posts share one component system and look identical.
 *
 * The block payloads below stand in for Sanity-authored content (a real `page`
 * document feeds these from the CMS). Only the section chrome — eyebrow, title,
 * body — reads from `namespace`, matching the other homepage showcases.
 */
const DEMO_BLOCKS: BlockModule[] = [
  {
    _key: "demo-stats",
    _type: "module.stat-list",
    stats: [
      { _key: "s1", value: "99.9%", label: "Uptime" },
      { _key: "s2", value: "11", label: "Block types" },
      { _key: "s3", value: "2", label: "Consumers — app + blog" },
      { _key: "s4", value: "0", label: "Duplicated renderers" },
    ],
  },
  {
    _key: "demo-steps",
    _type: "module.step-list",
    title: "How a block reaches the page",
    steps: [
      { _key: "p1", title: "Author picks a block in Sanity Studio" },
      { _key: "p2", title: "GROQ resolves images, links, and refs" },
      { _key: "p3", title: "The shared renderer paints it — one look everywhere" },
    ],
  },
  {
    _key: "demo-cards",
    _type: "module.card-list",
    title: "One component system",
    columns: 3,
    cards: [
      { _key: "c1", title: "Same markup" },
      { _key: "c2", title: "Same design tokens" },
      { _key: "c3", title: "Zero drift" },
    ],
  },
  {
    _key: "demo-newsletter",
    _type: "module.newsletter",
    variant: "banner",
    heading: "Ship it, then keep in touch",
    body: "One email a month — new guides, nothing else. This signup is the same block, rendered by the same registry.",
    buttonLabel: "Subscribe",
    consentText:
      "I agree to receive the newsletter and to my email being stored for that purpose.",
  },
];

export async function BlocksShowcase({
  id,
  namespace,
}: {
  id: string;
  namespace: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic namespace, matches the other sections
  const t = await getTranslations(namespace as any);

  return (
    <section aria-labelledby={`${id}-title`} className="border-t py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-(--gutter)">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-brand text-xs font-medium tracking-widest uppercase">
            {t("eyebrow")}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-4 text-3xl font-semibold tracking-tight text-balance lg:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="text-muted-foreground mt-3 text-balance">{t("body")}</p>
        </div>

        <div className="mt-12 grid gap-12">
          {DEMO_BLOCKS.map((block) => (
            <div key={block._key}>{renderBlock(block, portableComponents)}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
