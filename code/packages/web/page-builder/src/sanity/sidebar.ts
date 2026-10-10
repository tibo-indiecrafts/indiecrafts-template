/**
 * Resolve which cards a page's sidebar shows, and the GROQ that reads them.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/sidebar.md
 */

/** A sidebar as stored: on a document, or one page type in the settings. */
export type SidebarChoice<B> = {
  mode?: "inherit" | "custom" | "none" | null;
  blocks?: B[] | null;
} | null;

/** The locale's settings, narrowed to the page type being rendered. */
export type SidebarSettings<B> = {
  default?: B[] | null;
  type?: SidebarChoice<B>;
} | null;

/**
 * The cards to show: the document's own choice, else its page type's, else the default.
 * `none` at any level stops there with no sidebar. An unset mode reads as `inherit`.
 */
export function resolveSidebar<B>(
  doc: SidebarChoice<B> | undefined,
  settings: SidebarSettings<B> | undefined,
): B[] {
  for (const choice of [doc, settings?.type]) {
    if (choice?.mode === "none") return [];
    if (choice?.mode === "custom") return choice.blocks ?? [];
  }
  return settings?.default ?? [];
}

/** A `sidebar` field projected with its visible cards resolved by `modules` (a fragment). */
export const sidebarProjection = (modules: string) =>
  `{ mode, "blocks": blocks[hidden != true]{ ${modules} } }`;

/**
 * The locale's sidebar settings for one page type (`$locale`), its cards resolved by
 * `modules`. The settings document is `sidebarSettings-<locale>`. `pageType` is a code
 * constant (a field of `byType`), checked here because it is written into the query.
 */
export const sidebarSettingsQuery = (modules: string, pageType: string) => {
  if (!/^[A-Za-z]+$/.test(pageType))
    throw new Error(`Bad sidebar page type: ${pageType}`);
  return `
  *[_id == "sidebarSettings-" + $locale][0]{
    "default": default[hidden != true]{ ${modules} },
    "type": byType.${pageType}${sidebarProjection(modules)}
  }
`;
};
