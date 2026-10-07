import { describe, expect, it } from "vitest";
import { defaultLocale, locales } from "@indiecrafts/packages-shared-config";
import {
  OTHER_LOCALES,
  TRANSLATED_SEO_FIELDS,
  seoTranslationsField,
} from "./seo-translations";

type Field = {
  name: string;
  type: string;
  fields?: { name: string }[];
  options?: { list: { value: string }[] };
};
type Member = { fields: Field[] };

const member = (fields?: { name: string; title: string }[]) =>
  (seoTranslationsField(fields) as unknown as { of: Member[] }).of[0]!;

describe("seoTranslationsField", () => {
  it("offers every locale but the default (the base fields hold that one)", () => {
    expect(OTHER_LOCALES.map((l) => l.code)).toEqual(
      locales.map((l) => l.code).filter((c) => c !== defaultLocale),
    );
    const language = member().fields.find((f) => f.name === "language")!;
    expect(language.options?.list.map((o) => o.value)).toEqual(
      OTHER_LOCALES.map((l) => l.code),
    );
  });

  it("carries the text of each named field — `seo` by default", () => {
    const named = (fields?: { name: string; title: string }[]) =>
      member(fields).fields.filter((f) => f.name !== "language");
    expect(named().map((f) => f.name)).toEqual(["seo"]);
    expect(
      named([
        { name: "author", title: "A" },
        { name: "tag", title: "T" },
      ]).map((f) => f.name),
    ).toEqual(["author", "tag"]);
  });

  it("never offers visibility, canonical or image fields — those stay on the base", () => {
    const seo = member().fields.find((f) => f.name === "seo")!;
    expect(seo.fields?.map((f) => f.name)).toEqual(TRANSLATED_SEO_FIELDS);
  });
});
