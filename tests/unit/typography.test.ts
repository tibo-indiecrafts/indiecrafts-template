import { describe, expect, it } from "vitest";
import {
  applyCase,
  applyNbsp,
  formatNumber,
  placeAdjective,
  quote,
  type TypographyRules,
} from "@/components/_lib/typography";

const enRules: TypographyRules = {
  titleCase: "title",
  headingCase: "sentence",
  adjectivePlacement: "before",
  quoteStyle: { primary: ["“", "”"], secondary: ["‘", "’"] },
  apostrophe: "’",
  ellipsis: "…",
  thousandsSeparator: ",",
  decimalSeparator: ".",
  dateFormat: "MMM d, yyyy",
  timeFormat: "h:mm a",
  firstDayOfWeek: 0,
  listStyle: "comma",
  oxfordComma: true,
  hyphenationChar: "-",
  nonBreakingSpaceBeforePunctuation: [],
  currencyPosition: "before",
  numberSpacing: "",
};

const frRules: TypographyRules = {
  ...enRules,
  adjectivePlacement: "after",
  thousandsSeparator: " ",
  decimalSeparator: ",",
  nonBreakingSpaceBeforePunctuation: [":", ";", "?", "!", "%"],
};

describe("typography", () => {
  describe("applyCase", () => {
    it("title-cases with minor words lowered", () => {
      expect(applyCase("the quick brown fox", "title")).toBe("The Quick Brown Fox");
      expect(applyCase("a song of ice and fire", "title")).toBe("A Song of Ice and Fire");
    });
    it("sentence-cases", () => {
      expect(applyCase("HELLO WORLD", "sentence")).toBe("Hello world");
    });
    it("upper/lower", () => {
      expect(applyCase("Hello", "upper")).toBe("HELLO");
      expect(applyCase("Hello", "lower")).toBe("hello");
    });
  });

  describe("quote", () => {
    it("wraps with primary quotes", () => {
      expect(quote("hi", enRules)).toBe("“hi”");
    });
  });

  describe("applyNbsp", () => {
    it("adds narrow NBSP before French punctuation", () => {
      const result = applyNbsp("Bonjour !", frRules);
      expect(result).toBe("Bonjour !");
    });
    it("is a no-op when locale doesn't need NBSP", () => {
      expect(applyNbsp("Hi!", enRules)).toBe("Hi!");
    });
  });

  describe("formatNumber", () => {
    it("formats with en separators", () => {
      expect(formatNumber(1234567.89, enRules)).toBe("1,234,567.89");
    });
    it("formats with fr separators", () => {
      expect(formatNumber(1234567.89, frRules)).toBe("1 234 567,89");
    });
  });

  describe("placeAdjective", () => {
    it("places before in en", () => {
      expect(placeAdjective("car", "fast", enRules)).toBe("fast car");
    });
    it("places after in fr", () => {
      expect(placeAdjective("voiture", "rapide", frRules)).toBe("voiture rapide");
    });
  });
});
