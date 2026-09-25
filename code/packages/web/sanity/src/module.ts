/**
 * Composes per-owner Sanity contributions into one embedded Studio.
 *
 * @see docs/reference/packages/web/sanity/src/module.md
 */
import type { FieldDefinition, SchemaTypeDefinition, Template } from "sanity";
import type {
  StructureBuilder,
  ListItemBuilder,
  StructureResolver,
} from "sanity/structure";

/**
 * A Sanity **contribution** — everything one owner (the app core, or a module,
 * or the shared-schema package) adds to the single embedded Studio. The app's
 * `sanity.config.ts` composes a list of these with `composeSanity`, so adding or
 * removing a module is **one line in one array** instead of surgery across the
 * schema list, the desk resolver, the initial-value templates, and the
 * document-internationalization list.
 */
export type SanityModule = {
  /** For ordering + debugging. */
  name: string;
  /** Documents + objects this owner registers. */
  schemaTypes: SchemaTypeDefinition[];
  /**
   * This owner's own top-level desk items — NOT the whole resolver. Return a
   * plain list of `S.listItem()`s; `composeSanity` stitches them into one
   * "Contenu" list with dividers between them.
   */
  structure?: (S: StructureBuilder) => ListItemBuilder[];
  /** Initial-value ("+ Create") templates this owner contributes. */
  templates?: Template[];
  /** Document types registered with `@sanity/document-internationalization`. */
  i18nSchemaTypes?: string[];
  /**
   * Transactional-email groups this owner adds to the shared `emailStrings`
   * singleton (built with `confirmationGroup`/`ownerAlertGroup` from
   * `@indiecrafts/packages-web-email/sanity`). `emailSanity(modules)` collects these into the
   * one "E-mails" document, so a brick never hardcodes another module's email.
   */
  emailGroups?: FieldDefinition[];
};

/**
 * Compose contributions into the four inputs `defineConfig` needs. The desk
 * flattens every owner's items and inserts a divider between each — reproducing
 * a single, evenly-separated "Contenu" list from independent sections.
 */
export function composeSanity(modules: SanityModule[]): {
  schemaTypes: SchemaTypeDefinition[];
  templates: Template[];
  i18nSchemaTypes: string[];
  structure: StructureResolver;
} {
  return {
    schemaTypes: modules.flatMap((m) => m.schemaTypes),
    templates: modules.flatMap((m) => m.templates ?? []),
    i18nSchemaTypes: modules.flatMap((m) => m.i18nSchemaTypes ?? []),
    structure: (S) => {
      const items = modules.flatMap((m) => m.structure?.(S) ?? []);
      const separated: Array<ListItemBuilder | ReturnType<typeof S.divider>> =
        [];
      items.forEach((item, i) => {
        if (i > 0) separated.push(S.divider());
        separated.push(item);
      });
      return S.list().title("Contenu").items(separated);
    },
  };
}

/** One desk group in the hub Studio — an app (or "Contenu partagé") + the owners under it. */
export type StudioGroup = { title: string; modules: SanityModule[] };

/**
 * Compose the **hub Studio** from per-app groups. Schema/templates/i18n aggregate
 * across every group (one dataset), but the desk is **grouped per app** — each
 * `StudioGroup` becomes a top-level list whose children are that group's owners'
 * desk items. This is how one Studio edits many apps' content, organized by app
 * (see `code/docs/shared/architecture/multi-app.md`). A group whose modules contribute no
 * desk items (objects-only owners like `sharedSanity`) is skipped in the desk but
 * still registers its schema.
 */
export function composeStudio(groups: StudioGroup[]): {
  schemaTypes: SchemaTypeDefinition[];
  templates: Template[];
  i18nSchemaTypes: string[];
  structure: StructureResolver;
} {
  const all = groups.flatMap((g) => g.modules);
  return {
    schemaTypes: all.flatMap((m) => m.schemaTypes),
    templates: all.flatMap((m) => m.templates ?? []),
    i18nSchemaTypes: all.flatMap((m) => m.i18nSchemaTypes ?? []),
    structure: (S) => {
      const top: Array<ListItemBuilder | ReturnType<typeof S.divider>> = [];
      for (const group of groups) {
        const items = group.modules.flatMap((m) => m.structure?.(S) ?? []);
        if (items.length === 0) continue;
        const inner: Array<ListItemBuilder | ReturnType<typeof S.divider>> = [];
        items.forEach((item, i) => {
          if (i > 0) inner.push(S.divider());
          inner.push(item);
        });
        if (top.length > 0) top.push(S.divider());
        top.push(
          S.listItem()
            .title(group.title)
            .child(S.list().title(group.title).items(inner)),
        );
      }
      return S.list().title("Contenu").items(top);
    },
  };
}
