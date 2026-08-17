/**
 * GROQ fragments for the generic page-builder modules — shared by the app's
 * `page` / `homePage` queries AND composed by the blog (which appends its own
 * `blog-post-list` projection). `defineQuery` in the consuming file flags the
 * final query for `sanity typegen`.
 */

/**
 * Link fragment — resolves the internal/external union into a single `href`
 * plus the original label. An internal **page** → `/<slug>`, an internal
 * **post** → `/blog/<slug>`; external URLs pass through. Empty when unset.
 */
export const LINK_FRAGMENT = `
  ...,
  "href": select(
    type == "internal" && internal->_type == "page" => "/" + internal->slug.current,
    type == "internal" && internal->_type == "post" => "/blog/" + internal->metadata.slug.current,
    type == "external" => external,
    ""
  )
`;

export const CTA_FRAGMENT = `
  ...,
  link { ${LINK_FRAGMENT} }
`;

/**
 * Generic modules fragment — expands every referenced field per generic module
 * type. `quote-list` dereferences its quotes; `person-list` its people. The blog
 * appends `module.blog-post-list` to this in its own `MODULES_FRAGMENT`.
 */
export const MODULES_FRAGMENT = `
  ...,
  _type == "image" => { asset->{ url }, "alt": coalesce(alt, "") },
  _type == "module.hero" => { cta { ${CTA_FRAGMENT} } },
  _type == "module.pricing" => {
    tiers[] { ..., cta { ${CTA_FRAGMENT} } }
  },
  _type == "module.callout" => { cta { ${CTA_FRAGMENT} } },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${CTA_FRAGMENT} } }
  },
  _type == "module.gallery" => {
    images[]{
      _key,
      "url": asset->url,
      "alt": coalesce(alt, ""),
      "lqip": asset->metadata.lqip,
      "aspectRatio": asset->metadata.dimensions.aspectRatio,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    }
  },
  _type == "module.person-list" => {
    people[]->{
      _id, name, role, bio,
      image { asset->{ url } },
      social[] { ${LINK_FRAGMENT} }
    }
  },
  _type == "module.quote-list" => {
    "quotes": quotes[]->{
      _id, content, author, role, language,
      image { asset->{ url } }
    }
  },
  _type == "module.lead-magnet" => { magnet->{ "id": _id } }
`;
