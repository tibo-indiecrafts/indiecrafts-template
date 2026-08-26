import type { Locale } from "@indiecrafts/packages-shared-config";
import { localizedPathname } from "@indiecrafts/packages-web-i18n";
import { TopicCards } from "@indiecrafts/packages-web-ui-components/web/layout/TopicCards";
import type { BlogTopicCardsModule as BlogTopicCardsModuleType } from "@indiecrafts/modules-web-blog/sanity/types";

/**
 * Frontpage "Topic Cards" block — up to three categories/tags shown as large
 * cards linking to their listing page. Unlike every other frontpage block,
 * this one points at taxonomy, not posts: `cards[].target`/`cards[].image`
 * are already resolved by the blog's `MODULES_FRAGMENT`, so this just maps
 * onto `TopicCards`. Skips any card whose target didn't resolve (e.g. a
 * deleted category); `TopicCards` itself renders nothing once the list is
 * empty.
 */
export function BlogTopicCards({
  module: m,
  locale,
}: {
  module: BlogTopicCardsModuleType;
  locale: Locale;
}) {
  const items = (m.cards ?? []).flatMap((card) => {
    if (!card.target?.title || !card.target.slug) return [];
    const href =
      card.target._type === "category"
        ? localizedPathname(`/blog/category/${card.target.slug}`, locale)
        : localizedPathname(`/blog/tag/${card.target.slug}`, locale);
    return [
      {
        _key: card._key,
        title: card.title ?? card.target.title,
        blurb: card.blurb,
        image: card.image,
        alt: card.imageAlt ?? undefined,
        href,
      },
    ];
  });

  return <TopicCards items={items} />;
}
