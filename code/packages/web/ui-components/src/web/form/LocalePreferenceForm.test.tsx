import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, afterEach } from "vitest";
import { LocalePreferenceForm } from "./LocalePreferenceForm";

const copy = {
  heading: "Language", description: "Pick your language.", label: "Language",
  save: "Save", pending: "Saving…", success: "Saved", error: "Something went wrong",
};
const locales = [{ code: "en", label: "English" }, { code: "fr", label: "Français" }] as const;

afterEach(() => vi.restoreAllMocks());

describe("LocalePreferenceForm", () => {
  it("POSTs the chosen locale with the bearer token and shows success", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ locale: "fr" }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    render(
      <LocalePreferenceForm
        apiUrl="https://api.example.com"
        currentLocale="en"
        locales={locales}
        copy={copy}
        getToken={async () => "jwt-123"}
      />,
    );

    fireEvent.change(screen.getByLabelText("Language"), { target: { value: "fr" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => expect(screen.getByText("Saved")).toBeInTheDocument());
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.example.com/v1/profile/locale");
    expect((init as RequestInit).method).toBe("POST");
    expect((init as RequestInit).headers).toMatchObject({ authorization: "Bearer jwt-123" });
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ locale: "fr" });
  });

  it("shows an error when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("nope", { status: 500 })));
    render(
      <LocalePreferenceForm apiUrl="https://api.example.com" currentLocale="en"
        locales={locales} copy={copy} getToken={async () => "jwt-123"} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    await waitFor(() => expect(screen.getByText("Something went wrong")).toBeInTheDocument());
  });
});
