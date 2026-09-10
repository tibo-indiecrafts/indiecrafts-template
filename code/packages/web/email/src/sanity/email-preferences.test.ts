import { describe, expect, it } from "vitest";
import { emailPreferencesSchema } from "./email-preferences";

describe("emailPreferencesSchema", () => {
  it("seeds the four reserved category keys", () => {
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
    ]);
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
