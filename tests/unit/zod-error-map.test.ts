import { describe, expect, it } from "vitest";
import { z } from "zod";
import { mapZodMessage, translateZodIssues } from "@/lib/zod-error-map";

describe("zod-error-map", () => {
  it("maps known Zod messages to translation keys", () => {
    expect(mapZodMessage("Invalid email")).toBe("validation.invalidEmail");
    expect(mapZodMessage("Required")).toBe("validation.required");
  });

  it("returns the original message when unknown", () => {
    expect(mapZodMessage("Some bespoke error")).toBe("Some bespoke error");
  });

  it("translates every issue in a ZodError", () => {
    const schema = z.object({
      email: z.string().email(),
      age: z.number().min(0),
    });
    const result = schema.safeParse({ email: "not-an-email", age: -1 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const out = translateZodIssues(result.error.issues);
      expect(out.email).toBe("validation.invalidEmail");
    }
  });
});
