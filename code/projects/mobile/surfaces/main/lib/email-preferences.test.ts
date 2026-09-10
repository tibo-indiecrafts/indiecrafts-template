import {
  withCategoryGranted,
  type EmailPreferenceCategory,
} from "./email-preferences";

const categories: EmailPreferenceCategory[] = [
  {
    key: "product",
    name: "Product news",
    description: "Updates about new features.",
    includeAtSignup: true,
    granted: false,
  },
  {
    key: "digest",
    name: "Weekly digest",
    description: "A weekly summary.",
    includeAtSignup: false,
    granted: true,
  },
];

describe("withCategoryGranted", () => {
  it("flips only the matching category", () => {
    const next = withCategoryGranted(categories, "product", true);
    expect(next.find((c) => c.key === "product")?.granted).toBe(true);
    expect(next.find((c) => c.key === "digest")?.granted).toBe(true); // unchanged
  });

  it("can revert a category back (rollback on a failed write)", () => {
    const optimistic = withCategoryGranted(categories, "digest", false);
    const reverted = withCategoryGranted(optimistic, "digest", true);
    expect(reverted).toEqual(categories);
  });

  it("leaves the list unchanged when the key is not found", () => {
    const next = withCategoryGranted(categories, "missing", true);
    expect(next).toEqual(categories);
  });

  it("does not mutate the input array or its items", () => {
    withCategoryGranted(categories, "product", true);
    expect(categories[0].granted).toBe(false);
  });
});
