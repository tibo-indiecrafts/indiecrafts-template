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
    type == "internal" && internal->_type == "post" => "/blog/" + internal->media.slug.current,
    type == "external" => external,
    ""
  )
`;

export const CTA_FRAGMENT = `
  ...,
  link { ${LINK_FRAGMENT} }
`;

/**
 * A form block's Studio switch (`contactSettings` · `waitlistSettings` · `newsletterSettings`),
 * so turning a form off hides every block of it, not only its page. A missing settings doc
 * reads as on.
 */
const FORM_SWITCH = `
  _type == "module.contact" => {
    "enabled": *[_type == "contactSettings"][0].enabled != false
  },
  _type == "module.waitlist" => {
    "enabled": *[_type == "waitlistSettings"][0].enabled != false
  },
  _type in ["module.newsletter", "module.lead-magnet"] => {
    "enabled": *[_type == "newsletterSettings"][0].enabled != false
  }
`;

/** The rich-text field of a container module: its inline blocks get their form switch too. */
const NESTED = `content[]{ ..., ${FORM_SWITCH} }`;

/**
 * Generic modules fragment — expands every referenced field per generic module
 * type. `quote-list` dereferences its quotes; `person-list` its people. The blog
 * appends `module.blog-post-list` to this in its own `MODULES_FRAGMENT`.
 *
 * The form blocks carry `enabled` (`FORM_SWITCH`), at the top level and inside a container's
 * rich text (prose, callout, card, accordion item, step).
 * ponytail: GROQ cannot recurse — a form inside a container inside a container gets no
 * switch and stays visible; project one more level here if editors ever nest that deep.
 */
export const MODULES_FRAGMENT = `
  ...,
  _type == "image" => { asset->{ url }, "alt": coalesce(alt, "") },
  _type == "module.hero" => { cta { ${CTA_FRAGMENT} } },
  _type == "module.pricing" => {
    tiers[] { ..., cta { ${CTA_FRAGMENT} } }
  },
  _type == "module.prose" => { ${NESTED} },
  _type == "module.callout" => { cta { ${CTA_FRAGMENT} }, ${NESTED} },
  _type == "module.card-list" => {
    cards[] { ..., cta { ${CTA_FRAGMENT} }, ${NESTED} }
  },
  _type == "module.accordion-list" => { items[] { ..., ${NESTED} } },
  _type == "module.step-list" => { steps[] { ..., ${NESTED} } },
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
  _type == "module.lead-magnet" => { magnet->{ "id": _id } },
  ${FORM_SWITCH}
`;
