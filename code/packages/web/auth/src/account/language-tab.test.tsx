import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const switchTo = vi.fn(async () => {});
const persistLocale = vi.fn();
vi.mock("@indiecrafts/packages-web-i18n", () => ({
  useLocaleSwitch: () => switchTo,
}));
vi.mock("../persist-locale", () => ({ persistLocale }));

const { AccountLanguageTab } = await import("./language-tab");

const option = (name: string) => screen.getByRole("radio", { name });

describe("AccountLanguageTab", () => {
  beforeEach(() => {
    switchTo.mockClear();
    persistLocale.mockClear();
  });

  it("lists every locale by its native name, the active one checked", () => {
    render(<AccountLanguageTab locale="fr" label="Langue" />);
    expect(screen.getByRole("radiogroup", { name: "Langue" })).toBeTruthy();
    expect(option("Français").getAttribute("aria-checked")).toBe("true");
    expect(option("English").getAttribute("aria-checked")).toBe("false");
  });

  it("picking another language saves it to the profile, notifies, then switches", async () => {
    const onChange = vi.fn();
    render(
      <AccountLanguageTab locale="en" label="Language" onChange={onChange} />,
    );
    await userEvent.click(option("Français"));
    expect(persistLocale).toHaveBeenCalledWith("fr");
    expect(onChange).toHaveBeenCalledWith("fr");
    expect(switchTo).toHaveBeenCalledWith("fr");
  });

  it("arrow keys move focus without switching; Enter switches", async () => {
    render(<AccountLanguageTab locale="en" label="Language" />);
    option("English").focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(option("Français"));
    expect(switchTo).not.toHaveBeenCalled();
    await userEvent.keyboard("{Enter}");
    expect(switchTo).toHaveBeenCalledWith("fr");
  });

  it("pressing the active language again does nothing", async () => {
    render(<AccountLanguageTab locale="en" label="Language" />);
    await userEvent.click(option("English"));
    expect(persistLocale).not.toHaveBeenCalled();
    expect(switchTo).not.toHaveBeenCalled();
  });
});
