import { describe, expect, it } from "vitest";
import type { SchemaTypeDefinition, Template } from "sanity";
import type { ListItemBuilder } from "sanity/structure";
import { composeSanity, composeStudio } from "./module";
import type { SanityModule, StudioGroup } from "./module";

const DIVIDER = { kind: "divider" };

/**
 * Minimal fake `S` — only the calls `composeSanity`/`composeStudio` actually
 * make (`divider`, `list().title().items()`, `listItem().title().child()`).
 * Cast to `unknown` at the call site so the real (generated) `StructureBuilder`
 * type never has to be satisfied structurally.
 */
function fakeS() {
  return {
    divider: () => DIVIDER,
    list: () => {
      let listTitle = "";
      const builder = {
        title(t: string) {
          listTitle = t;
          return builder;
        },
        items(items: unknown[]) {
          return { kind: "list", title: listTitle, items };
        },
      };
      return builder;
    },
    listItem: () => {
      let itemTitle = "";
      const builder = {
        title(t: string) {
          itemTitle = t;
          return builder;
        },
        child(child: unknown) {
          return { kind: "listItem", title: itemTitle, child };
        },
      };
      return builder;
    },
  };
}

/** A fake desk item — composeSanity/composeStudio only flatten + place these, never read them. */
function item(id: string): ListItemBuilder {
  return { id } as unknown as ListItemBuilder;
}

function schema(name: string): SchemaTypeDefinition {
  return { name } as unknown as SchemaTypeDefinition;
}

function template(id: string): Template {
  return { id } as unknown as Template;
}

function runStructure(structure: (S: unknown) => unknown) {
  return structure(fakeS()) as { items: unknown[] };
}

describe("composeSanity", () => {
  it("flatMaps every module's schema/template/i18n contributions, defaulting missing ones to []", () => {
    const modA: SanityModule = {
      name: "a",
      schemaTypes: [schema("a-doc")],
      templates: [template("a-tpl")],
      i18nSchemaTypes: ["a-doc"],
    };
    const modB: SanityModule = {
      name: "b",
      schemaTypes: [schema("b-doc")],
      // no templates / i18nSchemaTypes — exercises the `?? []` defaults
    };

    const result = composeSanity([modA, modB]);

    expect(result.schemaTypes).toEqual([schema("a-doc"), schema("b-doc")]);
    expect(result.templates).toEqual([template("a-tpl")]);
    expect(result.i18nSchemaTypes).toEqual(["a-doc"]);
  });

  it("inserts a divider between desk items, none before the first, none trailing (2 items)", () => {
    const modules: SanityModule[] = [
      { name: "a", schemaTypes: [], structure: () => [item("a")] },
      { name: "b", schemaTypes: [], structure: () => [item("b")] },
    ];

    const list = runStructure(composeSanity(modules).structure);

    expect(list.items).toEqual([item("a"), DIVIDER, item("b")]);
  });

  it("inserts a divider between desk items, none before the first, none trailing (3 items)", () => {
    const modules: SanityModule[] = [
      { name: "a", schemaTypes: [], structure: () => [item("a")] },
      { name: "b", schemaTypes: [], structure: () => [item("b")] },
      { name: "c", schemaTypes: [], structure: () => [item("c")] },
    ];

    const list = runStructure(composeSanity(modules).structure);

    expect(list.items).toEqual([
      item("a"),
      DIVIDER,
      item("b"),
      DIVIDER,
      item("c"),
    ]);
  });
});

describe("composeStudio", () => {
  it("groups desk items per StudioGroup with dividers between groups, and skips a group with zero desk items (no stray divider)", () => {
    const groupA: StudioGroup = {
      title: "A",
      modules: [{ name: "a", schemaTypes: [], structure: () => [item("a")] }],
    };
    const groupEmpty: StudioGroup = {
      title: "Empty",
      modules: [{ name: "e", schemaTypes: [] }], // no `structure` — contributes no desk items
    };
    const groupB: StudioGroup = {
      title: "B",
      modules: [{ name: "b", schemaTypes: [], structure: () => [item("b")] }],
    };

    const top = runStructure(
      composeStudio([groupA, groupEmpty, groupB]).structure,
    ) as { items: Array<{ kind: string; title?: string }> };

    expect(top.items).toHaveLength(3);
    expect(top.items[0]).toMatchObject({ kind: "listItem", title: "A" });
    expect(top.items[1]).toEqual(DIVIDER);
    expect(top.items[2]).toMatchObject({ kind: "listItem", title: "B" });
  });

  it("aggregates schema/template/i18n across every group's modules", () => {
    const groupA: StudioGroup = {
      title: "A",
      modules: [
        {
          name: "a",
          schemaTypes: [schema("a-doc")],
          i18nSchemaTypes: ["a-doc"],
        },
      ],
    };
    const groupB: StudioGroup = {
      title: "B",
      modules: [{ name: "b", schemaTypes: [schema("b-doc")] }],
    };

    const result = composeStudio([groupA, groupB]);

    expect(result.schemaTypes).toEqual([schema("a-doc"), schema("b-doc")]);
    expect(result.i18nSchemaTypes).toEqual(["a-doc"]);
  });
});
