import { describe, expect, it, vi } from "vitest";
// Runtime setup already loads this globally (vitest.setup.ts); imported here too so
// this app's own tsc (which doesn't include the repo-root setup file) sees the
// `expect().toHaveAttribute` etc. type augmentation.
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmailPreferences, type EmailPreferencesData } from "./EmailPreferences";

const chrome = {
  noticesHeading: "Account & security",
  loading: "Loading…",
  error: "Something went wrong.",
  retry: "Try again",
};

const DATA: EmailPreferencesData = {
  categories: [
    {
      key: "product",
      name: "Product updates",
      description: "New features and improvements.",
      includeAtSignup: true,
      granted: true,
    },
    {
      key: "marketing",
      name: "Marketing",
      description: "Offers and promotions.",
      includeAtSignup: false,
      granted: false,
    },
  ],
  notices: [
    {
      name: "Security alerts",
      description: "Sign-in and account-security notices.",
    },
  ],
  marketing_email: false,
};

describe("EmailPreferences", () => {
  it("renders a switch per category with the correct initial state, and the notice as non-interactive", async () => {
    const read = vi.fn().mockResolvedValue(DATA);
    const write = vi.fn().mockResolvedValue(undefined);

    render(<EmailPreferences read={read} write={write} chrome={chrome} />);

    await waitFor(() => expect(read).toHaveBeenCalledOnce());
    const productSwitch = await screen.findByRole("switch", { name: /product updates/i });
    const marketingSwitch = screen.getByRole("switch", { name: /marketing/i });

    expect(productSwitch).toHaveAttribute("aria-checked", "true");
    expect(marketingSwitch).toHaveAttribute("aria-checked", "false");

    // The notice renders its copy but exposes no switch/button for it.
    expect(screen.getByText("Security alerts")).toBeInTheDocument();
    expect(
      screen.queryByRole("switch", { name: /security alerts/i }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("switch")).toHaveLength(2);
  });

  it("calls write with a single-element updates array on toggle", async () => {
    const user = userEvent.setup();
    const read = vi.fn().mockResolvedValue(DATA);
    const write = vi.fn().mockResolvedValue(undefined);

    render(<EmailPreferences read={read} write={write} chrome={chrome} />);

    const marketingSwitch = await screen.findByRole("switch", { name: /marketing/i });
    await user.click(marketingSwitch);

    await waitFor(() =>
      expect(write).toHaveBeenCalledWith([{ key: "marketing", granted: true }]),
    );
    expect(marketingSwitch).toHaveAttribute("aria-checked", "true");
  });

  it("rolls back the switch and shows an error when the write fails", async () => {
    const user = userEvent.setup();
    const read = vi.fn().mockResolvedValue(DATA);
    const write = vi.fn().mockRejectedValue(new Error("save failed"));

    render(<EmailPreferences read={read} write={write} chrome={chrome} />);

    const marketingSwitch = await screen.findByRole("switch", { name: /marketing/i });
    await user.click(marketingSwitch);

    await waitFor(() => expect(marketingSwitch).toHaveAttribute("aria-checked", "false"));
    expect(screen.getByRole("alert")).toHaveTextContent(chrome.error);
  });
});
