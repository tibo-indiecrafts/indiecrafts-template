import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { DoNotSellLink } from "./DoNotSellLink";
import { OPEN_PREFERENCES_EVENT } from "./consent-store";

const LABEL = "Do Not Sell or Share My Personal Information";

describe("DoNotSellLink", () => {
  it("renders nothing outside opt-out regions", () => {
    const { container } = render(<DoNotSellLink show={false} label={LABEL} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the preferences dialog when clicked in opt-out regions", () => {
    const onOpen = vi.fn();
    window.addEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    render(<DoNotSellLink show label={LABEL} />);
    fireEvent.click(screen.getByRole("button", { name: LABEL }));
    window.removeEventListener(OPEN_PREFERENCES_EVENT, onOpen);
    expect(onOpen).toHaveBeenCalledOnce();
  });
});
