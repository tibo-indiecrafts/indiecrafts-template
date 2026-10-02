import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const syncLegalConsent = vi.hoisted(() =>
  vi.fn(async (_input: object) => false),
);
vi.mock("next-intl", () => ({ useTranslations: () => (key: string) => key }));
vi.mock("@indiecrafts/packages-web-i18n", () => ({
  Link: (p: object) => <a {...p} />,
}));
vi.mock(
  "@indiecrafts/packages-shared-compliance/shared",
  async (importOriginal) => ({
    ...(await importOriginal<object>()),
    syncLegalConsent,
  }),
);

const { LegalNotice } = await import("./LegalNotice");
const props = {
  version: "v2",
  message: "We updated our [[Privacy Policy]].",
  hrefs: ["/privacy"],
  acceptLabel: "Accept",
  apiUrl: "https://api.test",
  getToken: async () => "jwt",
};

describe("LegalNotice — signed-in sync", () => {
  // The accept-time write is fire-and-forget and can be lost; the website mounts the
  // notice (hidden) even after a local accept so the next load re-sends it.
  it("accepted here: shows nothing, and re-sends the acceptance", async () => {
    render(<LegalNotice {...props} acceptedHere />);
    await waitFor(() =>
      expect(syncLegalConsent).toHaveBeenCalledWith(
        expect.objectContaining({
          version: "v2",
          acceptedHere: true,
          surface: "website",
        }),
      ),
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("not accepted here: never accepts on the user's behalf", async () => {
    syncLegalConsent.mockClear();
    render(<LegalNotice {...props} />);
    await waitFor(() =>
      expect(syncLegalConsent).toHaveBeenCalledWith(
        expect.objectContaining({ version: "v2", acceptedHere: false }),
      ),
    );
  });
});
