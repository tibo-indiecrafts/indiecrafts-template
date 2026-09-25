/**
 * Builds the page-builder desk sections for the embedded Studio.
 *
 * @see docs/reference/packages/web/page-builder/src/sanity/structure.md
 */
import type { StructureBuilder, ListItemBuilder } from "sanity/structure";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { HomeIcon } from "@sanity/icons/Home";
import { StarIcon } from "@sanity/icons/Star";
import { UsersIcon } from "@sanity/icons/Users";
import { apiVersion } from "@indiecrafts/packages-web-sanity/env";
import { locales, type Locale } from "@indiecrafts/packages-shared-config";

type PageBuilderType = "page" | "quote" | "person";

/**
 * The page-builder's desk sections — Accueil (the home `page`, `isHome`, one pinned
 * doc per locale), Pages (every other `page`), plus the two generic entities the
 * blocks reference: Témoignages (`quote` → `module.quote-list`) and Équipe (`person`
 * → `module.person-list`). Each localized type exposes EN/FR children. The app's
 * `composeStudio` stitches these into the "Site web" group.
 */
export function pageBuilderStructure(S: StructureBuilder): ListItemBuilder[] {
  return [
    homeItem(S),
    languageSplit(S, "page", "Pages", DocumentsIcon),
    languageSplit(S, "quote", "Témoignages", StarIcon),
    languageSplit(S, "person", "Équipe", UsersIcon),
  ];
}

/** The home page — one pinned `page` (fixed id `page-home-<locale>`) per locale. */
function homeItem(S: StructureBuilder) {
  return S.listItem()
    .title("Accueil")
    .icon(HomeIcon)
    .child(
      S.list()
        .title("Accueil")
        .items(
          locales.map((l) =>
            S.listItem()
              .title(`Accueil — ${l.label}`)
              .child(
                S.editor()
                  .id(`page-home-${l.code}`)
                  .schemaType("page")
                  .documentId(`page-home-${l.code}`),
              ),
          ),
        ),
    );
}

/** Two-level sidebar entry: a parent (e.g. "Pages") with EN/FR children + an
 *  "all languages" leaf. Each leaf seeds the create template with its `language`. */
function languageSplit(
  S: StructureBuilder,
  type: PageBuilderType,
  title: string,
  icon?: Parameters<ListItemBuilder["icon"]>[0],
) {
  const item = S.listItem()
    .title(title)
    .child(
      S.list()
        .title(title)
        .items([
          ...locales.map((l) => languageList(S, type, l.code, l.label)),
          S.divider(),
          S.documentTypeListItem(type).title("Toutes les langues"),
        ]),
    );
  return icon ? item.icon(icon) : item;
}

function languageList(
  S: StructureBuilder,
  type: string,
  lang: Locale,
  label: string,
) {
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  return S.listItem()
    .title(label)
    .child(
      S.documentTypeList(type)
        .title(`${label} — ${typeLabel}`)
        .apiVersion(apiVersion)
        // The home `page` (isHome) lives in the pinned "Accueil" section, not "Pages".
        .filter(
          `_type == $type && language == $lang${type === "page" ? " && isHome != true" : ""}`,
        )
        .params({ type, lang })
        .initialValueTemplates([
          S.initialValueTemplateItem(`${type}-${lang}`, { language: lang }),
        ]),
    );
}
