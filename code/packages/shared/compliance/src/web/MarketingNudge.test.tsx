import { beforeEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarketingNudge } from "./MarketingNudge";

const copy = {
  title: "Get our news by email?",
  yes: "Yes",
  no: "No",
  dismiss: "Not now",
};
const KEY = "test.marketing-nudge";

beforeEach(() => localStorage.removeItem(KEY));

describe("MarketingNudge", () => {
  it("shows only when no decision is on record", async () => {
    const write = vi.fn();
    const { unmount } = render(
      <MarketingNudge
        read={async () => false}
        write={write}
        snoozeKey={KEY}
        copy={copy}
      />,
    );
    await Promise.resolve();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    render(
      <MarketingNudge
        read={async () => null}
        write={write}
        snoozeKey={KEY}
        copy={copy}
      />,
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("never shows on a failed read", async () => {
    const read = vi.fn().mockRejectedValue(new Error("down"));
    render(
      <MarketingNudge
        read={read}
        write={vi.fn()}
        snoozeKey={KEY}
        copy={copy}
      />,
    );
    await waitFor(() => expect(read).toHaveBeenCalled());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it.each([
    ["Yes", true],
    ["No", false],
  ])("%s records the decision and closes", async (label, granted) => {
    const user = userEvent.setup();
    const write = vi.fn().mockResolvedValue(undefined);
    render(
      <MarketingNudge
        read={async () => null}
        write={write}
        snoozeKey={KEY}
        copy={copy}
      />,
    );
    await user.click(await screen.findByRole("button", { name: label }));
    expect(write).toHaveBeenCalledWith(granted);
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("× snoozes on this device without recording a decision", async () => {
    const user = userEvent.setup();
    const write = vi.fn();
    const read = vi.fn(async () => null);
    const { unmount } = render(
      <MarketingNudge read={read} write={write} snoozeKey={KEY} copy={copy} />,
    );
    await user.click(await screen.findByRole("button", { name: "Not now" }));
    expect(write).not.toHaveBeenCalled();
    expect(localStorage.getItem(KEY)).toBe("1");
    unmount();

    // Snoozed → the next mount does not even read.
    read.mockClear();
    render(
      <MarketingNudge read={read} write={write} snoozeKey={KEY} copy={copy} />,
    );
    expect(read).not.toHaveBeenCalled();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
