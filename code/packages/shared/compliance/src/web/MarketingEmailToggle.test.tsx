import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarketingEmailToggle } from "./MarketingEmailToggle";

const props = {
  apiUrl: "https://api.test",
  getToken: async () => "jwt",
  label: "Commercial emails",
  surface: "website",
};

function stubApi(stored: boolean | null, postStatus = 200) {
  const fetchMock = vi.fn(async (_url: string, init?: RequestInit) =>
    init?.method === "POST"
      ? new Response("{}", { status: postStatus })
      : new Response(JSON.stringify({ marketing_email: stored })),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("MarketingEmailToggle", () => {
  it("reflects the stored value with the Clerk JWT", async () => {
    const fetchMock = stubApi(true);
    render(<MarketingEmailToggle {...props} />);
    const toggle = await screen.findByRole("switch", {
      name: "Commercial emails",
    });
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-checked", "true");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/v1/consent/marketing-email",
      { headers: { authorization: "Bearer jwt" } },
    );
  });

  it("an undecided user starts unchecked; a flip posts the decision", async () => {
    const user = userEvent.setup();
    const fetchMock = stubApi(null);
    render(<MarketingEmailToggle {...props} />);
    const toggle = await screen.findByRole("switch");
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-checked", "false");

    await user.click(toggle);
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-checked", "true");
    const [, init] = fetchMock.mock.calls.at(-1)!;
    expect(init?.method).toBe("POST");
    expect(JSON.parse(String(init?.body))).toEqual({
      granted: true,
      surface: "website",
    });
  });

  it("reverts when the write fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(console, "error").mockImplementation(() => {});
    stubApi(false, 500);
    render(<MarketingEmailToggle {...props} />);
    const toggle = await screen.findByRole("switch");
    await waitFor(() => expect(toggle).toBeEnabled());
    await user.click(toggle);
    await waitFor(() => expect(toggle).toBeEnabled());
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("renders nothing without an api origin", () => {
    const { container } = render(<MarketingEmailToggle {...props} apiUrl="" />);
    expect(container).toBeEmptyDOMElement();
  });
});
