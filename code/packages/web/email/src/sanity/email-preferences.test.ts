import { describe, expect, it } from "vitest";
import { emailPreferencesSchema } from "./email-preferences";

describe("emailPreferencesSchema", () => {
  it("seeds the five reserved category keys, General never granted at sign-up", () => {
    const iv = (
      emailPreferencesSchema as {
        initialValue?: { categories?: { key: string }[] };
      }
    ).initialValue;
    expect(iv?.categories?.map((c) => c.key)).toEqual([
      "news",
      "offers",
      "partners",
      "tips",
      "general",
    ]);
    expect(
      (
        emailPreferencesSchema as {
          initialValue?: {
            categories?: { key: string; includeAtSignup: boolean }[];
          };
        }
      ).initialValue?.categories?.find((c) => c.key === "general")
        ?.includeAtSignup,
    ).toBe(false);
  });

  it("seeds bilingual read-only notices", () => {
    const iv = (
      emailPreferencesSchema as {
        initialValue?: {
          notices?: {
            name: Record<string, string>;
            description: Record<string, string>;
          }[];
        };
      }
    ).initialValue;
    expect(iv?.notices?.length).toBeGreaterThan(0);
    for (const n of iv!.notices!)
      for (const field of [n.name, n.description])
        expect(Object.keys(field).sort()).toEqual(["en", "fr"]);
  });

  it("key field is read-only once set (Studio guard)", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cat = (emailPreferencesSchema as any).fields.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: any) => f.name === "categories",
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const keyField = cat.of[0].fields.find((f: any) => f.name === "key");
    expect(keyField.readOnly({ value: "news" })).toBeTruthy();
    expect(keyField.readOnly({ value: undefined })).toBeFalsy();
  });
});
