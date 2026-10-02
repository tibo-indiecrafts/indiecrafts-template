import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConsentBanner } from "./ConsentBanner";

const categories = [
  { key: "necessary", title: "Necessary", required: true },
  { key: "analytics", title: "Analytics" },
  { key: "marketing", title: "Marketing" },
];
const copy = {
  body: "We use storage.",
  acceptLabel: "Accept all",
  rejectLabel: "Reject",
  customizeLabel: "Customize",
  saveLabel: "Save",
  backLabel: "Back",
};

const banner = (extra = {}, onSave = vi.fn()) =>
  render(
    <ConsentBanner
      categories={categories}
      copy={{ ...copy, ...extra }}
      onAccept={vi.fn()}
      onReject={vi.fn()}
      onSave={onSave}
    />,
  );

describe("ConsentBanner", () => {
  it("links the cookie policy when the surface passes one", () => {
    banner({
      learnMore: { label: "Learn more", href: "https://site.x/cookie-policy" },
    });
    expect(screen.getByRole("link", { name: "Learn more" })).toHaveAttribute(
      "href",
      "https://site.x/cookie-policy",
    );
  });

  it("has no link without one", () => {
    banner();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("Save records every optional category, untouched ones as false", async () => {
    const onSave = vi.fn();
    banner({}, onSave);
    await userEvent.click(screen.getByRole("button", { name: "Customize" }));
    await userEvent.click(screen.getByRole("switch", { name: /analytics/i }));
    await userEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSave).toHaveBeenCalledWith({ analytics: true, marketing: false });
  });
});
