/**
 * Block key — kebab-case folder slug. Used to look up translations under
 * `blocks.<key>.*`.
 *
 * Secondary hero — enterprise contact / sales inquiry. Left tagged
 * headline + body + Watch-demo CTA + checklist; right
 * `EnterpriseForm` (full inquiry form: name / email / region / website
 * / job function / message). Below: 4-card stats row with brand
 * logos. All visible strings translate via `./en.json`.
 *
 * The `EnterpriseForm` lives as a sibling file inside this section
 * folder rather than a standalone molecule because it shares this
 * section's namespace. Promote to `ui-molecules/contact-form/` if a
 * second consumer ever needs it.
 */
export const secondaryHero14Key = "secondary-hero-14" as const;
export const secondaryHero14Namespace = "blocks.secondary-hero-14" as const;

/** Watch demo CTA target. */
export const secondaryHero14DemoHref = "#" as const;
