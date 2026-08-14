import { describe, expect, it } from "vitest";
import { article, capitalize, inlineNoun, placeAdjective, sentenceCase, titleCase } from "./grammar";

describe("casing", () => {
  it("titleCase / sentenceCase", () => {
    expect(titleCase("custom product")).toBe("Custom Product");
    expect(sentenceCase("custom product")).toBe("Custom product");
  });
  it("capitalize picks per locale (EN Title, FR sentence)", () => {
    expect(capitalize("custom product", "en")).toBe("Custom Product");
    expect(capitalize("produit personnalisé", "fr")).toBe("Produit personnalisé");
  });
  it("inlineNoun lowercases mid-sentence in FR only", () => {
    expect(inlineNoun("Tir à l'arc", "fr")).toBe("tir à l'arc");
    expect(inlineNoun("Archery", "en")).toBe("Archery");
  });
});

describe("placeAdjective — noun/adjective order", () => {
  it("EN before, FR after", () => {
    expect(placeAdjective("product", "custom", "en")).toBe("custom product");
    expect(placeAdjective("produit", "personnalisé", "fr")).toBe("produit personnalisé");
  });
});

describe("article — FR agreement", () => {
  it("definite le/la/l'/les", () => {
    expect(article("thème", { locale: "fr", gender: "m" })).toBe("le thème");
    expect(article("marque", { locale: "fr", gender: "f" })).toBe("la marque");
    expect(article("archer", { locale: "fr" })).toBe("l'archer"); // vowel/h → l'
    expect(article("thèmes", { locale: "fr", number: "plural" })).toBe("les thèmes");
  });
  it("contracted de → du/de la/de l'/des", () => {
    expect(article("thème", { locale: "fr", gender: "m", kind: "de" })).toBe("du thème");
    expect(article("marque", { locale: "fr", gender: "f", kind: "de" })).toBe("de la marque");
    expect(article("archer", { locale: "fr", kind: "de" })).toBe("de l'archer");
    expect(article("thèmes", { locale: "fr", number: "plural", kind: "de" })).toBe("des thèmes");
  });
  it("contracted a → au/à la/aux", () => {
    expect(article("thème", { locale: "fr", gender: "m", kind: "a" })).toBe("au thème");
    expect(article("thèmes", { locale: "fr", number: "plural", kind: "a" })).toBe("aux thèmes");
  });
  it("EN is transparent", () => {
    expect(article("theme", { locale: "en", kind: "de" })).toBe("of the theme");
  });
});
