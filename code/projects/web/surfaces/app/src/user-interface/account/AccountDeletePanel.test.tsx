import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import type { DeleteAccountCopy, ExportCopy } from "@indiecrafts/packages-shared-compliance/web";
import { AccountDeletePanel } from "./AccountDeletePanel";

const { getToken, signOut } = vi.hoisted(() => ({
  getToken: vi.fn(async () => "token"),
  signOut: vi.fn(async () => {}),
}));
vi.mock("@clerk/nextjs", () => ({
  useAuth: () => ({ getToken, signOut }),
  // Reverification itself isn't under test — pass the wrapped submit straight through.
  useReverification: (fn: (email: string) => unknown) => fn,
}));

const { replace } = vi.hoisted(() => ({ replace: vi.fn() }));
vi.mock("@/i18n/routing", () => ({ useRouter: () => ({ replace }) }));

const { rawErasureFetch } = vi.hoisted(() => ({ rawErasureFetch: vi.fn() }));
vi.mock("@indiecrafts/packages-shared-compliance/web", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@indiecrafts/packages-shared-compliance/web")>();
  return { ...actual, rawErasureFetch };
});

const copy: DeleteAccountCopy = {
  heading: "Delete account",
  body: "This removes your data.",
  emailLabel: "Email",
  emailPlaceholder: "you@example.com",
  confirmButton: "Delete my account",
  pending: "Deleting…",
  success: "Deleted",
  partial: "Partially deleted",
  mismatch: "Email didn't match",
  error: "Something went wrong",
};
const exportCopy: ExportCopy = {
  heading: "Download my data",
  body: "Export a copy.",
  button: "Download",
  pending: "Preparing…",
  success: "Downloaded",
  error: "Export failed",
};

beforeEach(() => {
  getToken.mockClear();
  signOut.mockClear();
  replace.mockClear();
  rawErasureFetch.mockReset();
});

describe("AccountDeletePanel", () => {
  it("submits the typed email through the injected erasure fetch, then signs out and redirects home", async () => {
    rawErasureFetch.mockResolvedValue({ status: 200 });
    const user = userEvent.setup();
    render(<AccountDeletePanel copy={copy} exportCopy={exportCopy} showExport={false} />);

    await user.type(screen.getByLabelText(copy.emailLabel), "me@example.com");
    await user.click(screen.getByRole("button", { name: copy.confirmButton }));

    await waitFor(() =>
      expect(rawErasureFetch).toHaveBeenCalledWith(
        expect.objectContaining({ email: "me@example.com" }),
      ),
    );
    await waitFor(() => expect(signOut).toHaveBeenCalledOnce());
    expect(replace).toHaveBeenCalledWith("/");
    expect(screen.getByRole("status")).toHaveTextContent(copy.success);
  });

  it("shows the mismatch copy and never signs out on a 400", async () => {
    rawErasureFetch.mockResolvedValue({ status: 400 });
    const user = userEvent.setup();
    render(<AccountDeletePanel copy={copy} exportCopy={exportCopy} showExport={false} />);

    await user.type(screen.getByLabelText(copy.emailLabel), "wrong@example.com");
    await user.click(screen.getByRole("button", { name: copy.confirmButton }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent(copy.mismatch),
    );
    expect(signOut).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("does not render the export section when showExport is false", () => {
    render(<AccountDeletePanel copy={copy} exportCopy={exportCopy} showExport={false} />);
    expect(screen.queryByRole("button", { name: exportCopy.button })).not.toBeInTheDocument();
  });
});
