import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { buildDeleteAccountCopy } from "../shared/account-copy";
import { DeleteAccountSection } from "./DeleteAccountSection";

// `t` returns the key, so the copy is the message keys themselves.
const copy = buildDeleteAccountCopy((key: string) => key);

describe("DeleteAccountSection", () => {
  it("is folded: only its heading shows until the user opens it", async () => {
    const { container } = render(
      <DeleteAccountSection
        copy={copy}
        apiUrl="https://api.x"
        getToken={async () => "jwt"}
        onDeleted={vi.fn()}
      />,
    );
    const details = container.querySelector("details")!;
    expect(details.open).toBe(false);
    expect(screen.getByText("heading").closest("summary")).not.toBeNull();

    await userEvent.click(screen.getByText("heading"));
    expect(details.open).toBe(true);
    expect(screen.getByLabelText("emailLabel")).toBeVisible();
  });
});
