import { describe, expect, it } from "vitest";
import { formatBytes, formatOrdinal } from "./number";
import { plural } from "./plural";
import { formatList, joinTruncated } from "./list";
import { formatRelativeTime } from "./relative";
import {
  excerpt,
  fileExtension,
  initials,
  maskEmail,
  readingTime,
  truncate,
} from "./text";
import { isIban, isPhone, isPostalCode, isVatNumber } from "./validate";

const DAY = 86_400_000;

describe("number", () => {
  it("ordinals per locale", () => {
    expect(formatOrdinal(1, "en")).toBe("1st");
    expect(formatOrdinal(2, "en")).toBe("2nd");
    expect(formatOrdinal(23, "en")).toBe("23rd");
    expect(formatOrdinal(1, "fr")).toBe("1er");
    expect(formatOrdinal(2, "fr")).toBe("2e");
  });
  it("bytes", () => {
    expect(formatBytes(0)).toBe("0 B");
    expect(formatBytes(1536)).toBe("1.5 KB");
  });
});

describe("plural / list", () => {
  it("plural selects the form + fills #", () => {
    expect(plural(1, { one: "# item", other: "# items" }, "en")).toBe("1 item");
    expect(plural(2, { one: "# item", other: "# items" }, "en")).toBe(
      "2 items",
    );
  });
  it("list joins per locale", () => {
    expect(formatList(["A", "B", "C"], "en")).toBe("A, B, and C");
    expect(formatList(["A", "B"], "fr")).toBe("A et B");
    expect(joinTruncated(["A", "B", "C", "D", "E"], "en", 3)).toBe(
      "A, B, C +2",
    );
  });
});

describe("relative", () => {
  it("localized past time", () => {
    const now = Date.now();
    expect(formatRelativeTime(now - 3 * DAY, "en", now)).toContain("day");
    expect(formatRelativeTime(now - 3 * DAY, "fr", now)).toContain("jour");
  });
});

describe("text", () => {
  it("helpers", () => {
    expect(truncate("hello world foobar", 8)).toBe("hello…");
    expect(initials("Ada Lovelace")).toBe("AL");
    expect(readingTime("word ".repeat(400))).toBe(2);
    expect(maskEmail("john.doe@x.com")).toBe("j*******@x.com");
    expect(fileExtension("photo.JPG")).toBe("jpg");
    expect(excerpt("  a   b  c ", 100)).toBe("a b c");
  });
});

describe("validate", () => {
  it("phone / postal / vat", () => {
    expect(isPhone("+33 6 12 34 56 78")).toBe(true);
    expect(isPhone("12")).toBe(false);
    expect(isPostalCode("75001", "FR")).toBe(true);
    expect(isPostalCode("ABC", "FR")).toBe(false);
    expect(isVatNumber("FR12345678901")).toBe(true);
    expect(isVatNumber("hello")).toBe(false);
  });
  it("IBAN mod-97", () => {
    expect(isIban("DE89 3704 0044 0532 0130 00")).toBe(true);
    expect(isIban("DE89 3704 0044 0532 0130 01")).toBe(false);
  });
});
